import React, { useEffect, useMemo, useRef, useState } from 'react';
import useRewardStore from '../../../store/rewardStore';

/**
 * PaymentReward
 * - useRewardStore.subscribe 를 사용해 userId의 coupons 변화를 안정적으로 구독
 * - 부모에서 totalAmount 혹은 productData를 넘겨주면 그 값을 사용
 * - 기존 마크업(.pay-coupon, .pay-point, #coupon 등)을 그대로 유지
 */

const parseMinAmountFromCondition = (cond) => {
    if (!cond) return 0;
    const s = String(cond);
    const re = /(\d+(?:[.,]\d+)?)(?:\s*)(만|천)?/;
    const m = s.match(re);
    if (!m) return 0;
    let num = parseFloat(m[1].replace(',', ''));
    const unit = m[2];
    if (unit === '만') num *= 10000;
    else if (unit === '천') num *= 1000;
    return Math.round(num);
};

const PaymentReward = ({
    userId = 'u_test_1',
    productType = null,
    productData = {},
    totalAmount: totalAmountProp,
    onChange,
}) => {
    // stable local state for coupons (we'll subscribe to store)
    const [coupons, setCoupons] = useState([]);
    const [pointBalance, setPointBalance] = useState(0);

    // initial load & subscription
    useEffect(() => {
        if (!userId) {
            setCoupons([]);
            setPointBalance(0);
            return;
        }

        // 초기값 가져오기 via getter (prune 동작 포함)
        try {
            const initialCoupons = useRewardStore.getState().getCoupons(userId) || [];
            setCoupons(initialCoupons);
            const pts = useRewardStore.getState().getPoints(userId) || { balance: 0 };
            setPointBalance(pts.balance || 0);
        } catch (e) {
            console.warn('PaymentReward: failed to read initial rewardStore state', e);
        }

        // subscribe to coupons and points changes for this user
        const unsubCoupons = useRewardStore.subscribe(
            (s) => s.rewardByUser?.[userId]?.coupons ?? [],
            (next) => {
                setCoupons(next || []);
            }
        );
        const unsubPoints = useRewardStore.subscribe(
            (s) => {
                const p = s.rewardByUser?.[userId]?.points || { items: [] };
                const balance = (p.items || []).reduce(
                    (sum, it) => sum + (Number(it.amount) || 0),
                    0
                );
                return balance;
            },
            (nextBalance) => {
                setPointBalance(nextBalance || 0);
            }
        );

        return () => {
            try {
                unsubCoupons();
                unsubPoints();
            } catch {}
        };
    }, [userId]);

    // compute totalAmount: prop preferred, else productData.roomPrice * nights
    const roomPrice = Number(productData?.roomPrice ?? productData?.price ?? 0) || 0;
    const nights = Number(productData?.nights ?? 1) || 1;
    const totalAmount =
        typeof totalAmountProp === 'number'
            ? totalAmountProp
            : Math.max(0, Math.round(roomPrice * nights));

    // local UI state
    const [selectedCouponId, setSelectedCouponId] = useState('');
    const [usePoints, setUsePoints] = useState(0);

    // determine usable coupons for this context
    const isCouponUsableForContext = (c) => {
        if (!c) return false;
        if (c.disabled) return false;
        const cls = (c.className || '').toLowerCase();
        if (productType) {
            const want =
                productType === 'hotel'
                    ? 'c-hotel'
                    : productType === 'tour' || productType === 'package'
                    ? 'c-tour'
                    : productType === 'flight'
                    ? 'c-air'
                    : null;
            if (want && cls !== want) return false;
        }
        const min = parseMinAmountFromCondition(c.condition || '');
        if (totalAmount < min) return false;
        return true;
    };

    const usableCount = useMemo(
        () => (Array.isArray(coupons) ? coupons.filter(isCouponUsableForContext).length : 0),
        [coupons, totalAmount, productType]
    );

    const couponAmount = useMemo(() => {
        const sel = (coupons || []).find((c) => String(c.id) === String(selectedCouponId));
        return sel ? Number(sel.amount || 0) : 0;
    }, [coupons, selectedCouponId]);

    // 자동 선택: coupons가 비어있다가 채워졌을 때 첫 사용 가능 쿠폰 선택
    const prevLenRef = useRef((coupons || []).length);
    useEffect(() => {
        const prev = prevLenRef.current || 0;
        const curr = (coupons || []).length || 0;
        if (curr > prev && !selectedCouponId) {
            const first = (coupons || []).find(isCouponUsableForContext);
            if (first) setSelectedCouponId(String(first.id));
        }
        prevLenRef.current = curr;
    }, [coupons, totalAmount, productType, selectedCouponId]);

    // clamp usePoints to allowed max
    useEffect(() => {
        const maxAllowed = Math.max(0, totalAmount - couponAmount);
        const clamped = Math.min(pointBalance || 0, maxAllowed);
        if (usePoints > clamped) setUsePoints(clamped);
        const finalAmount = Math.max(
            0,
            Math.round(totalAmount - couponAmount - Math.min(usePoints, clamped))
        );
        const selectedCoupon =
            (coupons || []).find((c) => String(c.id) === String(selectedCouponId)) || null;
        onChange?.({
            coupon: selectedCoupon,
            usedPoints: Math.min(usePoints, clamped),
            couponAmount: Number(couponAmount || 0),
            finalAmount,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCouponId, usePoints, totalAmount, pointBalance, couponAmount, coupons]);

    const handleSelectCoupon = (e) => setSelectedCouponId(e.target.value || '');
    const handlePointChange = (e) => {
        const raw = Number(e.target.value || 0);
        const maxAllowed = Math.max(0, totalAmount - couponAmount);
        const v = Math.max(0, Math.min(raw, pointBalance || 0, maxAllowed));
        setUsePoints(Number.isFinite(v) ? v : 0);
    };
    const handleUseAllPoints = () => {
        const maxAllowed = Math.max(0, totalAmount - couponAmount);
        setUsePoints(Math.min(pointBalance || 0, maxAllowed));
    };

    // debug: show coupon objects when empty to help troubleshooting
    useEffect(() => {
        if ((coupons || []).length === 0) {
            console.debug(
                'PaymentReward DEBUG: coupons array is empty for userId=',
                userId,
                'store snapshot:',
                useRewardStore.getState().rewardByUser?.[userId]
            );
        }
    }, [coupons, userId]);

    return (
        <div className="payment-reward">
            <div className="pay-coupon">
                <h4>쿠폰</h4>
                <select
                    id="coupon"
                    name="select-coupon"
                    value={selectedCouponId}
                    onChange={handleSelectCoupon}
                >
                    <option value="" disabled hidden>
                        사용 가능한 쿠폰 {usableCount}개
                    </option>

                    {(coupons || []).map((c) => {
                        const min = parseMinAmountFromCondition(c.condition || '');
                        const usable = isCouponUsableForContext(c);
                        return (
                            <option
                                key={c.id}
                                value={String(c.id)}
                                disabled={!usable}
                                title={
                                    !usable
                                        ? totalAmount < min
                                            ? `최소 결제금액 ${min.toLocaleString()}원 필요`
                                            : '카테고리 제한 또는 비활성화'
                                        : ''
                                }
                            >
                                {c.label}{' '}
                                {c.amount ? `- ${Number(c.amount).toLocaleString()}원` : ''} (
                                {c.condition})
                            </option>
                        );
                    })}
                </select>
            </div>

            <div className="pay-point">
                <h4>포인트</h4>
                <p>
                    RT 포인트 <span>{Number(pointBalance).toLocaleString()}</span>P
                </p>
                <div className="point-input">
                    <input
                        type="number"
                        min={0}
                        max={Number(pointBalance) || 0}
                        value={usePoints}
                        onChange={handlePointChange}
                    />
                    <button type="button" onClick={handleUseAllPoints}>
                        전액 사용
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentReward;

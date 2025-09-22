// src/components/hotels/HotelPaymentRight.jsx
import './style.scss';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useMemo, useState } from 'react';
import useAuthStore from '../../store/authStore';

const HotelPaymentRight = ({
    hotel,
    selectedRoom,
    totalPrice, // 있으면 우선 사용, 없으면 계산
    nights = 1,
    people,
    startDate,
    endDate,
    paymentMethod = 'card',
    rewardState,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id || 'u_test_1';

    const clientKey =
        import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

    const generateOrderId = () => {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `hotel_${timestamp}_${randomStr}`;
    };

    const getPaymentMethodKey = (method) => {
        const methodMap = {
            card: '카드',
            tosspay: '토스페이',
            naverpay: '네이버페이',
            kakaopay: '카카오페이',
        };
        return methodMap[method] || '카드';
    };

    const baseAmount = useMemo(() => {
        if (typeof totalPrice === 'number') return Math.max(0, Math.round(totalPrice));
        const unit = Number(selectedRoom?.price ?? selectedRoom?.rate ?? hotel?.price ?? 0) || 0;
        return Math.max(0, Math.round(unit * (Number(nights) || 1)));
    }, [totalPrice, selectedRoom, hotel, nights]);

    const couponAmount = Math.max(0, Number(rewardState?.couponAmount || 0));
    const usedPoints = Math.max(0, Number(rewardState?.usedPoints || 0));

    const finalAmount = useMemo(() => {
        const v = baseAmount - couponAmount - usedPoints;
        return Math.max(0, Math.round(v));
    }, [baseAmount, couponAmount, usedPoints]);

    const handlePayment = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            // 성공 페이지에서 사용할 결제/상품 데이터
            const paymentData = {
                hotel,
                selectedRoom,
                baseAmount,
                nights,
                people,
                startDate,
                endDate,
                productType: 'hotel',
                rewardState: {
                    coupon: rewardState?.coupon,
                    usedPoints: rewardState?.usedPoints,
                    couponAmount: rewardState?.couponAmount,
                },
            };
            localStorage.setItem('paymentData', JSON.stringify(paymentData));

            // 쿠폰/포인트도 함께 저장 (성공 페이지에서 최종 반영)
            const pendingReward = {
                userId,
                coupon: rewardState?.coupon
                    ? {
                          id: rewardState.coupon.id,
                          amount: rewardState.coupon.amount,
                          label: rewardState.coupon.label,
                      }
                    : null,
                usedPoints,
                couponAmount,
                finalAmount,
            };
            localStorage.setItem('pendingReward', JSON.stringify(pendingReward));

            const tossPayments = await loadTossPayments(clientKey);
            const orderId = generateOrderId();
            const paymentMethodKey = getPaymentMethodKey(paymentMethod);

            await tossPayments.requestPayment(paymentMethodKey, {
                amount: finalAmount, // ✅ 쿠폰/포인트 반영된 최종 금액
                orderId,
                orderName: `${hotel.name} - ${selectedRoom.name} (${nights}박)`,
                customerName: '홍길동',
                customerEmail: 'abcd@gmail.com',
                customerMobilePhone: '01023457890',
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                flowMode: 'DEFAULT',
                easyPay:
                    paymentMethod === 'tosspay'
                        ? 'tosspay'
                        : paymentMethod === 'naverpay'
                        ? 'naverpay'
                        : paymentMethod === 'kakaopay'
                        ? 'kakaopay'
                        : undefined,
            });
        } catch (error) {
            console.error('결제 오류:', error);
            setIsProcessing(false);

            if (error.code === 'USER_CANCEL') alert('결제가 취소되었습니다.');
            else if (error.code === 'INVALID_CARD_COMPANY') alert('유효하지 않은 카드입니다.');
            else alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="pay payment-right">
            <div className="res-title">
                <div className="ht-img">
                    <img src={`/images/hotels/detail/hotelsList/${hotel.image[0]}`} alt="" />
                </div>
                <div className="text">
                    <span>
                        {hotel.type} {hotel.star}
                    </span>
                    <span>{hotel.name}</span>
                    <span>{selectedRoom.name}</span>
                </div>
            </div>

            <div className="res-prices">
                <ul className="price total">
                    <li>
                        <b>요금 합계</b>
                        <b>{baseAmount.toLocaleString()}원</b>
                    </li>
                    <li>
                        <span>객실 1개 X {nights}박</span>
                        <span>{baseAmount.toLocaleString()}원</span>
                    </li>
                </ul>

                <ul className="price discount">
                    <li>
                        <b>할인 혜택</b>
                        <b>-{(couponAmount + usedPoints).toLocaleString()}원</b>
                    </li>
                    <li>
                        <span>상품 및 쿠폰 할인</span>
                        <span>-{couponAmount.toLocaleString()}원</span>
                    </li>
                    <li>
                        <span>포인트 사용</span>
                        <span>-{usedPoints.toLocaleString()}원</span>
                    </li>
                </ul>

                <p>
                    <strong>총액</strong>
                    <strong>{finalAmount.toLocaleString()}원</strong>
                </p>
            </div>

            <p className="assent">
                <input type="checkbox" />
                개인정보 처리 및 이용약관에 동의합니다.
            </p>
            <button className="pay-btn" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? '결제 처리 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
            </button>
        </div>
    );
};

export default HotelPaymentRight;

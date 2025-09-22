// src/components/payment/FlightPaymentRight.jsx
import './style.scss';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useState } from 'react';
import useAirportStore from '../../store/airportStore';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';

const FlightPaymentRight = ({
    airport,
    segments = [],
    totalPrice = 0,
    paymentMethod = 'card',

    // 🔽 왼쪽(FlightPaymentLeft)에서 넘겨줄 수 있는 선택 값들 (없으면 0으로 처리)
    couponAmount = 0,
    usedPoints = 0,
    selectedCoupon = null, // { id, label, amount, ... } 넘겨줄 수 있음
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isTermsVisible, setIsTermsVisible] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const filters = useAirportStore((s) => s.filters);

    const clientKey =
        import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

    // 결제 수단별 매핑
    const getPaymentMethodKey = (method) => {
        const map = {
            card: '카드',
            tosspay: '토스페이',
            naverpay: '네이버페이',
            kakaopay: '카카오페이',
        };
        return map[method] || '카드';
    };

    // 주문 ID
    const generateOrderId = () => {
        const ts = Date.now();
        const rnd = Math.random().toString(36).slice(2, 8);
        return `flight_${ts}_${rnd}`;
    };

    const getTripTypeText = () => (filters.mode === 'roundtrip' ? '왕복' : '편도');
    const getSegmentTitle = (idx) =>
        filters.mode === 'roundtrip' ? (idx === 0 ? '가는편' : '오는편') : '가는편';

    // ✅ 최종 결제 금액 (음수 방지)
    const safe = (n) => Math.max(0, Math.round(Number(n || 0)));
    const price = safe(totalPrice);
    const coupon = safe(couponAmount);
    const points = safe(usedPoints);
    const finalAmount = safe(price - coupon - points);

    const handlePayment = async () => {
        if (isProcessing) return;
        if (!agreed) {
            alert('개인정보 처리 및 이용약관에 동의해 주세요.');
            return;
        }
        if (!airport || !segments.length) {
            alert('항공권 정보를 확인할 수 없습니다.');
            return;
        }

        setIsProcessing(true);
        try {
            // ✅ 결제 완료 페이지에서 사용할 데이터 저장
            const paymentData = {
                productType: 'flight',
                airport,
                segments,
                filters,
                totalPrice: price,
                discount: {
                    couponAmount: coupon,
                    pointAmount: points,
                    selectedCoupon,
                },
                finalAmount,
            };
            localStorage.setItem('paymentData', JSON.stringify(paymentData));

            const tossPayments = await loadTossPayments(clientKey);
            const orderId = generateOrderId();
            const paymentMethodKey = getPaymentMethodKey(paymentMethod);

            await tossPayments.requestPayment(paymentMethodKey, {
                amount: finalAmount, // ✅ 최종 결제 금액
                orderId,
                orderName: `${airport.airline} ${airport.flightNo} - ${getTripTypeText()} (${
                    filters.people
                }명)`,
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
            if (error?.code === 'USER_CANCEL') alert('결제가 취소되었습니다.');
            else if (error?.code === 'INVALID_CARD_COMPANY') alert('유효하지 않은 카드입니다.');
            else alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    if (!airport) return <div>항공권 정보를 불러올 수 없습니다.</div>;

    return (
        <div className="pay payment-right">
            <div className="flight-title">
                <div className="flight-info" />
            </div>

            <div className="flight-segments">
                <div className="airline-logo">
                    {airport.logo ? (
                        <img src={airport.logo} alt={airport.airline} />
                    ) : (
                        <span className="placeholder-logo">{airport.airline?.[0] || 'A'}</span>
                    )}
                </div>
                {segments.map((seg, idx) => (
                    <div key={idx} className="segment-summary">
                        <div className="segment-header">
                            <h4>{getSegmentTitle(idx)}</h4>
                            <span className="flight-date">{seg.departureDate}</span>
                        </div>
                        <div className="segment-route">
                            <div className="departure">
                                <span className="airport">{airport.departCode}</span>
                            </div>
                            <div className="flight-line">
                                <img src="/images/icon/air-arrow.svg" alt="비행" />
                            </div>
                            <div className="arrival">
                                <span className="airport">{airport.arriveCode}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="res-prices">
                <ul className="price total">
                    <li>
                        <b>요금 합계</b>
                        <b>{price.toLocaleString()}원</b>
                    </li>
                    <li>
                        <span>
                            성인 {filters.people}명 x {getTripTypeText()}
                        </span>
                        <span>{price.toLocaleString()}원</span>
                    </li>
                    <li>
                        <span>항공료 및 유류할증료</span>
                        <span>35,200원</span>
                    </li>
                </ul>

                <ul className="price discount">
                    <li>
                        <b>할인 혜택</b>
                        <b>-{(coupon + points).toLocaleString()}원</b>
                    </li>
                    <li>
                        <span>상품 및 쿠폰 할인</span>
                        <span>-{coupon.toLocaleString()}원</span>
                    </li>
                    <li>
                        <span>포인트 사용</span>
                        <span>-{points.toLocaleString()}원</span>
                    </li>
                </ul>

                <p className="final-total">
                    <strong>총액</strong>
                    <strong>{finalAmount.toLocaleString()}원</strong>
                </p>
            </div>

            <p className="assent">
                <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree-terms">개인정보 처리 및 이용약관에 동의합니다.</label>
                {isTermsVisible ? (
                    <RiArrowDropUpLine onClick={() => setIsTermsVisible(false)} />
                ) : (
                    <RiArrowDropDownLine onClick={() => setIsTermsVisible(true)} />
                )}
            </p>

            {isTermsVisible && (
                <div className="terms-content absolute">
                    <p>• 결제 완료 후 항공권 발권까지 최대 24시간이 소요될 수 있습니다.</p>
                    <p>• 항공사 사정에 따라 스케줄이 변경될 수 있습니다.</p>
                    <p>• 취소 및 변경 규정은 항공사 정책을 따릅니다.</p>
                </div>
            )}

            <button className="pay-btn" onClick={handlePayment} disabled={isProcessing || !agreed}>
                {isProcessing ? '결제 처리 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
            </button>
        </div>
    );
};

export default FlightPaymentRight;

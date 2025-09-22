import './style.scss';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useState } from 'react';
import useAirportStore from '../../store/airportStore';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { RiArrowDropUpLine } from 'react-icons/ri';

const FlightPaymentRight = ({ airport, segments, totalPrice, paymentMethod = 'card', }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const filters = useAirportStore((state) => state.filters);
    const [isTermsVisible, setIsTermsVisible] = useState(false);

    const clientKey =
        import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

    // 주문 ID 생성 함수
    const generateOrderId = () => {
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `flight_${timestamp}_${randomStr}`;
    };

    // 결제 수단별 매핑
    const getPaymentMethodKey = (method) => {
        const methodMap = {
            card: '카드',
            tosspay: '토스페이',
            naverpay: '네이버페이',
            kakaopay: '카카오페이',
        };
        return methodMap[method] || '카드';
    };

    // 항공권 타입에 따른 텍스트
    const getTripTypeText = () => {
        return filters.mode === 'roundtrip' ? '왕복' : '편도';
    };

    // 세그먼트별 제목
    const getSegmentTitle = (index) => {
        if (filters.mode === 'roundtrip') {
            return index === 0 ? '가는편' : '오는편';
        }
        return '가는편';
    };

    const handlePayment = async () => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
            // 결제 데이터를 localStorage에 임시 저장 (결제 완료 페이지에서 사용)
            const paymentData = {
                airport,
                segments,
                totalPrice,
                filters,
                productType: 'flight',
            };
            localStorage.setItem('paymentData', JSON.stringify(paymentData));

            const tossPayments = await loadTossPayments(clientKey);
            const orderId = generateOrderId();
            const paymentMethodKey = getPaymentMethodKey(paymentMethod);

            await tossPayments.requestPayment(paymentMethodKey, {
                amount: 892800, // 최종 결제 금액
                orderId: orderId,
                orderName: `${airport.airline} ${airport.flightNo} - ${getTripTypeText()} (${
                    filters.people
                }명)`,
                customerName: '홍길동',
                customerEmail: 'abcd@gmail.com',
                customerMobilePhone: '01023457890',
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                flowMode: 'DEFAULT',
                easyPay: paymentMethod === 'tosspay' ? 'tosspay' : undefined,
                ...(paymentMethod === 'naverpay' && { easyPay: 'naverpay' }),
                ...(paymentMethod === 'kakaopay' && { easyPay: 'kakaopay' }),
            });
        } catch (error) {
            console.error('결제 오류:', error);
            setIsProcessing(false);

            if (error.code === 'USER_CANCEL') {
                alert('결제가 취소되었습니다.');
            } else if (error.code === 'INVALID_CARD_COMPANY') {
                alert('유효하지 않은 카드입니다.');
            } else {
                alert('결제 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleToggleTerms = () => {
        setIsTermsVisible(!isTermsVisible);
    };

    if (!airport || !segments) {
        return <div>항공권 정보를 불러올 수 없습니다.</div>;
    }

    return (
        <div className="pay payment-right">
            <div className="flight-title">
                <div className="flight-info"></div>
            </div>

            <div className="flight-segments">
                <div className="airline-logo">
                    {airport.logo ? (
                        <img src={airport.logo} alt={airport.airline} />
                    ) : (
                        <span className="placeholder-logo">{airport.airline.charAt(0)}</span>
                    )}
                </div>
                {segments.map((segment, index) => (
                    <div key={index} className="segment-summary">
                        <div className="segment-header">
                            <h4>{getSegmentTitle(index)}</h4>
                            <span className="flight-date">{segment.departureDate}</span>
                        </div>
                        <div className="segment-route">
                            <div className="departure">
                                {/* <span className="time">{airport.departureTime}</span> */}
                                <span className="airport">{airport.departCode}</span>
                            </div>
                            <div className="flight-line">
                                <img src="/images/icon/air-arrow.svg" alt="비행" />
                            </div>
                            <div className="arrival">
                                {/* <span className="time">{airport.arrivalTime}</span> */}
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
                        <b>{totalPrice ? totalPrice.toLocaleString() : '900,000'}원</b>
                    </li>
                    <li>
                        <span>
                            성인 {filters.people}명 x {getTripTypeText()}
                        </span>
                        <span>{totalPrice ? totalPrice.toLocaleString() : '900,000'}원</span>
                    </li>
                    <li>
                        <span>항공료 및 유류할증료</span>
                        <span>35,200원</span>
                    </li>
                </ul>

                <ul className="price discount">
                    <li>
                        <b>할인 혜택</b>
                        <b>-52,400원</b>
                    </li>
                    <li>
                        <span>상품 및 쿠폰 할인</span>
                        <span>-52,400원</span>
                    </li>
                    <li>
                        <span>마일리지</span>
                        <span>-0원</span>
                    </li>
                </ul>

                <p className="final-total">
                    <strong>총액</strong>
                    <strong>892,800원</strong>
                </p>
            </div>

            <p className="assent">
                <input type="checkbox" id="agree-terms" />
                <label htmlFor="agree-terms">개인정보 처리 및 이용약관에 동의합니다.</label>
                {isTermsVisible ? (
                    <RiArrowDropUpLine onClick={handleToggleTerms} />
                ) : (
                    <RiArrowDropDownLine onClick={handleToggleTerms} />
                )}
            </p>

            {isTermsVisible && ( // 상태가 true일 때만 약관 내용 렌더링
                <div className="terms-content absolute">
                    {/* absolute 클래스 추가 */}
                    <p>• 결제 완료 후 항공권 발권까지 최대 24시간이 소요될 수 있습니다.</p>
                    <p>• 항공사 사정에 따라 스케줄이 변경될 수 있습니다.</p>
                    <p>• 취소 및 변경 규정은 항공사 정책을 따릅니다.</p>
                </div>
            )}

            <button className="pay-btn" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? '결제 처리 중...' : '892,800원 결제하기'}
            </button>
        </div>
    );
};

export default FlightPaymentRight;

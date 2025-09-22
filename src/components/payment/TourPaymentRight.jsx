
// src/components/payment/TourPaymentRight.jsx
import './style.scss';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useState } from 'react';

const TourPaymentRight = ({
    // 상품/선택 옵션/인원/날짜
    tour,
    option = null, // 예: { title: '오전타임', price: 120000 } 등
    party = { adults: 1, children: 0 },
    startDate,
    endDate,

    // 가격 및 결제
    totalPrice = 0, // 좌측에서 계산된 원가 총액
    paymentMethod = 'card', // 'card' | 'tosspay' | 'naverpay' | 'kakaopay'

    // 할인(좌측 PaymentReward에서 전달)
    couponAmount = 0,
    usedPoints = 0,
    selectedCoupon = null, // { id, label, amount, ... } | null
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const clientKey =
        import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

    const safe = (n) => Math.max(0, Math.round(Number(n || 0)));
    const price = safe(totalPrice);
    const coupon = safe(couponAmount);
    const points = safe(usedPoints);
    const finalAmount = safe(price - coupon - points);

    const generateOrderId = () => {
        const ts = Date.now();
        const rnd = Math.random().toString(36).slice(2, 8);
        return `tour_${ts}_${rnd}`;
    };

    const getPaymentMethodKey = (method) => {
        const map = {
            card: '카드',
            tosspay: '토스페이',
            naverpay: '네이버페이',
            kakaopay: '카카오페이',
        };
        return map[method] || '카드';
    };

    const imgSrc =
        (tour?.image?.[0] && `/images/tour/${tour.image[0]}`) ||
        tour?.thumb ||
        '/images/tour/default.jpg';

    const peopleTotal = Number(party?.adults || 0) + Number(party?.children || 0);

    const handlePayment = async () => {
        if (isProcessing) return;
        if (!tour) {
            alert('투어 정보를 확인할 수 없습니다.');
            return;
        }

        setIsProcessing(true);
        try {
            // ✅ 결제 완료 페이지에서 표시할 데이터 저장
            const paymentData = {
                productType: 'tour',
                tour,
                option,
                party,
                startDate,
                endDate,
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
            const methodKey = getPaymentMethodKey(paymentMethod);

            await tossPayments.requestPayment(methodKey, {
                amount: finalAmount, // ✅ 최종 결제 금액
                orderId,
                orderName: `${tour?.name || '투어'}${
                    option?.title ? ` - ${option.title}` : ''
                } (${peopleTotal}명)`,
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

    // ⬇️ 호텔 결제 오른쪽과 "동일한 클래스/마크업 구조" 유지
    return (
        <div className="pay payment-right">
            <div className="res-title">
                <div className="ht-img">
                    <img src={imgSrc} alt={tour?.name || 'tour'} />
                </div>
                <div className="text">
                    <span>투어</span>
                    <span>{tour?.name || '투어 상품'}</span>
                    <span>{option?.title || tour?.location || ''}</span>
                </div>
            </div>

            <div className="res-prices">
                <ul className="price total">
                    <li>
                        <b>요금 합계</b>
                        <b>{price.toLocaleString()}원</b>
                    </li>
                    <li>
                        <span>
                            인원 {peopleTotal}명{option?.title ? ` · ${option.title}` : ''}
                        </span>
                        <span>{price.toLocaleString()}원</span>
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

                <p>
                    <strong>총액</strong>
                    <strong>{finalAmount.toLocaleString()}원</strong>
                </p>
            </div>

            <p className="assent">
                <span></span>개인정보 처리 및 이용약관에 동의합니다.
            </p>

            <button className="pay-btn" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? '결제 처리 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
            </button>
        </div>
    );
};

export default TourPaymentRight;

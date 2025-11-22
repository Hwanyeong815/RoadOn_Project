// src/components/payment/TourPaymentRight.jsx
import './style.scss';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useState, useMemo } from 'react';

// 이미지 기본 경로를 상수로 정의 (프로젝트 구조에 따라 조정 필요)
const TOUR_IMG_BASE = '/images/tour'; 

const TourPaymentRight = ({
    // 상품/선택 옵션/인원/날짜
    tour, // tourData 전체가 넘어옴
    option = null, 
    party = { adults: 0, children: 0, infants: 0 }, 
    startDate,
    endDate,

    // 가격 및 결제
    totalPrice = 0, 
    paymentMethod = 'card',

    // 할인(좌측 PaymentReward에서 전달)
    couponAmount = 0,
    usedPoints = 0,
    selectedCoupon = null,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const clientKey =
        import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

    const safe = (n) => Math.max(0, Math.round(Number(n || 0)));
    
    // 인원별 단가 및 수량 추출
    const adultFee = safe(tour?.adult_fee || 0);
    const childFee = safe(tour?.child_fee || 0);
    const adultCount = safe(party.adults);
    const childCount = safe(party.children);
    const adultPrice = adultCount * adultFee;
    const childPrice = childCount * childFee;
    
    const calculatedBaseAmount = useMemo(() => {
        return adultPrice + childPrice;
    }, [adultPrice, childPrice]);
    
    const coupon = safe(couponAmount);
    const points = safe(usedPoints);
    const finalAmount = safe(calculatedBaseAmount - coupon - points);

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

    // ==========================================================
    // ✅ 이미지 소스 계산 로직 수정
    const imgSrc = useMemo(() => {
        // 1. tour 객체에서 posterImg 사용 (썸네일 이미지)
        if (tour?.posterImg) return tour.posterImg.startsWith('/') ? tour.posterImg : `${TOUR_IMG_BASE}/${tour.posterImg}`;
        
        // 2. tour 객체에 images 배열이 있다면 첫 번째 이미지 사용
        if (Array.isArray(tour?.images) && tour.images.length > 0) {
            const firstImg = tour.images[0];
            return firstImg.startsWith('/') ? firstImg : `${TOUR_IMG_BASE}/${firstImg}`;
        }
        
        // 3. 대체 이미지
        return '/images/tour/default.jpg';
    }, [tour]);
    // ==========================================================

    const peopleTotal = adultCount + childCount;

    const handlePayment = async () => {
        if (isProcessing) return;
        if (!tour) {
            alert('투어 정보를 확인할 수 없습니다.');
            return;
        }

        setIsProcessing(true);
        try {
            const paymentData = {
                productType: 'tour',
                tour,
                option,
                party,
                startDate,
                endDate,
                baseAmount: calculatedBaseAmount, 
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
                amount: finalAmount, 
                orderId,
                orderName: `${tour?.title || '투어'}${ // ✅ tour?.title 사용
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

    return (
        <div className="pay payment-right">
            <div className="res-title">
                <div className="ht-img">
                    <img src={imgSrc} alt={tour?.title || 'tour'} /> {/* ✅ imgSrc 사용 */}
                </div>
                <div className="text">
                    <span>투어</span>
                    <span>{tour?.title || '투어 상품'}</span> {/* ✅ tour?.title 사용 */}
                    <span>{option?.title || tour?.location || ''}</span>
                </div>
            </div>

            <div className="res-prices">
                <ul className="price total">
                    <li>
                        <b>요금 합계</b>
                        <b>{calculatedBaseAmount.toLocaleString()}원</b>
                    </li>
                    
                    {/* 성인 인원별 요금 세부 표시 */}
                    {adultCount > 0 && (
                        <li>
                            <span>성인 {adultCount}명</span>
                            <span>{adultPrice.toLocaleString()}원</span>
                        </li>
                    )}
                    
                    {/* 아동 인원별 요금 세부 표시 */}
                    {childCount > 0 && (
                        <li>
                            <span>아동 {childCount}명</span>
                            <span>{childPrice.toLocaleString()}원</span>
                        </li>
                    )}
                    
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
                <input type="checkbox" />개인정보 처리 및 이용약관에 동의합니다.
            </p>

            <button className="pay-btn" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? '결제 처리 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
            </button>
        </div>
    );
};

export default TourPaymentRight;
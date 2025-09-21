import './style.scss';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { useState } from 'react';

const HotelPaymentRight = ({ hotel, selectedRoom, totalPrice, nights, paymentMethod = 'card' }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    
    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
    
    // 주문 ID 생성 함수
    const generateOrderId = () => {
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `hotel_${timestamp}_${randomStr}`;
    };

    // 결제 수단별 매핑
    const getPaymentMethodKey = (method) => {
        const methodMap = {
            'card': '카드',
            'tosspay': '토스페이',
            'naverpay': '네이버페이',
            'kakaopay': '카카오페이'
        };
        return methodMap[method] || '카드';
    };

    const handlePayment = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        
        try {
            const tossPayments = await loadTossPayments(clientKey);
            const orderId = generateOrderId();
            const paymentMethodKey = getPaymentMethodKey(paymentMethod);
            
            await tossPayments.requestPayment(paymentMethodKey, {
                amount: 450760, // 최종 결제 금액
                orderId: orderId,
                orderName: `${hotel.name} - ${selectedRoom.name} (${nights}박)`,
                customerName: '홍길동',
                customerEmail: 'abcd@gmail.com',
                customerMobilePhone: '01023457890',
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                // 추가 옵션들
                flowMode: 'DEFAULT', // 기본 결제 플로우
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
                        <b>{totalPrice.toLocaleString()}원</b>
                    </li>
                    <li>
                        <span>객실 1개 X {nights}박</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                    </li>
                </ul>
                <ul className="price discount">
                    <li>
                        <b>할인 혜택</b>
                        <b>-11,800원</b>
                    </li>
                    <li>
                        <span>상품 및 쿠폰 할인</span>
                        <span>-11,800원</span>
                    </li>
                    <li>
                        <span>포인트 사용</span>
                        <span>-0원</span>
                    </li>
                </ul>
                <p>
                    <strong>총액</strong>
                    <strong>450,760원</strong>
                </p>
            </div>
            <p className="assent">
                <span></span>개인정보 처리 및 이용약관에 동의합니다.
            </p>
            <button 
                className='pay-btn' 
                onClick={handlePayment}
                disabled={isProcessing}
            >
                {isProcessing ? '결제 처리 중...' : '450,760원 결제하기'}
            </button>
        </div>
    );
};

export default HotelPaymentRight;
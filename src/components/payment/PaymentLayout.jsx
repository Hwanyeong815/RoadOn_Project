// src/components/payment/PaymentLayout.jsx
import { useState } from 'react';
import FlightPaymentLeft from './FlightPaymentLeft';
import FlightPaymentRight from './FlightPaymentRight';
import HotelPaymentLeft from './HotelPaymentLeft';
import HotelPaymentRight from './HotelPaymentRight';
import TourPaymentLeft from './TourPaymentLeft';
import TourPaymentRight from './TourPaymentRight';

const PaymentLayout = ({ productType, productData }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

    // ✅ 부모에서 rewardState를 갖고 좌/우에 내려준다.
    const [rewardState, setRewardState] = useState({
        coupon: null,
        usedPoints: 0,
        couponAmount: 0,
        finalAmount: 0,
    });

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
    };

    const renderPaymentContent = () => {
        switch (productType) {
            case 'hotel':
                return {
                    left: (
                        <HotelPaymentLeft
                            {...productData}
                            onPaymentMethodChange={handlePaymentMethodChange}
                            onRewardChange={setRewardState} // ✅ 추가
                        />
                    ),
                    right: (
                        <HotelPaymentRight
                            {...productData}
                            paymentMethod={selectedPaymentMethod}
                            rewardState={rewardState} // ✅ 추가
                        />
                    ),
                };
            case 'flight':
                return {
                    left: (
                        <FlightPaymentLeft
                            {...productData}
                            onPaymentMethodChange={handlePaymentMethodChange}
                            // (필요 시) 좌측에서도 PaymentReward 쓰면 onRewardChange={setRewardState} 넘겨주세요.
                        />
                    ),
                    right: (
                        <FlightPaymentRight
                            {...productData}
                            paymentMethod={selectedPaymentMethod}
                            // ✅ rewardState를 낱개로 풀어서 전달
                            couponAmount={rewardState.couponAmount}
                            usedPoints={rewardState.usedPoints}
                            selectedCoupon={rewardState.coupon}
                        />
                    ),
                };
            case 'tour':
                return {
                    left: (
                        <TourPaymentLeft
                            {...productData}
                            onRewardChange={setRewardState} // ✅ 좌측에서 PaymentReward의 onChange로 값 채우기
                        />
                    ),
                    right: (
                        <TourPaymentRight
                            {...productData}
                            paymentMethod={selectedPaymentMethod}
                            // ✅ 마찬가지로 낱개로 전달
                            couponAmount={rewardState.couponAmount}
                            usedPoints={rewardState.usedPoints}
                            selectedCoupon={rewardState.coupon}
                        />
                    ),
                };
            default:
                return null;
        }
    };

    const content = renderPaymentContent();

    return (
        <main className="payment">
            <div className="inner">
                {content?.left}
                {content?.right}
            </div>
        </main>
    );
};

export default PaymentLayout;

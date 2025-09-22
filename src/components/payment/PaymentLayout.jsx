import { useState } from 'react';
import FlightPaymentLeft from './FlightPaymentLeft';
import FlightPaymentRight from './FlightPaymentRight';
import HotelPaymentLeft from './HotelPaymentLeft';
import HotelPaymentRight from './HotelPaymentRight';
import TourPaymentLeft from './TourPaymentLeft';
import TourPaymentRight from './TourPaymentRight';

const PaymentLayout = ({ productType, productData }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

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
                        />
                    ),
                    right: (
                        <HotelPaymentRight {...productData} paymentMethod={selectedPaymentMethod} />
                    ),
                };
            case 'flight':
                return {
                    left: (
                        <FlightPaymentLeft
                            {...productData}
                            onPaymentMethodChange={handlePaymentMethodChange}
                        />
                    ),
                    right: (
                        <FlightPaymentRight
                            {...productData}
                            paymentMethod={selectedPaymentMethod}
                        />
                    ),
                };
            case 'tour':
                return {
                    left: <TourPaymentLeft {...productData} />,
                    right: <TourPaymentRight {...productData} />,
                };
            default:
                return null;
        }
    };

    const content = renderPaymentContent();

    return (
        <main className="payment">
            <div className="inner">
                {content.left}
                {content.right}
            </div>
        </main>
    );
};

export default PaymentLayout;

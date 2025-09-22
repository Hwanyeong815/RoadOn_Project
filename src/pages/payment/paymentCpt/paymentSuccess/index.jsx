// PaymentSuccess.jsx
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PaymentSuccessLeft from '../../../../components/payCompleted/PaymentSuccessLeft';
import PaymentSuccessRight from '../../../../components/payCompleted/PaymentSuccessRight';

const PaymentSuccess = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [reservationData, setReservationData] = useState(null);
    const [loading, setLoading] = useState(true);

    // URL 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    useEffect(() => {
        // 결제 완료 후 예약 정보 처리
        const processPaymentSuccess = async () => {
            try {
                // 실제로는 API 호출을 통해 예약 정보를 가져와야 함
                // 여기서는 localStorage나 state에서 가져온다고 가정
                const paymentData =
                    location.state || JSON.parse(localStorage.getItem('paymentData'));

                if (!paymentData) {
                    // 기본 데이터 설정 (실제로는 API에서 가져와야 함)
                    setReservationData({
                        reservationNumber: generateReservationNumber(),
                        productType: 'hotel', // URL이나 다른 방법으로 확인
                        paymentInfo: {
                            paymentKey,
                            orderId,
                            amount: parseInt(amount),
                        },
                    });
                } else {
                    setReservationData({
                        ...paymentData,
                        reservationNumber: generateReservationNumber(),
                        paymentInfo: {
                            paymentKey,
                            orderId,
                            amount: parseInt(amount),
                        },
                    });
                }
            } catch (error) {
                console.error('예약 정보 처리 중 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        processPaymentSuccess();
    }, [paymentKey, orderId, amount, location.state]);

    // 예약번호 생성 함수
    const generateReservationNumber = () => {
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `RT${timestamp.toString().slice(-6)}${randomStr}`;
    };

    if (loading) {
        return (
            <main className="payment">
                <div className="inner">
                    <div className="loading">결제 정보를 확인 중입니다...</div>
                </div>
            </main>
        );
    }

    if (!reservationData) {
        return (
            <main className="payment">
                <div className="inner">
                    <div className="error">결제 정보를 찾을 수 없습니다.</div>
                </div>
            </main>
        );
    }

    return (
        <main className="payment">
            <div className="inner">
                <PaymentSuccessLeft reservationData={reservationData} />
                <PaymentSuccessRight reservationData={reservationData} />
            </div>
        </main>
    );
};

export default PaymentSuccess;

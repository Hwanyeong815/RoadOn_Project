import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const confirmPayment = async () => {
            const paymentKey = searchParams.get('paymentKey');
            const orderId = searchParams.get('orderId');
            const amount = searchParams.get('amount');

            if (!paymentKey || !orderId || !amount) {
                console.error('결제 정보가 누락되었습니다.');
                setLoading(false);
                return;
            }

            try {
                // 실제 서비스에서는 서버에서 결제 승인을 처리해야 합니다.
                // 여기서는 샌드박스 테스트이므로 클라이언트에서 승인 처리
                const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${btoa(process.env.REACT_APP_TOSS_SECRET_KEY + ':')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentKey,
                        orderId,
                        amount: parseInt(amount)
                    })
                });

                const result = await response.json();
                
                if (response.ok) {
                    setPaymentData(result);
                } else {
                    console.error('결제 승인 실패:', result);
                }
            } catch (error) {
                console.error('결제 승인 중 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [searchParams]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px'
            }}>
                결제 승인 처리 중...
            </div>
        );
    }

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '50px auto', 
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #ddd',
            borderRadius: '8px'
        }}>
            <h1 style={{ color: '#28a745', marginBottom: '20px' }}>
                🎉 결제가 완료되었습니다!
            </h1>
            
            {paymentData ? (
                <div style={{ textAlign: 'left', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '4px' }}>
                    <h3>결제 정보</h3>
                    <p><strong>주문번호:</strong> {paymentData.orderId}</p>
                    <p><strong>결제금액:</strong> {paymentData.totalAmount?.toLocaleString()}원</p>
                    <p><strong>결제수단:</strong> {paymentData.method}</p>
                    <p><strong>결제일시:</strong> {new Date(paymentData.approvedAt).toLocaleString()}</p>
                    <p><strong>상품명:</strong> {paymentData.orderName}</p>
                </div>
            ) : (
                <div style={{ color: '#dc3545' }}>
                    <p>결제 정보를 불러오는데 실패했습니다.</p>
                    <p>주문번호: {searchParams.get('orderId')}</p>
                </div>
            )}
            
            <div style={{ marginTop: '30px' }}>
                <button 
                    onClick={() => window.location.href = '/'}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}  
                >
                    홈으로 가기
                </button>
                <button 
                    onClick={() => window.location.href = '/mypage/orders'}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    예약 내역 보기
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
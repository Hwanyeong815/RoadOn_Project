import { useSearchParams } from 'react-router-dom';

const PaymentFail = () => {
    const [searchParams] = useSearchParams();
    const errorCode = searchParams.get('code');
    const errorMessage = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    const getErrorDescription = (code) => {
        const errorDescriptions = {
            'PAY_PROCESS_CANCELED': '사용자가 결제를 취소했습니다.',
            'PAY_PROCESS_ABORTED': '결제 진행 중 오류가 발생했습니다.',
            'REJECT_CARD_COMPANY': '카드사에서 결제를 거절했습니다.',
            'INVALID_CARD_COMPANY': '유효하지 않은 카드입니다.',
            'NOT_ENOUGH_MONEY': '잔액이 부족합니다.',
            'PROVIDER_ERROR': '일시적인 오류가 발생했습니다.',
        };
        return errorDescriptions[code] || '알 수 없는 오류가 발생했습니다.';
    };

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: '50px auto', 
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #ddd',
            borderRadius: '8px'
        }}>
            <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
                ❌ 결제에 실패했습니다
            </h1>
            
            <div style={{ 
                textAlign: 'left', 
                backgroundColor: '#f8d7da', 
                color: '#721c24',
                padding: '20px', 
                borderRadius: '4px',
                marginBottom: '20px'
            }}>
                <h3>오류 정보</h3>
                {orderId && <p><strong>주문번호:</strong> {orderId}</p>}
                {errorCode && <p><strong>오류 코드:</strong> {errorCode}</p>}
                <p><strong>오류 내용:</strong> {errorMessage || getErrorDescription(errorCode)}</p>
            </div>
            
            <div style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.5' }}>
                <p>결제 처리 중 문제가 발생했습니다.</p>
                <p>다시 시도하시거나 다른 결제 수단을 이용해 주세요.</p>
            </div>
            
            <div>
                <button 
                    onClick={() => window.history.back()}
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
                    다시 시도
                </button>
                <button 
                    onClick={() => window.location.href = '/'}
                    style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    홈으로 가기
                </button>
            </div>
            
            {/* 고객센터 정보 */}
            <div style={{ 
                marginTop: '30px', 
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                fontSize: '14px'
            }}>
                <p><strong>문의사항이 있으시면 고객센터로 연락해 주세요.</strong></p>
                <p>📞 고객센터: 1588-1234</p>
                <p>⏰ 운영시간: 평일 09:00 - 18:00</p>
            </div>
        </div>
    );
};

export default PaymentFail;
// src/pages/payment/paymentCpt/paymentFail.js
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoCloseCircleOutline, IoRefreshOutline, IoHomeOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// PaymentFailLeft 컴포넌트
const PaymentFailLeft = ({ failureData }) => {
    const navigate = useNavigate();
    const { hotel, selectedRoom, startDate, endDate, nights, people, errorInfo, totalPrice } =
        failureData;

    const formattedStartDate = startDate
        ? format(new Date(startDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';
    const formattedEndDate = endDate
        ? format(new Date(endDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';
    const failureTime = format(new Date(), 'yyyy.MM.dd HH:mm');

    const handleGoHome = () => {
        navigate('/');
    };

    const handleRetryPayment = () => {
        // 결제 페이지로 다시 이동 (기존 데이터 유지)
        navigate('/payment', {
            state: {
                productType: 'hotel',
                hotel,
                selectedRoom,
                startDate,
                endDate,
                nights,
                people,
                totalPrice,
            },
        });
    };

    const handleGoBack = () => {
        // 이전 페이지로 이동
        navigate(-1);
    };

    return (
        <div className="pay payment-left fail">
            <div className="pay-detail">
                <div className="fail-header">
                    <IoCloseCircleOutline className="fail-icon" />
                    <h3>결제에 실패했습니다</h3>
                    <p>결제 처리 중 문제가 발생했습니다.</p>
                </div>

                <div className="pay-box-wrap">
                    <div className="failure-info">
                        <h4>실패 정보</h4>
                        <div className="failure-time">
                            <p>실패 시간</p>
                            <span>{failureTime}</span>
                        </div>
                        <div className="failure-reason">
                            <p>실패 사유</p>
                            <span>{errorInfo?.message || '알 수 없는 오류가 발생했습니다.'}</span>
                        </div>
                        {errorInfo?.code && (
                            <div className="error-code">
                                <p>오류 코드</p>
                                <span>{errorInfo.code}</span>
                            </div>
                        )}
                    </div>

                    <div className="pay-schedule">
                        <h4>예약 시도 일정</h4>
                        <div className="check-in-out">
                            <div className="check-in">
                                <p>체크인</p>
                                <strong>{formattedStartDate} 15:00</strong>
                            </div>
                            <div className="nights">
                                <p>{nights}박</p>
                            </div>
                            <div className="check-out">
                                <p>체크아웃</p>
                                <strong>{formattedEndDate} 12:00</strong>
                            </div>
                        </div>
                    </div>

                    <div className="pay-party">
                        <h4>예약 인원</h4>
                        <p>성인 {people}명</p>
                    </div>

                    <div className="pay-resname">
                        <h4>예약자 정보</h4>
                        <p>
                            <span>홍길동, </span>
                            <span>abcd@gmail.com</span>
                        </p>
                        <p>
                            <span>+82 01023457890</span>
                        </p>
                    </div>

                    <div className="troubleshooting">
                        <h4>해결 방법</h4>
                        <ul>
                            <li>카드 한도나 잔액을 확인해주세요.</li>
                            <li>카드 정보가 정확한지 확인해주세요.</li>
                            <li>다른 결제 수단을 이용해보세요.</li>
                            <li>문제가 지속되면 고객센터(1588-1234)로 연락주세요.</li>
                        </ul>
                    </div>

                    <div className="action-buttons">
                        <button className="btn-secondary" onClick={handleGoBack}>
                            이전으로 가기
                        </button>
                        <button className="btn-retry" onClick={handleRetryPayment}>
                            <IoRefreshOutline />
                            다시 결제하기
                        </button>
                        <button className="btn-home" onClick={handleGoHome}>
                            <IoHomeOutline />
                            홈으로 가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// PaymentFailRight 컴포넌트
const PaymentFailRight = ({ failureData }) => {
    const navigate = useNavigate();
    const { hotel, selectedRoom, totalPrice, nights, errorInfo } = failureData;

    const handleRetryPayment = () => {
        navigate('/payment', {
            state: {
                productType: 'hotel',
                ...failureData,
            },
        });
    };

    const handleContactSupport = () => {
        // 고객센터 연결 또는 문의 페이지로 이동
        alert('고객센터: 1588-1234\n운영시간: 평일 09:00~18:00');
    };

    const handleFindAlternative = () => {
        // 다른 숙소 찾기 (호텔 검색 페이지로 이동)
        navigate('/hotels');
    };

    return (
        <div className="pay payment-right fail">
            <div className="failure-summary">
                <div className="res-title">
                    <div className="ht-img">
                        <img
                            src={`/images/hotels/detail/hotelsList/${hotel?.image?.[0]}`}
                            alt={hotel?.name}
                        />
                    </div>
                    <div className="text">
                        <span>
                            {hotel?.type} {hotel?.star}
                        </span>
                        <span>{hotel?.name}</span>
                        <span>{selectedRoom?.name}</span>
                    </div>
                </div>

                <div className="failure-status">
                    <div className="status-badge error">
                        <span className="status-icon">✕</span>
                        <span className="status-text">결제 실패</span>
                    </div>
                    <p className="failure-message">
                        {errorInfo?.message || '결제 처리 중 오류가 발생했습니다.'}
                    </p>
                </div>

                <div className="res-prices">
                    <ul className="price total">
                        <li>
                            <b>요금 합계</b>
                            <b>{totalPrice?.toLocaleString()}원</b>
                        </li>
                        <li>
                            <span>객실 1개 X {nights}박</span>
                            <span>{totalPrice?.toLocaleString()}원</span>
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
                    <div className="failed-amount">
                        <p>
                            <strong>결제 시도 금액</strong>
                            <strong className="failed-price">450,760원</strong>
                        </p>
                    </div>
                </div>

                <div className="retry-section">
                    <h4>다시 시도하시겠습니까?</h4>
                    <button className="retry-payment-btn" onClick={handleRetryPayment}>
                        <IoRefreshOutline />
                        450,760원 다시 결제하기
                    </button>
                </div>

                <div className="alternative-options">
                    <h4>다른 옵션</h4>
                    <div className="option-buttons">
                        <button className="option-btn" onClick={handleFindAlternative}>
                            다른 숙소 찾기
                        </button>
                        <button className="option-btn" onClick={handleContactSupport}>
                            고객센터 문의
                        </button>
                    </div>
                </div>

                <div className="payment-help">
                    <h4>결제 도움말</h4>
                    <div className="help-items">
                        <div className="help-item">
                            <span className="help-icon">💳</span>
                            <div className="help-text">
                                <p>카드 확인</p>
                                <small>유효기간, 한도, 잔액을 확인해주세요</small>
                            </div>
                        </div>
                        <div className="help-item">
                            <span className="help-icon">🔄</span>
                            <div className="help-text">
                                <p>다른 결제수단</p>
                                <small>토스페이, 네이버페이 등을 이용해보세요</small>
                            </div>
                        </div>
                        <div className="help-item">
                            <span className="help-icon">📞</span>
                            <div className="help-text">
                                <p>고객센터</p>
                                <small>1588-1234 (평일 09:00~18:00)</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 메인 PaymentFail 컴포넌트
const PaymentFail = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [failureData, setFailureData] = useState(null);
    const [loading, setLoading] = useState(true);

    // URL 파라미터에서 실패 정보 추출
    const code = searchParams.get('code');
    const message = searchParams.get('message');
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // 결제 실패 후 정보 처리
        const processPaymentFailure = async () => {
            try {
                // 결제 전 데이터 가져오기 (localStorage 또는 location.state에서)
                const paymentData =
                    location.state || JSON.parse(localStorage.getItem('paymentData') || '{}');

                if (!paymentData.hotel) {
                    // 기본 실패 데이터 설정
                    setFailureData({
                        hotel: { name: '알 수 없는 숙소', type: '호텔', star: '★★★' },
                        selectedRoom: { name: '객실 정보 없음' },
                        totalPrice: 0,
                        nights: 1,
                        people: 1,
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                        errorInfo: {
                            code: code || 'UNKNOWN_ERROR',
                            message: message || '알 수 없는 오류가 발생했습니다.',
                        },
                    });
                } else {
                    setFailureData({
                        ...paymentData,
                        errorInfo: {
                            code: code || 'PAYMENT_FAILED',
                            message: message || '결제 처리 중 오류가 발생했습니다.',
                            orderId,
                        },
                    });
                }

                // 실패한 경우에도 localStorage의 임시 데이터는 유지 (재시도를 위해)
                // localStorage.removeItem('paymentData'); // 제거하지 않음
            } catch (error) {
                console.error('결제 실패 정보 처리 중 오류:', error);
                setFailureData({
                    hotel: { name: '오류', type: '호텔', star: '★★★' },
                    selectedRoom: { name: '객실 정보 없음' },
                    totalPrice: 0,
                    nights: 1,
                    people: 1,
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    errorInfo: {
                        code: 'SYSTEM_ERROR',
                        message: '시스템 오류가 발생했습니다.',
                    },
                });
            } finally {
                setLoading(false);
            }
        };

        processPaymentFailure();
    }, [code, message, orderId, location.state]);

    if (loading) {
        return (
            <main className="payment">
                <div className="inner">
                    <div className="loading">결제 실패 정보를 확인 중입니다...</div>
                </div>
            </main>
        );
    }

    if (!failureData) {
        return (
            <main className="payment">
                <div className="inner">
                    <div className="error">결제 실패 정보를 찾을 수 없습니다.</div>
                </div>
            </main>
        );
    }

    return (
        <main className="payment">
            <div className="inner">
                <PaymentFailLeft failureData={failureData} />
                <PaymentFailRight failureData={failureData} />
            </div>
        </main>
    );
};

export default PaymentFail;

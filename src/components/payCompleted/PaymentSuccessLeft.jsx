// PaymentSuccessLeft.jsx
import './style.scss';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessLeft = ({ reservationData }) => {
    const navigate = useNavigate();
    const {
        reservationNumber,
        productType,
        hotel,
        selectedRoom,
        startDate,
        endDate,
        nights,
        people,
        paymentInfo,
    } = reservationData;

    const formattedStartDate = startDate
        ? format(new Date(startDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';
    const formattedEndDate = endDate
        ? format(new Date(endDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';
    const paymentDate = format(new Date(), 'yyyy.MM.dd HH:mm');

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoMyPage = () => {
        navigate('/myPage');
    };

    return (
        <div className="pay payment-left success">
            <div className="pay-detail">
                <div className="success-header">
                    <IoCheckmarkCircleOutline className="success-icon" />
                    <h3>결제가 완료되었습니다!</h3>
                </div>

                <div className="pay-box-wrap">
                    <div>
                        {/* <h4>예약 정보</h4> */}
                        <div className="reservation-info">
                            <div className="reservation-number">
                                <p>예약번호</p>
                                <strong>{reservationNumber}</strong>
                            </div>
                            <div className="payment-date">
                                <p>결제일시</p>
                                <span>{paymentDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* <div>
                        <h4>예약 정보</h4>
                        <div className="reservation-info">
                            <div className="reservation-number">
                                <p>예약번호</p>
                                <strong>{reservationNumber}</strong>
                            </div>
                            <div className="payment-date">
                                <p>결제일시</p>
                                <span>{paymentDate}</span>
                            </div>
                        </div>
                    </div> */}

                    {/* <div className="pay-schedule">
                        <h4>예약 일정</h4>
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
                    </div> */}

                    {/* <div className="payment-method-info">
                        <h4>결제 정보</h4>
                        <div className="payment-details">
                            <p>
                                <span>결제 금액</span>
                                <span>{paymentInfo?.amount?.toLocaleString()}원</span>
                            </p>
                            <p>
                                <span>주문번호</span>
                                <span>{paymentInfo?.orderId}</span>
                            </p>
                        </div>
                    </div> */}

                    {/* <div className="notice-info">
                        <h4>안내사항</h4>
                        <ul>
                            <li>예약 확인서가 등록하신 이메일로 발송됩니다.</li>
                            <li>체크인 시 신분증과 예약 확인서를 준비해주세요.</li>
                            <li>취소/변경은 마이페이지에서 가능합니다.</li>
                            <li>문의사항이 있으시면 고객센터(1588-1234)로 연락주세요.</li>
                        </ul>
                    </div> */}

                    <div className="action-buttons">
                        <button className="btn-secondary" onClick={handleGoHome}>
                            홈으로 가기
                        </button>
                        <button className="btn-primary" onClick={handleGoMyPage}>
                            예약 내역 확인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessLeft;

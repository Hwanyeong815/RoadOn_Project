// src/pages/payment/paymentCpt/PaymentSuccessLeft.jsx
import './style.scss';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessLeft = ({ reservationData }) => {
    const navigate = useNavigate();
    const { reservationNumber, startDate, endDate, nights, people, paymentInfo } =
        reservationData || {};

    const formattedStartDate = startDate
        ? format(new Date(startDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';
    const formattedEndDate = endDate
        ? format(new Date(endDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';
    const paymentDate = format(new Date(), 'yyyy.MM.dd HH:mm');

    // ✅ 예약번호 안정적 fallback
    const resNo =
        reservationNumber ||
        reservationData?.reservationId ||
        (paymentInfo?.orderId ? `RT-${paymentInfo.orderId}` : '-');

    const handleGoHome = () => navigate('/');
    const handleGoMyPage = () => navigate('/myPage?mypage_section=reserve');

    return (
        <div className="pay payment-left success">
            <div className="pay-detail">
                <div className="success-header">
                    <IoCheckmarkCircleOutline className="success-icon" />
                    <h3>결제가 완료되었습니다!</h3>
                </div>

                <div className="pay-box-wrap">
                    <div>
                        <div className="reservation-info">
                            <div className="reservation-number">
                                <p>예약번호</p>
                                <strong>{resNo}</strong>
                            </div>
                            <div className="payment-date">
                                <p>결제일시</p>
                                <span>{paymentDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* 필요 시 아래 섹션 주석 해제 */}
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

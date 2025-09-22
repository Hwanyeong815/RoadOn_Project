// PaymentSuccessRight.jsx
import './style.scss';
import { IoDownloadOutline, IoShareOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const PaymentSuccessRight = ({ reservationData }) => {
    const {
        hotel,
        selectedRoom,
        totalPrice,
        nights,
        paymentInfo,
        reservationNumber,
        startDate,
        endDate,
    } = reservationData;

    // 날짜 포맷팅
    const formattedStartDate = startDate
        ? format(new Date(startDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';
    const formattedEndDate = endDate
        ? format(new Date(endDate), 'MM.dd(E)', { locale: ko })
        : '날짜 미정';

    const handleDownloadReceipt = () => {
        // 영수증 다운로드 로직
        console.log('영수증 다운로드');
        alert('영수증 다운로드 기능은 준비 중입니다.');
    };

    const handleShareReservation = () => {
        // 예약 정보 공유 로직
        if (navigator.share) {
            navigator.share({
                title: '예약 완료',
                text: `${hotel?.name} 예약이 완료되었습니다. 예약번호: ${reservationNumber}`,
                url: window.location.href,
            });
        } else {
            // Web Share API를 지원하지 않는 경우 클립보드에 복사
            navigator.clipboard.writeText(
                `${hotel?.name} 예약이 완료되었습니다.\n예약번호: ${reservationNumber}`
            );
            alert('예약 정보가 클립보드에 복사되었습니다.');
        }
    };

    return (
        <div className="pay payment-right success">
            <div className="reservation-summary">
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
                {/* 
                <div className="check-in-out">
                    <div className="sche check-in">
                        <p>체크인</p>
                        <strong>
                            {formattedStartDate} <br />
                            15:00
                        </strong>
                    </div>
                    <div className="sche nights">
                        <p>{nights}박</p>
                    </div>
                    <div className="sche check-out">
                        <p>체크아웃</p>
                        <strong>
                            {formattedEndDate} <br />
                            12:00
                        </strong>
                    </div>
                </div> */}

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
                    <div className="final-amount">
                        <p>
                            <strong>결제 완료 금액</strong>
                            <strong>{paymentInfo?.amount?.toLocaleString()}원</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessRight;

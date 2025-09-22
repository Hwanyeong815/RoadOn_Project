// src/components/hotels/PaymentSuccessRight.jsx
import './style.scss';
import { IoDownloadOutline, IoShareOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMemo } from 'react';

const PaymentSuccessRight = ({ reservationData }) => {
    // localStorage에서 데이터를 안전하게 불러오기
    const finalData = useMemo(() => {
        if (reservationData) {
            return reservationData;
        }
        try {
            const storedData = localStorage.getItem('paymentData');
            const parsedData = storedData ? JSON.parse(storedData) : null;

            // 필수 데이터(hotel, selectedRoom)가 존재하는지 확인
            if (parsedData && parsedData.hotel && parsedData.selectedRoom) {
                return parsedData;
            }
            return null;
        } catch (e) {
            console.error('Failed to parse localStorage data', e);
            return null;
        }
    }, [reservationData]);

    if (!finalData) {
        // 데이터가 없는 경우를 처리
        return (
            <div className="pay payment-right success">
                <p>예약 정보를 불러오는 중 오류가 발생했거나, 정보가 존재하지 않습니다.</p>
                <p>홈페이지로 돌아가거나 마이페이지에서 예약 내역을 확인해 주세요.</p>
            </div>
        );
    }

    const {
        hotel,
        selectedRoom,
        nights,
        paymentInfo,
        rewardState,
        reservationNumber, // reservationNumber 추가
        baseAmount, // baseAmount 추가
    } = finalData;

    // 할인 금액 계산
    const couponAmount = rewardState?.couponAmount || 0;
    const usedPoints = rewardState?.usedPoints || 0;
    const totalDiscount = couponAmount + usedPoints;

    const handleDownloadReceipt = () => {
        console.log('영수증 다운로드');
        alert('영수증 다운로드 기능은 준비 중입니다.');
    };

    const handleShareReservation = () => {
        if (navigator.share) {
            navigator.share({
                title: '예약 완료',
                text: `${hotel?.name} 예약이 완료되었습니다. 예약번호: ${reservationNumber}`,
                url: window.location.href,
            });
        } else {
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

                <div className="res-prices">
                    <ul className="price total">
                        <li>
                            <b>요금 합계</b>
                            <b>{baseAmount?.toLocaleString()}원</b>
                        </li>
                        <li>
                            <span>객실 1개 X {nights}박</span>
                            <span>{baseAmount?.toLocaleString()}원</span>
                        </li>
                    </ul>

                    <ul className="price discount">
                        <li>
                            <b>할인 혜택</b>
                            <b>-{totalDiscount.toLocaleString()}원</b>
                        </li>
                        <li>
                            <span>상품 및 쿠폰 할인</span>
                            <span>-{couponAmount.toLocaleString()}원</span>
                        </li>
                        <li>
                            <span>포인트 사용</span>
                            <span>-{usedPoints.toLocaleString()}원</span>
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

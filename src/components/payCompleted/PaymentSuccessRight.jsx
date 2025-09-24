// src/components/hotels/PaymentSuccessRight.jsx
import './style.scss';
import { IoDownloadOutline, IoShareOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMemo, useState, useEffect } from 'react';

const IMG_BASE = '/images/hotels/detail/hotelsList';

const pickFirst = (val) => (Array.isArray(val) ? val[0] : val);

/** 파일명이 이미 절대경로(/images/...)면 그대로, 아니면 BASE와 합침 */
const joinImagePath = (name) => {
    if (!name) return null;
    if (name.startsWith('/')) return name;
    return `${IMG_BASE}/${name}`;
};

/** hotel.image / hotel.images / hotel.id 어느 쪽이든 받아서 파일명 결정 */
const resolveInitialName = (hotel) => {
    const raw = pickFirst(hotel?.image ?? hotel?.images); // 'ht-6-a.webp' 같은 형태 기대
    if (raw) return raw;

    // 파일명이 아예 없다면 id 기반 기본 규칙으로 추정 (예: ht-6-a.webp)
    if (hotel?.id) return `ht-${hotel.id}-a.webp`;
    return null;
};

const PaymentSuccessRight = ({ reservationData }) => {
    // ...finalData useMemo는 기존 코드 유지
    const finalData = useMemo(() => {
        if (reservationData) return reservationData;
        try {
            const storedData = localStorage.getItem('paymentData');
            const parsed = storedData ? JSON.parse(storedData) : null;
            if (parsed && parsed.hotel && parsed.selectedRoom) return parsed;
            return null;
        } catch (e) {
            console.error('Failed to parse localStorage data', e);
            return null;
        }
    }, [reservationData]);

    if (!finalData) {
        return (
            <div className="pay payment-right success">
                <p>예약 정보를 불러오는 중 오류가 발생했거나, 정보가 존재하지 않습니다.</p>
                <p>홈페이지로 돌아가거나 마이페이지에서 예약 내역을 확인해 주세요.</p>
            </div>
        );
    }

    const { hotel, selectedRoom, nights, paymentInfo, rewardState, reservationNumber, baseAmount } =
        finalData;

    // ----- 이미지 경로 처리 (webp 우선, 실패 시 jpg 폴백) -----
    const initialName = resolveInitialName(hotel); // 예: 'ht-6-a.webp' 또는 'ht-1-a.jpg'
    const [imgSrc, setImgSrc] = useState(() => joinImagePath(initialName));

    // 데이터가 바뀌면 초기화
    useEffect(() => {
        setImgSrc(joinImagePath(resolveInitialName(hotel)));
    }, [hotel]);

    const handleImgError = (e) => {
        const cur = e.currentTarget.getAttribute('src') || '';
        // webp가 404 나면 같은 파일명의 jpg로 한번 더 시도
        if (cur.endsWith('.webp')) {
            setImgSrc(cur.replace('.webp', '.jpg'));
            return;
        }
        // jpg도 실패하면 숨김 (새 에셋 추가 없이 처리)
        e.currentTarget.style.display = 'none';
    };

    // ----- 가격/할인 계산 -----
    const couponAmount = rewardState?.couponAmount || 0;
    const usedPoints = rewardState?.usedPoints || 0;
    const totalDiscount = couponAmount + usedPoints;

    const handleDownloadReceipt = () => {
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
                        {imgSrc ? (
                            <img src={imgSrc} alt={hotel?.name} onError={handleImgError} />
                        ) : null}
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

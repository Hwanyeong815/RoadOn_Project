// src/components/hotels/PaymentSuccessRight.jsx
import './style.scss';
import { IoDownloadOutline, IoShareOutline } from 'react-icons/io5';
import { useMemo, useState, useEffect } from 'react';

// 🔥 API의 한국어 데이터로 강제 매핑
//   프로젝트 구조에 따라 경로가 다르면 '../../api/hotelsListData'를 맞춰주세요.
import hotelsListData from '../../api/hotelsListData';

const IMG_BASE = '/images/hotels/detail/hotelsList';
const pickFirst = (val) => (Array.isArray(val) ? val[0] : val);

const joinImagePath = (name) => {
    if (!name) return null;
    if (String(name).startsWith('/')) return name;
    return `${IMG_BASE}/${name}`;
};

// id/slug/name 어느걸 받아도 hotelsListData의 한국어 name/type/star/price로 보정
const resolveHotelKR = (rawHotel) => {
    if (!rawHotel) return null;
    const id = Number(rawHotel.id);
    const slug = rawHotel.slug?.trim();
    const name = (rawHotel.name || rawHotel.engName || '').trim();

    // 1) id 우선
    let found = Number.isFinite(id) ? hotelsListData.find((h) => Number(h.id) === id) : null;
    // 2) slug
    if (!found && slug) found = hotelsListData.find((h) => h.slug === slug);
    // 3) 이름(한/영) 정확 매칭
    if (!found && name) {
        found = hotelsListData.find((h) => h.name === name || h.engName === name);
    }
    // 아무것도 못 찾으면 원본 반환(최소한 렌더는 되도록)
    return found || rawHotel;
};

const resolveInitialName = (hotel) => {
    const raw = pickFirst(hotel?.image ?? hotel?.images);
    if (raw) return raw;
    if (hotel?.id) return `ht-${hotel.id}-a.webp`;
    return null;
};

const toNumber = (v, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
};

// ✅ localStorage에서 rewardState를 가져오는 헬퍼 함수 추가
const getPendingReward = () => {
    try {
        const storedReward = localStorage.getItem('pendingReward');
        return storedReward ? JSON.parse(storedReward) : null;
    } catch (e) {
        return null;
    }
};

const PaymentSuccessRight = ({ reservationData }) => {
    // 우측 카드에서 사용할 최종 데이터
    const finalData = useMemo(() => {
        if (reservationData) return reservationData;
        try {
            const storedData = localStorage.getItem('paymentData');
            const parsed = storedData ? JSON.parse(storedData) : null;
            if (parsed && parsed.hotel) return parsed;
        } catch (e) {
            console.error('Failed to parse localStorage data', e);
        }
        return null;
    }, [reservationData]);

    if (!finalData) {
        return (
            <div className="pay payment-right success">
                <p>예약 정보를 불러오는 중 오류가 발생했거나, 정보가 존재하지 않습니다.</p>
                <p>홈페이지로 돌아가거나 마이페이지에서 예약 내역을 확인해 주세요.</p>
            </div>
        );
    }

    const {
        hotel: hotelRaw,
        selectedRoom,
        nights: nightsRaw = 1,
        paymentInfo,
        rewardState: rewardRaw,
        reservationNumber,
        baseAmount: baseAmountRaw, // HotelPaymentRight에서 저장한 할인 전 금액
    } = finalData;

    // rewardRaw가 없으면 pendingReward에서 다시 시도 (할인 정보 복구)
    const rewardState = rewardRaw || getPendingReward();

    // ✅ 호텔 정보를 API의 한국어 데이터로 보정
    const hotel = useMemo(() => resolveHotelKR(hotelRaw), [hotelRaw]);

    // ----- 이미지 경로 처리 -----
    const [imgSrc, setImgSrc] = useState(() => joinImagePath(resolveInitialName(hotel)));
    useEffect(() => setImgSrc(joinImagePath(resolveInitialName(hotel))), [hotel]);
    const handleImgError = (e) => {
        const cur = e.currentTarget.getAttribute('src') || '';
        if (cur.endsWith('.webp')) {
            setImgSrc(cur.replace('.webp', '.jpg'));
            return;
        }
        e.currentTarget.style.display = 'none';
    };

    // ----- 금액/할인 계산 -----
    const nights = toNumber(nightsRaw, 1);

    // rewardState에서 할인 금액 추출
    const couponAmount = toNumber(rewardState?.couponAmount, 0);
    const usedPoints = toNumber(rewardState?.usedPoints, 0);
    const totalDiscount = couponAmount + usedPoints;

    // ✅ baseAmount 우선순위 수정:
    //    1) HotelPaymentRight에서 저장한 baseAmountRaw가 최우선.
    //    2) 없으면 호텔 단가(price) × 숙박수(nights)
    //    3) (절대 할인 적용 후 금액을 사용하지 않도록 수정)
    const baseAmount =
        toNumber(baseAmountRaw, 0) || 
        (toNumber(hotel?.price, 0) * nights);

    // ✅ 최종 결제금액:
    //    1) PG에서 넘어온 paymentInfo.amount가 최우선
    //    2) 없으면 baseAmount - 할인
    const finalAmount = (() => {
        const amt = toNumber(paymentInfo?.amount, NaN);
        if (Number.isFinite(amt) && amt > 0) return amt;
        const calc = baseAmount - totalDiscount;
        return calc > 0 ? calc : 0;
    })();

    const handleDownloadReceipt = () => alert('영수증 다운로드 기능은 준비 중입니다.');
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
                        {/* ✅ 한국어 타입/성급/호텔명 보장 */}
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
                            <b>{toNumber(baseAmount, 0).toLocaleString()}원</b>
                        </li>
                        <li>
                            <span>객실 1개 X {nights}박</span>
                            <span>{toNumber(baseAmount, 0).toLocaleString()}원</span>
                        </li>
                    </ul>

                    <ul className="price discount">
                        <li>
                            <b>할인 혜택</b>
                            <b>{toNumber(totalDiscount, 0).toLocaleString()}원</b>
                        </li>
                        <li>
                            <span>상품 및 쿠폰 할인</span>
                            <span>{toNumber(couponAmount, 0).toLocaleString()}원</span>
                        </li>
                        <li>
                            <span>포인트 사용</span>
                            <span>{toNumber(usedPoints, 0).toLocaleString()}원</span>
                        </li>
                    </ul>

                    <div className="final-amount">
                        <p>
                            <strong>결제 완료 금액</strong>
                            <strong>{toNumber(finalAmount, 0).toLocaleString()}원</strong>
                        </p>
                    </div>

                    {/* 필요 시 버튼 노출 */}
                    {/* <div className="act">
            <button className="btn-outline" onClick={handleDownloadReceipt}>
              <IoDownloadOutline /> 영수증 다운로드
            </button>
            <button className="btn-outline" onClick={handleShareReservation}>
              <IoShareOutline /> 예약 공유
            </button>
          </div> */}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessRight;
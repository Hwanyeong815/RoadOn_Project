// src/pages/paymentSuccess/PaymentSuccess.jsx  (경로는 기존과 동일하게)
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
// import useAuthStore from '../../store/authStore';
// import useReserveStore from '../../store/reserveStore';
// import useRewardStore from '../../store/rewardStore';
// import PaymentSuccessLeft from '../../components/payCompleted/PaymentSuccessLeft';
// import PaymentSuccessRight from '../../components/payCompleted/PaymentSuccessRight';
import useAuthStore from '../../../../store/authStore';
import useReserveStore from '../../../../store/reserveStore';
import useRewardStore from '../../../../store/rewardStore';
import PaymentSuccessLeft from '../../../../components/payCompleted/PaymentSuccessLeft';
import PaymentSuccessRight from '../../../../components/payCompleted/PaymentSuccessRight';

const PaymentSuccess = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [reservationData, setReservationData] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id || 'u_test_1';

    const addReservation = useReserveStore((s) => s.addReservation);
    const applyPaymentReward = useRewardStore((s) => s.applyPaymentReward);

    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = Number(searchParams.get('amount') || 0);

    // 예약번호 생성
    const genResvNo = (prefix = 'RT') => {
        const ts = Date.now().toString().slice(-6);
        const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${ts}${rnd}`;
    };
    const ymd = (d) =>
        d ? new Date(d).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const run = async () => {
            try {
                // 1) 결제/상품 데이터 수집
                const paymentData =
                    location.state || JSON.parse(localStorage.getItem('paymentData') || 'null');

                if (!paymentData) {
                    setReservationData(null);
                    return;
                }

                // 2) 리워드 정보(호텔: pendingReward, 항공/투어: paymentData.discount)
                const pendingReward = JSON.parse(localStorage.getItem('pendingReward') || 'null');
                const discount = pendingReward
                    ? {
                          couponAmount: Number(pendingReward.couponAmount || 0),
                          pointAmount: Number(pendingReward.usedPoints || 0),
                          selectedCoupon: pendingReward.coupon || null,
                          finalAmount: Number(pendingReward.finalAmount || amount || 0),
                      }
                    : {
                          couponAmount: Number(paymentData?.discount?.couponAmount || 0),
                          pointAmount: Number(paymentData?.discount?.pointAmount || 0),
                          selectedCoupon: paymentData?.discount?.selectedCoupon || null,
                          finalAmount: Number(paymentData?.finalAmount || amount || 0),
                      };

                // 3) reserveStore 형식으로 맵핑
                const nowIso = new Date().toISOString();
                const base = {
                    status: 'ready',
                    createdAt: nowIso,
                    totalAmount: discount.finalAmount || amount || 0,
                    isUsed: false,
                };

                let reservation = null;

                if (paymentData.productType === 'hotel') {
                    const {
                        hotel,
                        selectedRoom,
                        nights = 1,
                        people = 1,
                        startDate,
                        endDate,
                    } = paymentData;
                    reservation = {
                        ...base,
                        reservationId: `HOTEL-${ymd(nowIso)}-${genResvNo('').slice(-4)}`,
                        type: 'hotel',
                        id: hotel?.id ?? hotel?.slug ?? hotel?.name ?? `hotel-${Date.now()}`,
                        guests: { adult: Number(people || 1), child: 0 },
                        startDate: ymd(startDate),
                        endDate: ymd(endDate),
                        data: {
                            name: hotel?.name,
                            location: hotel?.location || hotel?.address || '',
                            roomType: selectedRoom?.name,
                            nights: Number(nights || 1),
                        },
                    };
                } else if (paymentData.productType === 'flight') {
                    const { airport, segments = [], filters } = paymentData;
                    const pax = Number(filters?.people || 1);
                    reservation = {
                        ...base,
                        reservationId: `FLIGHT-${ymd(nowIso)}-${genResvNo('').slice(-4)}`,
                        type: 'flight',
                        id: airport?.id ?? airport?.flightNo ?? `flight-${Date.now()}`,
                        guests: { adult: pax, child: 0 },
                        startDate: ymd(segments?.[0]?.departureDate || nowIso),
                        endDate: ymd(segments?.[segments.length - 1]?.departureDate || nowIso),
                        data: {
                            airline: airport?.airline,
                            depart: airport?.departCode,
                            arrive: airport?.arriveCode,
                            segments,
                        },
                    };
                } else if (paymentData.productType === 'tour') {
                    const {
                        tour,
                        option,
                        party = { adults: 1, children: 0 },
                        startDate,
                        endDate,
                    } = paymentData;
                    const adult = Number(party?.adults || 0);
                    const child = Number(party?.children || 0);
                    reservation = {
                        ...base,
                        reservationId: `TOUR-${ymd(nowIso)}-${genResvNo('').slice(-4)}`,
                        type: 'tour',
                        id: tour?.id ?? tour?.slug ?? tour?.name ?? `tour-${Date.now()}`,
                        guests: { adult, child },
                        startDate: ymd(startDate),
                        endDate: ymd(endDate || startDate),
                        data: {
                            name: tour?.name,
                            option: option?.title || '',
                            location: tour?.location || '',
                        },
                    };
                }

                if (reservation) {
                    addReservation(reservation);
                }

                // 4) 리워드 반영(쿠폰 disable + 포인트 차감)
                const couponId = discount.selectedCoupon?.id ?? null;
                const usedPoints = Number(discount.pointAmount || 0);
                if (couponId || usedPoints > 0) {
                    applyPaymentReward(userId, {
                        couponId,
                        usedPoints,
                        memo: `주문 ${orderId || ''}`.trim(),
                    });
                }

                // 5) 화면용 state 구성
                setReservationData({
                    ...paymentData,
                    reservationNumber: reservation?.reservationId || genResvNo('RT'),
                    paymentInfo: {
                        paymentKey,
                        orderId,
                        amount: discount.finalAmount || amount || 0,
                    },
                    discount,
                });

                // 6) 임시 데이터 정리
                localStorage.removeItem('pendingReward');
                localStorage.removeItem('paymentData');
            } catch (e) {
                console.error('결제 성공 처리 실패:', e);
            } finally {
                setLoading(false);
            }
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentKey, orderId, amount, location.state, userId]);

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

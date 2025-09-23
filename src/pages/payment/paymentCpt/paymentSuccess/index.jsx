// PaymentSuccess.jsx
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import PaymentSuccessLeft from '../../../../components/payCompleted/PaymentSuccessLeft';
import PaymentSuccessRight from '../../../../components/payCompleted/PaymentSuccessRight';
import useReserveStore from '../../../../store/reserveStore';

const PaymentSuccess = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [reservationData, setReservationData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ reserveStore actions/selectors
    const addReservation = useReserveStore((s) => s.addReservation);
    const isReserved = useReserveStore((s) => s.isReserved);
    const addedRef = useRef(false); // StrictMode 중복 방지

    // URL 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId'); // Toss 등 PG의 주문번호
    const amountParam = searchParams.get('amount');

    // --- utils (arrow funcs) ---
    const normalizeType = (t = 'hotel') => {
        const s = String(t).toLowerCase();
        if (/air|flight|airport/.test(s)) return 'flight';
        if (/pkg|package/.test(s)) return 'package';
        if (/tour/.test(s)) return 'tour';
        return 'hotel';
    };

    const todayYMD = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dd}`;
    };

    const generateReservationNumber = () => {
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `RT${timestamp.toString().slice(-6)}${randomStr}`;
    };

    const toInt = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    };

    const buildReservationFromPayment = ({ paymentData, paymentKey, orderId, amount }) => {
        const nowIso = new Date().toISOString();
        const type = normalizeType(paymentData?.type || 'hotel');

        // 결제 전 단계에서 저장/전달해둔 값들을 폭넓게 수용 (id, productId, slug 등)
        const id =
            paymentData?.id ??
            paymentData?.productId ??
            paymentData?.slug ??
            paymentData?.hotelId ??
            paymentData?.flightId ??
            null;

        const startDate =
            paymentData?.startDate || paymentData?.checkIn || paymentData?.dateFrom || todayYMD();
        const endDate =
            paymentData?.endDate || paymentData?.checkOut || paymentData?.dateTo || startDate;

        const guests = paymentData?.guests ||
            paymentData?.people || {
                adult: paymentData?.adult ?? 1,
                child: paymentData?.child ?? 0,
            };

        const totalAmount = toInt(amount ?? paymentData?.totalAmount, 0);

        const reservationId = orderId || generateReservationNumber();

        return {
            // uid는 스토어에서 자동 생성/보정됨
            reservationId,
            type, // 'hotel' | 'flight' | 'package' | 'tour'
            id,
            status: 'ready',
            createdAt: nowIso,
            totalAmount,
            guests,
            startDate,
            endDate,
            data: null, // 상세는 store.hydrate가 채움
            isUsed: false,
            paymentInfo: { paymentKey, orderId: reservationId, amount: totalAmount },
        };
    };

    useEffect(() => {
        const processPaymentSuccess = async () => {
            try {
                // 결제 직전 페이지에서 넘긴 state 또는 localStorage 백업 사용
                const raw = location.state || JSON.parse(localStorage.getItem('paymentData'));
                const amount = toInt(amountParam, raw?.totalAmount ?? 0);

                const built = buildReservationFromPayment({
                    paymentData: raw,
                    paymentKey,
                    orderId,
                    amount,
                });

                setReservationData(built);

                // ✅ 예약 스토어 기록 (중복 방지: orderId 기반)
                if (!addedRef.current) {
                    const key = built.reservationId || built.uid;
                    if (!isReserved(key)) {
                        addReservation(built); // store가 items & itemsDetailed까지 갱신/저장
                    }
                    addedRef.current = true;
                    // 재방문/새로고침 시 중복 추가 방지
                    localStorage.removeItem('paymentData');
                }
            } catch (e) {
                console.error('예약 정보 처리 중 오류:', e);
            } finally {
                setLoading(false);
            }
        };

        processPaymentSuccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentKey, orderId, amountParam, location.state, addReservation, isReserved]);

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

// src/pages/payment/paymentCpt/paymentSuccess.js
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoCheckmarkCircleOutline, IoDownloadOutline, IoShareOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import useReserveStore from '../../../store/reserveStore';
import './style.scss';
import PaymentSuccessLeft from './PaymentSuccessLeft';
import PaymentSuccessRight from './PaymentSuccessRight';

// 메인 PaymentSuccess 컴포넌트
const PaymentSuccess = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [reservationData, setReservationData] = useState(null);
    const [loading, setLoading] = useState(true);

    // useReserveStore에서 필요한 함수들 가져오기
    const { addReservation, getByReservationId } = useReserveStore();

    // URL 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    // 예약번호 생성 함수
    const generateReservationNumber = () => {
        const timestamp = new Date().getTime();
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `RT${timestamp.toString().slice(-6)}${randomStr}`;
    };
    

    useEffect(() => {
        // 결제 완료 후 예약 정보 처리 및 저장
        const processPaymentSuccess = async () => {
            try {
                // 결제 전 데이터 가져오기 (localStorage 또는 location.state에서)
                const paymentData =
                    location.state || JSON.parse(localStorage.getItem('paymentData') || '{}');

                if (!paymentData.hotel) {
                    console.error('결제 데이터를 찾을 수 없습니다.');
                    setLoading(false);
                    return;
                }

                const reservationNumber = generateReservationNumber();

                // 여행 상태 계산 함수
                const getTravelStatus = (startDate, endDate) => {
                    const now = new Date();
                    const start = new Date(startDate);
                    const end = new Date(endDate);

                    if (now < start) {
                        return 'upcoming'; // 여행전
                    } else if (now >= start && now <= end) {
                        return 'ongoing'; // 여행중
                    } else {
                        return 'completed'; // 사용완료
                    }
                };

                // 예약 데이터 구성 (마이페이지 요구사항에 맞춤)
                const reservationInfo = {
                    uid: `res-hotel-${Date.now()}`,
                    reservationId: reservationNumber, // 예약코드
                    type: 'hotel',
                    id: paymentData.hotel.id || paymentData.hotel.slug,
                    status: 'ready', // useReserveStore에서 사용하는 상태
                    createdAt: new Date().toISOString(), // 예약일
                    totalAmount: parseInt(amount) || paymentData.totalPrice || 450760, // 결제 금액
                    guests: {
                        adult: paymentData.people || 2,
                        child: 0,
                    }, // 인원
                    startDate: paymentData.startDate, // 여행기간 시작
                    endDate: paymentData.endDate, // 여행기간 종료

                    // 마이페이지에서 사용할 추가 정보
                    productName: `${paymentData.hotel.name} - ${
                        paymentData.selectedRoom?.name || 'Standard Room'
                    }`, // 상품명
                    productInfo: {
                        hotelName: paymentData.hotel.name,
                        roomType: paymentData.selectedRoom?.name || 'Standard Room',
                        location: paymentData.hotel.location,
                        nights: paymentData.nights || 1,
                        checkIn: paymentData.startDate,
                        checkOut: paymentData.endDate,
                        star: paymentData.hotel.star,
                        type: paymentData.hotel.type,
                    }, // 상품 상세 정보
                    guestCount: paymentData.people || 2, // 인원 수
                    travelPeriod: `${paymentData.startDate} ~ ${paymentData.endDate}`, // 여행기간 문자열
                    travelStatus: getTravelStatus(paymentData.startDate, paymentData.endDate), // 상태 (여행전/여행중/사용완료)

                    data: {
                        name: paymentData.hotel.name,
                        location: paymentData.hotel.location,
                        roomType: paymentData.selectedRoom?.name || 'Standard Room',
                        nights: paymentData.nights || 1,
                    },
                    isUsed: false,
                };

                // useReserveStore에 예약 정보 저장
                addReservation(reservationInfo);

                // 화면에 표시할 데이터 설정
                setReservationData({
                    ...paymentData,
                    reservationNumber,
                    paymentInfo: {
                        paymentKey,
                        orderId,
                        amount: parseInt(amount) || paymentData.totalPrice || 450760,
                    },
                });

                // 결제 완료 후 localStorage의 임시 데이터 삭제
                localStorage.removeItem('paymentData');
            } catch (error) {
                console.error('예약 정보 처리 중 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        processPaymentSuccess();
    }, [paymentKey, orderId, amount, location.state, addReservation]);

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

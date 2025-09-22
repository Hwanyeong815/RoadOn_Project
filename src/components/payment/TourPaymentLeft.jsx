// src/components/tour/TourPaymentLeft.jsx
import './style.scss';
import { useState } from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { IoCardOutline } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import useAuthStore from '../../store/authStore';
import PaymentReward from '../ui/coupon/PaymentReward';

const TourPaymentLeft = ({
    segments = [],
    party = { adults: 2, children: 1, infants: 0 },
    reserver = { name: '', email: '', phone: '' },
    /** 결제 총금액(없으면 0) */
    totalPrice = 0,
}) => {
    // ✅ 로그인 사용자 → 없으면 테스트 계정으로 fallback
    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id || 'u_test_1';

    const [gender, setGender] = useState('male');
    const [isOpen, setIsOpen] = useState(false);
    const [payMethod, setPayMethod] = useState('card'); // 'card' | 'tosspay' | 'naverpay' | 'kakaopay'

    // PaymentReward에서 넘어오는 값 (우측 결제 요약에서 활용)
    const [rewardState, setRewardState] = useState({
        coupon: null,
        usedPoints: 0,
        couponAmount: 0,
        finalAmount: 0,
    });

    // 더미 세그먼트 (없을 때만 노출)
    const fallbackSegments = [
        {
            title: '가는편',
            departCode: 'ICN',
            arriveCode: 'DAD',
            airline: '에어프레미아',
            flightNo: 'BX0164',
            logo: '/images/air/airpremia.svg',
            departureDate: '11.05(수)',
            departureTime: '15:00',
            departureAirport: '한국출발',
            arrivalDate: '11.05(수)',
            arrivalTime: '18:00',
            arrivalAirport: '현지도착',
            duration: '4박',
            direct: true,
        },
        {
            title: '오는편',
            departCode: 'DAD',
            arriveCode: 'ICN',
            airline: '에어프레미아',
            flightNo: 'BX0164',
            logo: '/images/air/airpremia.svg',
            departureDate: '11.09(일)',
            departureTime: '12:00',
            departureAirport: '현지도착',
            arrivalDate: '11.09(일)',
            arrivalTime: '16:00',
            arrivalAirport: '한국출발',
            duration: '',
            direct: true,
        },
    ];
    const segs = Array.isArray(segments) && segments.length > 0 ? segments : fallbackSegments;

    return (
        <div className="pay payment-left">
            <div className="pay-detail">
                <h3>
                    <img src="/images/icon/before.svg" alt="이전" />
                    예약 확인 및 결제
                </h3>

                <div className="pay-box-wrap">
                    <div className="flight-schedule">
                        <div className="depart-info compact">
                            {/* 왼쪽(가는편) */}
                            <div className="col left">
                                <p className="code-badge">{segs[0].flightNo}</p>
                                <div className="row">
                                    <span className="label">{segs[0].departureAirport}</span>
                                    <span className="value">
                                        {segs[0].departureDate} {segs[0].departureTime}
                                    </span>
                                </div>
                                <div className="row">
                                    <span className="label">{segs[0].arrivalAirport}</span>
                                    <span className="value">
                                        {segs[0].arrivalDate} {segs[0].arrivalTime}
                                    </span>
                                </div>
                            </div>

                            {/* 중앙(박 수) */}
                            <div className="center">
                                <span className="nights-badge">{segs[0].duration || '4박'}</span>
                            </div>

                            {/* 오른쪽(오는편) */}
                            <div className="col right">
                                <p className="code-badge">{segs[1].flightNo}</p>
                                <div className="row">
                                    <span className="label">{segs[1].departureAirport}</span>
                                    <span className="value">
                                        {segs[1].departureDate} {segs[1].departureTime}
                                    </span>
                                </div>
                                <div className="row">
                                    <span className="label">{segs[1].arrivalAirport}</span>
                                    <span className="value">
                                        {segs[1].arrivalDate} {segs[1].arrivalTime}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 예약 인원 */}
                    <div className="pay-party">
                        <h4>예약 인원</h4>
                        <p>
                            성인 {party.adults}명
                            {party.children ? ` · 아동 ${party.children}명` : ''}
                            {party.infants ? ` · 유아 ${party.infants}명` : ''}
                        </p>
                    </div>

                    {/* 예약자 정보 */}
                    <div className="flight-resname">
                        <h4>예약자 정보</h4>
                        <p>
                            <input
                                type="text"
                                className="kor-name"
                                placeholder="한글 이름"
                                defaultValue={reserver.name}
                            />
                            <input
                                type="email"
                                className="email"
                                placeholder="이메일 주소"
                                defaultValue={reserver.email}
                            />
                            <input
                                type="tel"
                                className="phone-num"
                                placeholder="휴대폰 번호"
                                defaultValue={reserver.phone}
                            />
                        </p>
                    </div>

                    {/* ✅ 쿠폰/포인트 (마크업 클래스 유지) */}
                    <PaymentReward
                        userId={userId}
                        productType="tour" // ✅ hotel -> tour
                        // productData={productData}       // (있으면 넘겨주세요)
                        onChange={(next) => onRewardChange?.(next)} // ✅ 부모로 전달
                    />

                    {/* 결제 수단 */}
                    <div className="pay-method">
                        <h4>결제수단</h4>
                        <ul className="payments">
                            <li
                                className={payMethod === 'card' ? 'on' : ''}
                                onClick={() => setPayMethod('card')}
                            >
                                <IoCardOutline />
                                <span>신용/체크 카드</span>
                            </li>
                            <li
                                className={payMethod === 'tosspay' ? 'on' : ''}
                                onClick={() => setPayMethod('tosspay')}
                            >
                                <img src="/images/icon/tosspay.png" alt="토스페이" />
                            </li>
                            <li
                                className={payMethod === 'naverpay' ? 'on' : ''}
                                onClick={() => setPayMethod('naverpay')}
                            >
                                <img src="/images/icon/naverpay.png" alt="네이버페이" />
                            </li>
                            <li
                                className={payMethod === 'kakaopay' ? 'on' : ''}
                                onClick={() => setPayMethod('kakaopay')}
                            >
                                <img src="/images/icon/kakaopay.png" alt="카카오페이" />
                            </li>
                        </ul>

                        {payMethod === 'card' && (
                            <>
                                <div className="card-types">
                                    <h5>카드 종류</h5>
                                    <select defaultValue="">
                                        <option value="" disabled>
                                            카드를 선택해주세요.
                                        </option>
                                        <option value="kb">KB국민카드</option>
                                        <option value="sh">신한카드</option>
                                        <option value="bc">BC카드</option>
                                        <option value="hy">현대카드</option>
                                    </select>
                                </div>

                                <div className="installment">
                                    <h5>할부 선택</h5>
                                    <select defaultValue="0">
                                        <option value="0">일시불</option>
                                        <option value="3">3개월</option>
                                        <option value="6">6개월</option>
                                        <option value="12">12개월</option>
                                    </select>
                                </div>

                                <div className="pay-default">
                                    <input id="saveMethod" type="checkbox" />
                                    <label htmlFor="saveMethod">이 결제수단을 다음에도 사용</label>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourPaymentLeft;

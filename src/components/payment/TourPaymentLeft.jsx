// src/components/tour/TourPaymentLeft.jsx
import './style.scss';
import { useMemo, useState } from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { IoCardOutline } from 'react-icons/io5';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import useRewardStore from '../../store/rewardStore';

const TourPaymentLeft = ({
    userId = 'u_test_1',
    segments = [],
    party = { adults: 2, children: 1, infants: 0 },
    reserver = { name: '', email: '', phone: '' },
}) => {
    const [gender, setGender] = useState('male');
    const user = { gender };
    const [isOpen, setIsOpen] = useState(false);
    // 쿠폰/포인트
    const getCoupons = useRewardStore?.((s) => s.getCoupons) ?? (() => []);
    const getPoints = useRewardStore?.((s) => s.getPoints) ?? (() => ({ balance: 0, items: [] }));
    const availableCoupons = useMemo(
        () => (getCoupons(userId) || []).filter((c) => !c.disabled),
        [getCoupons, userId]
    );
    const { balance: pointBalance } = getPoints(userId) || { balance: 0 };

    const [selectedCouponId, setSelectedCouponId] = useState('');
    const [usePoints, setUsePoints] = useState(0);
    const [payMethod, setPayMethod] = useState('card');

    const handleUseAllPoints = () => setUsePoints(Number(pointBalance) || 0);
    const handlePointChange = (e) => {
        const v = Number(e.target.value || 0);
        setUsePoints(Math.max(0, Math.min(v, Number(pointBalance) || 0)));
    };

    // 시안 고정 더미 (segments 없을 때 노출)
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

                    {/* 탑승객 정보 */}
                    <div className="passenger-info">
                        <div className="pass-head">
                            <h4>탑승객 정보</h4>
                            <span>
                                <IoIosCheckmarkCircleOutline
                                    style={{ fontSize: '23px', color: '#b2b2b2' }}
                                />
                                예약자와 동일
                            </span>
                        </div>
                        <div className="eng-name">
                            <div className="field">
                                <input type="text" placeholder="영문 이름" />
                                <p className="field-help error" aria-live="polite">
                                    여권의 영문 성을 정확히 입력해주세요.
                                </p>
                            </div>
                            <div className="field">
                                <input type="text" placeholder="영문 성" />
                                <p className="field-help error" aria-live="polite">
                                    여권의 영문 이름을 정확히 입력해주세요.
                                </p>
                            </div>
                        </div>
                        <div className="pass-ide">
                            <p>
                                <input type="text" placeholder="생년월일(숫자 8자리)" />
                            </p>
                            <div className="select-wrap">
                                <select
                                    className="nationality-country"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <option value="KOR"> 대한민국(KOR)</option>
                                    <option value="USA"> 미국(USA)</option>
                                    <option value="JAN"> 일본(JAN)</option>
                                    <option value="CHN"> 중국(CHN)</option>
                                    <option value="VNM"> 베트남(VNM)</option>
                                </select>
                                <span className="icon">
                                    {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </span>
                            </div>
                            <div className="gender-group">
                                <label className={gender === 'male' ? 'active' : ''}>
                                    <p>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            checked={gender === 'male'}
                                            onChange={() => setGender('male')}
                                        />
                                    </p>
                                    남성
                                </label>
                                <label className={gender === 'female' ? 'active' : ''}>
                                    <p>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="female"
                                            checked={gender === 'female'}
                                            onChange={() => setGender('female')}
                                        />
                                    </p>
                                    여성
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 쿠폰 */}
                    <div className="pay-coupon">
                        <h4>쿠폰</h4>
                        <select
                            id="coupon"
                            name="select-coupon"
                            value={selectedCouponId}
                            onChange={(e) => setSelectedCouponId(e.target.value)}
                        >
                            <option value="" disabled hidden>
                                사용 가능한 쿠폰 {availableCoupons.length}개
                            </option>
                            {availableCoupons.map((c) => (
                                <option key={c.id} value={String(c.id)}>
                                    {c.label}{' '}
                                    {c.amount ? `- ${Number(c.amount).toLocaleString()}원` : ''} (
                                    {c.condition})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 포인트 */}
                    <div className="pay-point">
                        <h4>포인트</h4>
                        <p>
                            RT 포인트 <span>{Number(pointBalance).toLocaleString()}</span>P
                        </p>
                        <div className="point-input">
                            <input
                                type="number"
                                min={0}
                                max={Number(pointBalance) || 0}
                                value={usePoints}
                                onChange={handlePointChange}
                            />
                            <button type="button" onClick={handleUseAllPoints}>
                                전액 사용
                            </button>
                        </div>
                    </div>

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
                                className={payMethod === 'toss' ? 'on' : ''}
                                onClick={() => setPayMethod('toss')}
                            >
                                <img src="/images/icon/tosspay.png" alt="토스페이" />
                            </li>
                            <li
                                className={payMethod === 'naver' ? 'on' : ''}
                                onClick={() => setPayMethod('naver')}
                            >
                                <img src="/images/icon/naverpay.png" alt="네이버페이" />
                            </li>
                            <li
                                className={payMethod === 'kakao' ? 'on' : ''}
                                onClick={() => setPayMethod('kakao')}
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

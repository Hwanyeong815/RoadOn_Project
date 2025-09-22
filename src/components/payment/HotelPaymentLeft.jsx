import './style.scss';
import { IoCardOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

const HotelPaymentLeft = ({ hotel, selectedRoom, startDate, endDate, nights, people, onPaymentMethodChange }) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    
    const formattedStartDate = startDate ? format(new Date(startDate), 'MM.dd(E)', { locale: ko }) : '날짜 미정';
    const formattedEndDate = endDate ? format(new Date(endDate), 'MM.dd(E)', { locale: ko }) : '날짜 미정';

    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        onPaymentMethodChange(method);
    };

    return (
        <div className="pay payment-left">
            <div className="pay-detail">
                <h3>
                    <img src="/images/icon/before.svg" alt="이전" />
                    예약 확인 및 결제
                </h3>
                <div className="pay-box-wrap">
                    <div className="pay-schedule">
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
                    </div>
                    <div className="pay-resname">
                        <h4>예약자 정보</h4>
                        <p>
                            <span>홍길동, </span>
                            <span>abcd@gmail.com</span>
                        </p>
                        <p>
                            <span>+82 01023457890</span>
                        </p>
                    </div>
                    <div className="pay-coupon">
                        <h4>쿠폰</h4>
                        <select id="coupon" name="select-coupon" defaultValue="">
                            <option value="" disabled hidden>
                                사용 가능한 쿠폰 1개
                            </option>
                            <option value="hotels">10,000원 [숙소 할인]</option>
                            <option value="tour" disabled>30,000원 [투어 할인]</option>
                        </select>
                    </div>
                    <div className="pay-point">
                        <h4>포인트</h4>
                        <p>
                            RT 포인트 <span>12,000</span>P
                        </p>
                        <input type="number" />
                        <button>전액 사용</button>
                    </div>
                    <div className="pay-method">
                        <h4>결제수단</h4>
                        <ul className="payments">
                            <li 
                                className={selectedPaymentMethod === 'card' ? 'selected' : ''}
                                onClick={() => handlePaymentMethodSelect('card')}
                            >
                                <IoCardOutline />
                                <span>신용/체크 카드</span>
                            </li>
                            <li 
                                className={selectedPaymentMethod === 'tosspay' ? 'selected' : ''}
                                onClick={() => handlePaymentMethodSelect('tosspay')}
                            >
                                <img src="/images/icon/tosspay.png" alt="토스페이" />
                            </li>
                            <li 
                                className={selectedPaymentMethod === 'naverpay' ? 'selected' : ''}
                                onClick={() => handlePaymentMethodSelect('naverpay')}
                            >
                                <img src="/images/icon/naverpay.png" alt="네이버페이" />
                            </li>
                            <li 
                                className={selectedPaymentMethod === 'kakaopay' ? 'selected' : ''}
                                onClick={() => handlePaymentMethodSelect('kakaopay')}
                            >
                                <img src="/images/icon/kakaopay.png" alt="카카오페이" />
                            </li>
                        </ul>
                        {selectedPaymentMethod === 'card' && (
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
                            </>
                        )}
                        <div className="pay-default">
                            <input id="saveMethod" type="checkbox" />
                            <label htmlFor="saveMethod">이 결제수단을 다음에도 사용</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelPaymentLeft;
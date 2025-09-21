import './style.scss';
import { IoCardOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const HotelPaymentLeft = ({ hotel, selectedRoom, startDate, endDate, nights, people }) => {
    // 날짜를 원하는 형식으로 포맷합니다. (예: 11.05(수))
    const formattedStartDate = startDate ? format(new Date(startDate), 'MM.dd(E)', { locale: ko }) : '날짜 미정';
    const formattedEndDate = endDate ? format(new Date(endDate), 'MM.dd(E)', { locale: ko }) : '날짜 미정';

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
                        <select id="coupon" name="select-coupon">
                            <option value="" disabled selected hidden>
                                사용 가능한 쿠폰 <span>1개</span>
                            </option>
                            <option value="apple">가능한 옵션</option>
                            <option value="banana">마이페이지의</option>
                            <option value="grape">쿠폰이랑 연결</option>
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
                            <li>
                                <IoCardOutline />
                                <span>신용/체크 카드</span>
                            </li>
                            <li>
                                <img src="/images/icon/tosspay.png" alt="토스페이" />
                            </li>
                            <li>
                                <img src="/images/icon/naverpay.png" alt="네이버페이" />
                            </li>
                            <li>
                                <img src="/images/icon/kakaopay.png" alt="카카오페이" />
                            </li>
                        </ul>
                        <div className="card-types">
                            <h5>카드 종류</h5>
                            <ul>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div className="installment">
                            <h5>할부 선택</h5>
                            <ul>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div className="pay-default">
                            <span></span> <p>이 결제수단을 다음에도 사용</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelPaymentLeft;

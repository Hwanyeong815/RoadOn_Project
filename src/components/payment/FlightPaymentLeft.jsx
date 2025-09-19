import { IoCardOutline } from 'react-icons/io5';
import useAirportStore from '../../store/airportStore';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

const FlightPaymentLeft = ({ airport, segments }) => {
    const getAirportById = useAirportStore((state) => state.getAirportById);
    const filters = useAirportStore((state) => state.filters);
    // const airport = getAirportById(airportId);

    if (!airport || !segments) {
        return <div>항공권 정보를 불러올 수 없습니다.</div>;
    }

    const getSegmentTitle = (index) => {
        if (filters.mode === 'roundtrip') {
            return index === 0 ? '가는편' : '오는편';
        }
        return '가는편';
    };

    return (
        <div className="pay payment-left">
            <div className="pay-detail">
                <h3>
                    <img src="/images/icon/before.svg" alt="이전" />
                    예약 확인 및 결제
                </h3>
                <div className="pay-box-wrap">
                    <div className="flight-schedule">
                        {segments.map((segment, index) => (
                            <div key={index} className="depart-wrap">
                                <div className="depart-box">
                                    <h4 className="depart">{getSegmentTitle(index)}</h4>
                                    <div className="w-to-w">
                                        <span>{airport.arriveCode}</span>
                                        <img src="/images/icon/air-arrow.svg" alt="화살표" />
                                        <span>{airport.departCode}</span>
                                    </div>
                                </div>
                                <div className="depart-info">
                                    <div className="airline">
                                        <div className="flight-logo">
                                            {airport.logo ? (
                                                <img src={airport.logo} alt={airport.airline} />
                                            ) : (
                                                <span className="placeholder" />
                                            )}
                                        </div>
                                        <div className="info">
                                            <p className="name">{airport.airline}</p>
                                            <p className="code">{airport.flightNo}</p>
                                        </div>
                                    </div>
                                    <div className="depart-arrive-wrap">
                                        <div className="time depart-time">
                                            {segment.departureDate}
                                            <div className="time-info">
                                                <span className="dpt">{airport.departureTime}</span>
                                                <span className="dpa">
                                                    {airport.departureAirport}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flight-through">
                                            <span>{airport.duration}</span>
                                            <img src="/images/icon/goto.svg" alt="연결" />
                                            <span className="direct">
                                                {airport.direct ? '직항' : '경유'}
                                            </span>
                                        </div>
                                        <div className="time arrive-time">
                                            {segment.arrivalDate}
                                            <div className="time-info">
                                                <span className="dpt">{airport.arrivalTime}</span>
                                                <span className="dpa">
                                                    {airport.arrivalAirport}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p></p>
                                </div>
                            </div>
                        ))}

                        {/* <div className="arrive-wrap">
                            <h4 className="arrive">오는편</h4>
                            <div className="w-to-w">
                                <span>{airport.arriveCode}</span>
                                <img src="/images/icon/air-arrow.svg" alt="화살표" />
                                <span>{airport.departCode}</span>
                            </div>
                        </div> */}
                    </div>
                    <div className="flight-resname">
                        <h4>예약자 정보</h4>
                        <p>
                            <input type="text" className="kor-name" placeholder="한글 이름" />
                            <input type="text" className="email" placeholder="이메일 주소" />
                            <input type="text" className="phone-num" placeholder="휴대폰 번호" />
                        </p>
                    </div>
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
                            <input type="text" placeholder="영문 이름" />
                            <input type="text" placeholder="영문 성" />
                        </div>
                        <div className="pass-ide">
                            <input type="text" placeholder="생년월일(숫자 8자리)" />
                            <input type="text" placeholder="영문 성" />
                        </div>

                        <select className="nationality">
                            <option value="KOR"> 대한민국(KOR)</option>
                            <option value="USA"> 미국(USA)</option>
                            <option value="JAN"> 일본(JAN)</option>
                            <option value="CHN"> 중국(CHN)</option>
                            <option value="VNM"> 베트남(VNM)</option>
                        </select>
                        <div className="gender-toggle">
                            <button type="button" className="gender"></button>
                            <button type="button" className="gender"></button>
                        </div>
                        <div className="pass-head">
                            <h4>여권 정보</h4>
                            <span>
                                <IoIosCheckmarkCircleOutline
                                    style={{ fontSize: '23px', color: '#b2b2b2' }}
                                />
                                여권정보 나중에 등록
                            </span>
                        </div>
                        <div className="pass-ide">
                            <input type="text" placeholder="여권 번호(ex.m12345678)" />
                            <input type="text" placeholder="여권 만료일(yyyymmdd)" />
                        </div>
                        <select className="nationality-country">
                            <option value="KOR"> 대한민국(KOR)</option>
                            <option value="USA"> 미국(USA)</option>
                            <option value="JAN"> 일본(JAN)</option>
                            <option value="CHN"> 중국(CHN)</option>
                            <option value="VNM"> 베트남(VNM)</option>
                        </select>
                    </div>

                    <div className="pay-coupon">
                        <h4>쿠폰</h4>
                        <select id="coupon" name="select-coupon">
                            <option value="" disabled selected hidden>
                                사용 가능한 쿠폰 <span>{/*props*/}1개</span>
                            </option>
                            <option value="apple">가능한 옵션</option>
                            <option value="banana">마이페이지의</option>
                            <option value="grape">쿠폰이랑 연결</option>
                        </select>
                    </div>
                    <div className="pay-point">
                        <h4>포인트</h4>
                        <p>
                            RT 포인트 {/*props*/}
                            <span>12,000</span>P
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
                            {/* 구현 어려우면 빼기... */}
                            <span></span> <p>이 결제수단을 다음에도 사용</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightPaymentLeft;

import { useNavigate } from 'react-router-dom';
import useHotelStore from '../../../store/hotelStore'; // ✅ useHotelStore import
import { differenceInDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import ReserveBtn from '../../ui/reserveBtn';

const DetailRight = ({ hotel, selectedRoom }) => {
    const navigate = useNavigate();

    // ✅ useHotelStore에서 searchParams 가져오기
    const searchParams = useHotelStore((state) => state.searchParams);

    // ✅ 날짜와 인원 데이터 추출
    const { startDate, endDate, people } = searchParams;

    let nights = 0;
    let formattedDates = '날짜를 선택하세요';
    let totalPrice = selectedRoom.price;

    // ✅ startDate와 endDate가 모두 있을 때 계산
    if (startDate && endDate) {
        // 숙박 기간 계산 (차이 + 1 대신 차이만 계산하여 박 수를 구함)
        nights = differenceInDays(endDate, startDate);
        if (nights < 0) nights = 0; // 유효하지 않은 날짜 선택 시 0박 처리

        // 날짜 형식 지정
        const formattedStart = format(new Date(startDate), 'M월 d일 (E)', { locale: ko });
        const formattedEnd = format(new Date(endDate), 'M월 d일 (E)', { locale: ko });
        formattedDates = `${formattedStart} ~ ${formattedEnd}`;

        // 총액 계산
        totalPrice = selectedRoom.price * nights;
    }

    const handleReservation = () => {
        const reservationData = {
            hotel: hotel,
            selectedRoom: selectedRoom,
            nights: nights,
            startDate: startDate,
            endDate: endDate,
            people: people,
            totalPrice: totalPrice,
            productType: 'hotel',
        };

        navigate('/payment', {
            state: reservationData,
        });
    };

    return (
        <div className="detail-right">
            <section className="detail-side">
                <div className="box-head">
                    <div className="box-thum">
                        <img
                            src={`/images/hotels/detail/roomOptions/${selectedRoom.image[0]}`}
                            alt=""
                        />
                    </div>
                    <div className="box-select">
                        <strong>{selectedRoom.name}</strong>
                        <span className="party">
                            기준 {selectedRoom.party}인 / 최대 {selectedRoom.party}인
                        </span>
                    </div>
                </div>
                <p className="per-day">
                    {selectedRoom.price.toLocaleString()}원 / <span>박</span>
                </p>
                <div className="box-option">
                    <div className="res-prices">
                        <ul className="total">
                            <li>
                                <span>숙박 기간({nights}박)</span>
                                <span>{formattedDates}</span>
                            </li>
                            <li>
                                <span>인원</span>
                                <span>성인 {people}명</span>
                            </li>
                            <li>
                                <span>객실 요금</span>
                                <span>{selectedRoom.price.toLocaleString()}원</span>
                            </li>
                        </ul>

                        <div className="total-wrap">
                            <strong>총액</strong>
                            <em>{totalPrice.toLocaleString()}원</em>
                        </div>
                    </div>
                </div>
                <div className="btn-wrap">
                    <button className="button large o reserve" onClick={handleReservation}>
                        예약하기
                    </button>
                    {/* <ReserveBtn className="g" /> */}
                </div>
            </section>
        </div>
    );
};

export default DetailRight;

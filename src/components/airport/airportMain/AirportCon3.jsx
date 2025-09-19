import { IoAirplane } from 'react-icons/io5';
import { CgArrowsExchange } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import useAirportStore from '../../../store/airportStore';

const AirportCon3 = () => {
    const navigate = useNavigate();
    const airportDetails = useAirportStore((s) => s.airportDetails);
    const setFilter = useAirportStore((s) => s.setFilter);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const promoFlights = shuffleArray(airportDetails).slice(0, 4);

    const handleClick = (flight) => {
        setFilter({
            mode: 'oneway',
            segments: [
                {
                    from: flight.departureAirport,
                    to: flight.arrivalAirport,
                    date: new Date(),
                },
            ],
            dates: [new Date(), null],
            people: 1,
            seat: '일반석',
        });
        navigate(`/airport/search`);
    };

    return (
        <section className="airport-main-con airport-main-con3">
            <div className="inner">
                <h3>해외 인기 여행지를 한눈에</h3>
                <h4>24시간 무료 취소 가능한 항공권을 안심하고 예약하세요</h4>
                <div className="promo-list">
                    {promoFlights.map((f) => (
                        <div
                            className="promo-card-con"
                            key={f.id}
                            onClick={() => handleClick(f)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={f.images} alt={f.airline} />
                            <div className="info">
                                <small className="type">
                                    <IoAirplane className="icons" /> {f.airline}
                                </small>
                                <h5 className="title">
                                    {f.departureAirport}{' '}
                                    <CgArrowsExchange className="exchange-icon" />{' '}
                                    {f.arrivalAirport}
                                </h5>
                            </div>
                            <div className="details">
                                <p className="date-condi">
                                    <span className="date">
                                        {f.departureTime} ~ {f.arrivalTime}
                                    </span>
                                    <span className="condition">수하물: {f.baggage}</span>
                                </p>
                                <div className="price-box">
                                    <strong className="price">
                                        {f.price.toLocaleString('ko-KR')}원 ~
                                    </strong>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AirportCon3;

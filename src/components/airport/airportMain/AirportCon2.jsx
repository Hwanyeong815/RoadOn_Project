import { FiMapPin } from "react-icons/fi";
import hotelListData from '../../../api/hotelsListData';
import { useNavigate } from "react-router-dom";

const AirportCon2 = () => {
    const navigate = useNavigate();
    
    const handleCardClick = (slug) => {
        navigate(`/hotels/${slug}`);
    };

    const promos = hotelListData.filter(hotel => hotel.discount === true).slice(0, 4);

    return (
        <section className="airport-main-con airport-main-con2">
            <div className="inner">
                <h3>가을 최대 20% 혜택으로 특별한 여행</h3>
                <h4>
                    가을 정취 물씬 풍기는 감성 숙소부터 아늑한 온천 펜션을 만나보세요
                </h4>

                <div className="promo-list">
                    {promos.map((p) => (
                        <div 
                            className="promo-card-con" 
                            key={p.id}
                            onClick={() => handleCardClick(p.slug)} 
                        >
                            <img src={`/images/hotels/detail/hotelsList/${p.image[0]}`} alt={p.name} />
                            <div className="info">
                                <small className="type">{p.type}</small>
                                <h5 className="title">{p.name}</h5>
                                <p className="location">
                                    <FiMapPin className="icon" /> {p.location}
                                </p>
                                <div className="price-box">
                                    <del className="original">
                                        {(p.price * 100 / (100 - p.percentageOff)).toLocaleString()}원
                                    </del>
                                    <span className="discount">{p.percentageOff}%</span>
                                    <strong className="price">
                                        {p.price.toLocaleString()}원
                                    </strong>
                                    <span> / 박</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AirportCon2;
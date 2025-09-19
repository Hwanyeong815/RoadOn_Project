// src/components/hotels/hotelsSearch/HotelBox.jsx
import '../style.scss';
import { useNavigate } from 'react-router-dom';
import WishButton from '../../ui/wishbutton/WishButton';
import useWishStore from '../../../store/wishStore';

const HotelBox = ({ hotelId, inWishList = false }) => {
    // wishStore에서만 읽기
    const hotels = useWishStore((s) => s.hotels || []);
    const hotel = hotels.find((h) => String(h?.id) === String(hotelId));

    const navigate = useNavigate();

    if (!hotel) return inWishList ? null : <div>호텔 정보를 찾을 수 없습니다.</div>;

    const handleHotelClick = () => {
        if (hotel.slug) navigate(`/hotels/${hotel.slug}`);
    };

    // 기존 프로젝트에서 보이던 경로 유지
    const imgSrc =
        (hotel?.image?.[0] && `/images/hotels/detail/hotelsList/${hotel.image[0]}`) ||
        '/images/hotels/default.png';

    return (
        <div
            className="hotel-box"
            onClick={handleHotelClick}
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            <div className="hotel-image" style={{ position: 'relative' }}>
                <img
                    src={imgSrc}
                    alt={hotel.name || ''}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/hotels/default.png';
                    }}
                />
                <div className="wish-overlay" onClick={(e) => e.stopPropagation()}>
                    <WishButton type="hotel" id={hotel.id} data={hotel} />
                </div>
            </div>

            <div className="hotel-info">
                <div className="info-top">
                    <div className="top-title">
                        <span>
                            {hotel.type} {hotel.star}
                        </span>
                        <h4>{hotel.name}</h4>
                    </div>
                    <div className="rate">
                        <img src="/images/hotels/detail/icon/star_rate.svg" alt="별점" />
                        <span>
                            {hotel.averageRating ?? '0.0'} ({hotel.reviewCount ?? 0})
                        </span>
                    </div>
                </div>

                <div className="info-bottom">
                    <div className="bottom-location">
                        <img src="/images/hotels/search/map_pin.svg" alt="" />
                        <span>{hotel.location}</span>
                    </div>
                    <div className="bottom-price">
                        <span>1박, 성인 2명</span>
                        <strong>{Number(hotel.price ?? 0).toLocaleString()}원</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelBox;

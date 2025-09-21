import '../style.scss';
import { useNavigate } from 'react-router-dom';
import WishButton from '../../ui/wishbutton/WishButton';
import useWishStore from '../../../store/wishStore';
import useHotelStore from '../../../store/hotelStore';
import { openWishlistShortcut } from '../../ui/swal/presets'; // ✅ 그대로 사용

const HotelBox = ({ hotelId, inWishList = false }) => {
    const hotels = useWishStore((s) => s.hotels || []);
    const hotel = hotels.find((h) => String(h?.id) === String(hotelId));

    const navigate = useNavigate();
    const getHotelReviews = useHotelStore((state) => state.getHotelReviews);

    if (!hotel) return inWishList ? null : <div>호텔 정보를 찾을 수 없습니다.</div>;

    const calculateAverageRating = (hotelId, reviewCount) => {
        const reviews = getHotelReviews(hotelId, reviewCount);
        if (!reviews || reviews.length === 0) return '0.00';
        const totalRating = reviews.reduce((sum, review) => sum + review.rate, 0);
        const average = totalRating / reviews.length;
        return average.toFixed(1);
    };

    const averageRating = calculateAverageRating(hotel.id, hotel.reviewCount);
    const reviewCount = Number(hotel?.reviewCount ?? 0);

    const handleHotelClick = () => {
        if (hotel.slug) navigate(`/hotels/${hotel.slug}`);
    };

    const imgSrc =
        (hotel?.image?.[0] && `/images/hotels/detail/hotelsList/${hotel.image[0]}`) ||
        '/images/hotels/default.png';

    const getDiscountedPrice = (price, percentageOff) => {
        if (!price || !percentageOff) return 0;
        const discountedValue = price * (1 - percentageOff / 100);
        return Math.floor(discountedValue);
    };

    const renderPrice = () => {
        if (hotel.discount === true) {
            const discountedPrice = getDiscountedPrice(hotel.price, hotel.percentageOff);
            return (
                <div className="bottom-price">
                    <span>{Number(hotel.price ?? 0).toLocaleString()}원</span>
                    <div className="discounted-price">
                        <span>{hotel.percentageOff}%</span>
                        <strong>{Number(discountedPrice).toLocaleString()}원</strong>
                    </div>
                </div>
            );
        }
        return (
            <div className="bottom-price">
                <strong>{Number(hotel.price ?? 0).toLocaleString()}원</strong>
            </div>
        );
    };

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
                    <WishButton
                        type="hotel"
                        id={hotel.id}
                        data={hotel}
                        // ✅ 추가될 때만 스윗알럿 → 확인 시 찜목록 이동
                        onWish={(added) => {
                            if (added) openWishlistShortcut({ navigate });
                        }}
                    />
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
                    <div className="rate" title={`${averageRating} (${reviewCount})`}>
                        <img src="/images/hotels/detail/icon/star_rate.svg" alt="별점" />
                        <span className="rate-text">{`${averageRating} (${reviewCount})`}</span>
                    </div>
                </div>

                <div className="info-bottom">
                    <div className="bottom-location">
                        <img src="/images/hotels/search/map_pin.svg" alt="" />
                        <span>{hotel.location}</span>
                    </div>
                    {renderPrice()}
                </div>
            </div>
        </div>
    );
};

export default HotelBox;

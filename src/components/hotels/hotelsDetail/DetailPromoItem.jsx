import { FaStar } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';
import Reco from '../../../../api/hotelsPromo';
import { useNavigate } from 'react-router-dom';
import useHotelStore from '../../../../store/hotelStore';

const DetailPromoItem = ({ hotelId }) => {
    const navigate = useNavigate();
    const getHotelById = useHotelStore((state) => state.getHotelById);
    const getHotelReviews = useHotelStore((state) => state.getHotelReviews);

    const hotel = getHotelById(hotelId);
    if (!hotel) {
        return null;
    }

    const calculateAverageRating = (hotelId, reviewCount) => {
        const reviews = getHotelReviews(hotelId, reviewCount);

        if (!reviews || reviews.length === 0) return '0.00';

        const totalRating = reviews.reduce((sum, review) => sum + review.rate, 0);
        const average = totalRating / reviews.length;

        return average.toFixed(1); // 소수점 첫째자리까지
    };

    const averageRating = calculateAverageRating(hotel.id, hotel.reviewCount);

    const handleHotelClick = () => {
        navigate(`/hotels/${hotel.slug}`);
    };

    return (
        <li className="promo-list-item" onClick={handleHotelClick} style={{ cursor: 'pointer' }}>
            <div className="img-wrap">
                <img src={`/images/hotels/detail/hotelsList/${hotel.image[0]}`} alt="호텔 이미지" />
            </div>
            <div className="txt-wrap">
                <strong>
                    <em>
                        {hotel.type} {hotel.star}
                    </em>
                    {hotel.name}
                </strong>
                <p className="rate">
                    <img src="/images/hotels/detail/icon/star_rate.svg" alt="별점" />
                    {averageRating} ({hotel.reviewCount})
                </p>

                <div className="info">
                    <p className="loc">
                        <span>
                            <IoLocationOutline />
                        </span>
                        {hotel.location}
                    </p>
                    <p className="pri">
                        {hotel.price.toLocaleString()}원 /<span> 박</span>
                    </p>
                </div>
            </div>
        </li>
    );
};

export default DetailPromoItem;

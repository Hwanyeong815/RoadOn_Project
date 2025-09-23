import DetailPromoItem from './DetailPromoItem';
import './style.scss';

const DetailPromo = () => {
    const promoHotelIds = [4, 7, 10, 16];
    return (
        <section id="detail-Promo">
                <h2 className="title">다른 고객들이 함께 본 숙소</h2>
                <ul className="promo-list">
                    {promoHotelIds.map((hotelId) => (
                        <DetailPromoItem key={hotelId} hotelId={hotelId} />
                    ))}
                </ul>
        </section>
    );
};

export default DetailPromo;

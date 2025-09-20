import useTourStore from '../../../store/tourStore';
import DetailBotReviews from './detailBottom/DetailBotReviews';
import DetailLocation from './detailBottom/DetailLocation';
import DetailPromo from './detailBottom/DetailPromo';
import './style.scss';

const DetailBottom = ({ reviews: initialReviews, locationRef, reviewsRef }) => {
    const reviews = useTourStore((state) => state.reviews);
    return (
        <section id="DetailBottom">
           <DetailLocation locationRef={locationRef} />
            <DetailBotReviews reviews={reviews} reviewsRef={reviewsRef} />
            <DetailPromo />
        </section>
    );
};

export default DetailBottom;

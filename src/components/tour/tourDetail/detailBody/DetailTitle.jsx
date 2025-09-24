import './style.scss';
// import DetailBotReviewsItem from '../detailBottom/DetailBotReviewsItem';
import DetailReviewItem from '../detailBottom/DetailReviewItem';
import useTourStore from '../../../../store/tourStore';
import MiniReviewItem from '../../../hotels/hotelsDetail/MiniReviewItem';
import WishButton from '../../../ui/wishbutton/WishButton';

import { useNavigate } from 'react-router-dom';
import { openWishlistShortcut } from '../../../ui/swal/presets';

const DetailTitle = ({ tourData }) => {
    const reviews = useTourStore((state) => state.reviews);
    const getTourHighRatedReviews = useTourStore((state) => state.getTourHighRatedReviews);
    if (!tourData) return null;
    const navigate = useNavigate();
    const { title, subtitle, desc, id } = tourData;
    const miniReviews = getTourHighRatedReviews(id, 3);

    return (
        <section className="detail-title">
            <article className="detail-title-head-a">
                <div>
                    <em>{title}</em>
                    <h3>{subtitle}</h3>
                    <b>{desc}</b>
                    <p className="rate">
                        <img src="/images/icon/star_rate.svg" alt="별점" />
                        <span>4.5 (32)</span>
                    </p>
                </div>
                <div className="more-btn-a">
                    <img src="/images/icon/share.svg" className="share-btn" alt="공유" />
                    {/* <img src="/images/icon/like.svg" alt="찜하기" /> */}
                    <div className="wish-overlay" onClick={(e) => e.stopPropagation()}>
                        <WishButton
                            type="tour"
                            id={tourData.id}
                            data={tourData}
                            onWish={(added) => {
                                if (added) openWishlistShortcut({ navigate });
                            }}
                        />
                    </div>
                </div>
            </article>
            {/* <DetailBotReviewsItem tourData={tourData} /> */}
            {/* <DetailReviewItem review={reviews} /> */}
            <section className="detail-reviews">
                <ul className="list">
                    {miniReviews.map((review) => (
                        <MiniReviewItem key={review.uniqueId} review={review} />
                    ))}
                </ul>
            </section>
        </section>
    );
};
export default DetailTitle;

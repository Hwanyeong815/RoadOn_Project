import './style.scss';
import MiniReviewItem from '../../../hotels/hotelsDetail/MiniReviewItem';
import WishButton from '../../../ui/wishbutton/WishButton';
import { useNavigate } from 'react-router-dom';
import { openWishlistShortcut } from '../../../ui/swal/presets';
import useTourStore from '../../../../store/tourStore';

const DetailTitle = ({ tourData }) => {
    const getTourHighRatedReviews = useTourStore((state) => state.getTourHighRatedReviews);
    if (!tourData) return null;

    const navigate = useNavigate();
    const { title, subtitle, desc, id, slug } = tourData;
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
                        {/* <img src="/images/icon/like.svg" alt="찜하기" /> */}
                        {/* <WishButton className='wish-hotel-btn'/> */}
                    <img src="/images/icon/share.svg" className="share-btn" alt="공유" />
                    <div className="wish-overlay" onClick={(e) => e.stopPropagation()}>
                        <WishButton
                            type="tour"
                            id={slug || id} // ✅ slug 우선, 없으면 id
                            data={tourData}
                            onWish={(added) => {
                                console.log('WishButton clicked:', { type: 'tour', id, slug });
                                if (added) openWishlistShortcut({ navigate });
                            }}
                        />
                    </div>
                </div>
            </article>

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

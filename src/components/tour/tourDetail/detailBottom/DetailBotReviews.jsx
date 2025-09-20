import { useState } from 'react';
import DetailReviewItem from './DetailReviewItem';

const DetailReviews = ({ reviews, reviewsRef }) => {
    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;

        const totalRating = reviews.reduce((sum, review) => sum + review.rate, 0);
        const average = totalRating / reviews.length;

        return average.toFixed(2); // 소수점 둘째자리까지
    };

    const averageRating = calculateAverageRating(reviews);

    const [showAllReviews, setShowAllReviews] = useState(false);
    const [displayedCount, setDisplayedCount] = useState(4);

    // 표시할 리뷰 개수 결정
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, displayedCount);

    // 더보기/접기 버튼 클릭
    const handleShowMore = () => {
        if (showAllReviews) {
            // 접기: 처음 4개만 보이도록
            setShowAllReviews(false);
            setDisplayedCount(4);
        } else {
            // 더보기: 4개씩 추가 또는 전체 보기
            const nextCount = displayedCount + 4;
            if (nextCount >= reviews.length) {
                setShowAllReviews(true);
            } else {
                setDisplayedCount(nextCount);
            }
        }
    };

    // 버튼 텍스트 결정
    const getButtonText = () => {
        if (showAllReviews) {
            return '방문자 리뷰 접기';
        } else if (displayedCount >= reviews.length) {
            return '방문자 리뷰 접기';
        } else {
            const remainingCount = reviews.length - displayedCount;
            return `방문자 리뷰 더보기`;
        }
    };
    
    return (
        <section id="detail-Bot-Reviews" ref={reviewsRef }>
            <div className="reviews-wrap-head">
                <h2 className="title">
                    방문자 리뷰
                    <span>({reviews.length})</span>
                </h2>
                <div className="rate">
                    <span>
                        <img src="/images/hotels/detail/icon/star_rate.svg" alt="별점" />
                    </span>
                    {averageRating}
                </div>
            </div>
            <div className="reviews-wrap-body">
                <ul className="reviews-wrap-body-list">
                    {displayedReviews.map((review) => (
                        <DetailReviewItem key={review.id} review={review} />
                    ))}
                </ul>
            </div>
            {reviews.length > 4 && (
                <div className="button" onClick={handleShowMore} style={{ cursor: 'pointer' }}>
                    <p>{getButtonText()}</p>
                </div>
            )}
        </section>
    );
};

export default DetailReviews;

import { useState, useEffect, useRef } from "react";
import DetailReviewItem from "./DetailReviewItem";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import KakaoMap from "./KakaoMap";

const DetailBottom = ({hotel, reviews, locationRef, reviewsRef}) => {
    const [copied, setCopied] = useState(false);

    const handleCopySuccess = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        
        const totalRating = reviews.reduce((sum, review) => sum + review.rate, 0);
        const average = totalRating / reviews.length;
        
        return average.toFixed(2);
    };

    const averageRating = calculateAverageRating(reviews);

    const [showAllReviews, setShowAllReviews] = useState(false);
    const [displayedCount, setDisplayedCount] = useState(4);

    const displayedReviews = showAllReviews 
        ? reviews 
        : reviews?.slice(0, displayedCount) || [];

    const handleShowMore = () => {
        if (showAllReviews) {
            setShowAllReviews(false);
            setDisplayedCount(4);
        } else {
            const nextCount = displayedCount + 4;
            if (nextCount >= (reviews?.length || 0)) {
                setShowAllReviews(true);
            } else {
                setDisplayedCount(nextCount);
            }
        }
    };

    const getButtonText = () => {
        if (showAllReviews) {
            return '방문자 리뷰 접기';
        } else if (displayedCount >= (reviews?.length || 0)) {
            return '방문자 리뷰 접기';
        } else {
            return `방문자 리뷰 더보기`;
        }
    };
    
    return (
        <section className="detail-bottom-info">
            <section id="detail-loaction" ref={locationRef}>
                <h2 className="title">숙소 위치</h2>
                <div className="map">
                    <KakaoMap address={hotel?.address} name={hotel?.name} />
                </div>
                <div className="address">
                    <strong>
                        {hotel?.address} 
                        <CopyToClipboard 
                            text={hotel?.address || hotel?.location} 
                            onCopy={handleCopySuccess}
                        >
                            <span className="copy-icon" style={{ cursor: 'pointer', marginLeft: '8px' }}>
                                <HiOutlineClipboardDocument />
                            </span>
                        </CopyToClipboard>
                        {copied && <span className="copy-feedback">주소가 복사되었습니다.</span>}                 
                    </strong>
                    <ul className="vector">
                        {hotel?.landmark?.map((place, idx) =>
                            <li key={idx}>{place}</li>
                        )}
                    </ul>
                </div>
            </section>
            <section id="detail-Bot-Reviews" ref={reviewsRef}>
                <div className="reviews-wrap-head">
                    <h2 className="title">
                        방문자 리뷰
                        <span>({reviews?.length || 0})</span>
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
                        {displayedReviews?.map((review) => (
                            <DetailReviewItem key={review.id} review={review} />
                        ))}
                    </ul>
                </div>
                {(reviews?.length || 0) > 4 && (
                    <div className="button" onClick={handleShowMore} style={{ cursor: 'pointer' }}>
                        <p>{getButtonText()}</p>
                    </div>
                )}
            </section>
        </section>
    );
};

export default DetailBottom;
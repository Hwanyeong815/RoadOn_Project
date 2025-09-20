import { useNavigate, useParams } from 'react-router-dom';
import DetailBody from './DetailBody';
import DetailBottom from './DetailBottom';
import './style.scss';
import useTourStore from '../../../store/tourStore';
import { useEffect, useRef } from 'react';

const TourDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const currentTour = useTourStore((state) => state.currentTour);
    const setCurrentTourBySlug = useTourStore((state) => state.setCurrentTourBySlug);
    const clearCurrentTour = useTourStore((state) => state.clearCurrentTour);

    const getTourHighRatedReviews = useTourStore((state) => state.getTourHighRatedReviews);
    const tourReviews = currentTour ? getTourHighRatedReviews(currentTour.id, 10) : [];

     const buildingRef = useRef(null);
    const descriptionRef = useRef(null);
    const locationRef = useRef(null);
    const reviewsRef = useRef(null);


    useEffect(() => {
        if (slug) {
            setCurrentTourBySlug(slug);
        }

        return () => clearCurrentTour();
    }, [slug, setCurrentTourBySlug, clearCurrentTour]);

    // 투어 데이터를 찾을 수 없는 경우
    if (slug && !currentTour) {
        return (
            <main id="TourDetail">
                <div className="inner">
                    <div className="error-message">
                        <h2>투어를 찾을 수 없습니다</h2>
                        <button className="button o" onClick={() => navigate('/tour')}>
                            투어 목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main id="TourDetail">
            <div className="inner">
                <DetailBody 
                    tourData={currentTour} 
                    buildingRef={buildingRef}
                    descriptionRef={descriptionRef}
                      locationRef={locationRef} 
                reviewsRef={reviewsRef} 
                />
                <DetailBottom 
                    tourData={currentTour} 
                    reviews={tourReviews} 
                    locationRef={locationRef}
                    reviewsRef={reviewsRef}
                />
            </div>
        </main>
    );
};

export default TourDetail;

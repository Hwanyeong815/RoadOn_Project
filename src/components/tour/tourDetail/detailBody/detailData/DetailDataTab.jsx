import useTourStore from "../../../../../store/tourStore";

const DetailDataTab = ({ buildingRef, descriptionRef, locationRef, reviewsRef }) => {
     const activeTab = useTourStore((state) => state.activeTab);
    const handleScrollTo = useTourStore((state) => state.handleScrollTo);
    return (
        <section className="detail-data-tab">
            <div className="detail-data-tab-btns-wrap">
                <button
                    className={`building ${activeTab === '시설/서비스' ? 'on' : ''}`}
                    onClick={() => handleScrollTo(buildingRef, '시설/서비스')}
                >
                    시설/서비스
                </button>
                <button
                    className={`description ${activeTab === '여행 상세 정보' ? 'on' : ''}`}
                    onClick={() => handleScrollTo(descriptionRef, '여행 상세 정보')}
                >
                    여행 상세 정보
                </button>
                <button
                    className={`location ${activeTab === '위치' ? 'on' : ''}`}
                    onClick={() => handleScrollTo(locationRef, '위치')}
                >
                    위치
                </button>
                <button
                    className={`reviews ${activeTab === '리뷰' ? 'on' : ''}`}
                    onClick={() => handleScrollTo(reviewsRef, '리뷰')}
                >
                    리뷰
                </button>
            </div>
        </section>
    );
};

export default DetailDataTab;

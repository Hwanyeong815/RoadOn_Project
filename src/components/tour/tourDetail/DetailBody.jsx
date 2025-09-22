import DetailBodyInfo from './detailBody/DetailBodyInfo';
import DetailThum from './detailBody/DetailThum';

import './style.scss';

const DetailBody = ({ tourData, buildingRef, descriptionRef, locationRef, reviewsRef }) => {
    return (
        <section id="DetailBody">
            <DetailThum tourData={tourData} />
            <DetailBodyInfo
                tourData={tourData}
                buildingRef={buildingRef}
                descriptionRef={descriptionRef}
                locationRef={locationRef}
                reviewsRef={reviewsRef}
            />
        </section>
    );
};

export default DetailBody;

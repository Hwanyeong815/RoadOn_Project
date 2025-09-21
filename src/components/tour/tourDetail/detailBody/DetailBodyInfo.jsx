import './style.scss';
import DetailTitle from './DetailTitle';
import DetailSide from './DetailSide';
import DetailData from './DetailData';

const DetailBodyInfo = ({ tourData, buildingRef, descriptionRef, locationRef, reviewsRef}) => {
    return (
        <section className="detail-body-info">
            <div className="left">
                <DetailTitle tourData={tourData} /> 
                <DetailData 
                    tourData={tourData} 
                    buildingRef={buildingRef}
                    descriptionRef={descriptionRef}
                    locationRef={locationRef} 
                    reviewsRef={reviewsRef}
                />
            </div>
            <div className="right">
                <DetailSide tourData={tourData} />
            </div>
        </section>
    );
};

export default DetailBodyInfo;

import './style.scss';

const DetailLocation = ({locationRef}) => {
    return (
        <section id="detail-location" ref={locationRef}>
            <h2 className="title">숙소 위치</h2>
            <div className="map"></div>
            <div className="address">
                <strong>
                    Calle Cardenal Ilundain, 28, 스페인 <span></span>
                </strong>
                <ul className="vector">
                    <li>마리아 루이사 공원 1.3km</li>
                    <li>플라자 드 에스파니아 1.5km</li>
                    <li>레알 알카사르 데 세비야 2.2km</li>
                    <li>세비야 대성당 2.6km</li>
                </ul>
            </div>
        </section>
    );
};

export default DetailLocation;

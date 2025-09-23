import useAuthStore from '../../../../store/authStore';
import DetailCon2 from './detailData/DetailCon2';
import DetailDataTab from './detailData/DetailDataTab';
import './style.scss';

const DetailData = ({tourData, buildingRef, descriptionRef, locationRef, reviewsRef  }) => {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const handleAdClick = () =>
            openAndNavigate('loginRequired', {
                confirmTo: '/login',
                navigate,
            });
    
    return (
        <section className="detail-data">
            <DetailDataTab 
                buildingRef={buildingRef} 
                descriptionRef={descriptionRef} 
                locationRef={locationRef} 
                reviewsRef={reviewsRef}
            />
            <div className="con con1 building" ref={buildingRef}>   
                <h2>시설/서비스</h2>
                <ul className="service-wrap">
                    <li>
                        <img src="/images/icon/wifi.png" alt="wifi.png" />
                        무료 와이파이
                    </li>
                    <li>
                        <img src="/images/icon/toilet.png" alt="toilet.png" />
                        반신욕
                    </li>
                    <li>
                        <img src="/images/icon/park.png" alt="park.png" />
                        주차
                    </li>
                    <li>
                        <img src="/images/icon/suitcase-b.png" alt="suitcase-b.png" />
                        수화물 보관
                    </li>
                    <li>
                        <img src="/images/icon/wifi.png" alt="wifi.png" />
                        24시간 체크인
                    </li>
                </ul>
            </div>
           {!isLoggedIn && (
                        <div
                            className="con advertise"
                            onClick={handleAdClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src="/images/hotels/detail/login_first.png"
                                alt="login_first.png"
                            />
                        </div>
                    )}
            <div className="con con2 description" ref={descriptionRef}>
                <h2>여행 상세 정보</h2>

                <DetailCon2 tourData={tourData} />
            </div>
            {/* <div className="con con3 location">
                <h2>숙소 위치</h2>
                <p></p>
            </div>
            <div className="con con4 reviews">
                <h2>방문자 리뷰 (12)</h2>
                <p></p>
            </div> */}
        </section>
    );
};

export default DetailData;

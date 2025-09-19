import { BsTelephone } from 'react-icons/bs';
import { MdOutlineEmail } from 'react-icons/md';
import {
    Wifi,
    Breakfast,
    Luggage,
    Pool,
    Restaurant,
    Pet,
    Parking,
    CheckIn,
    Spa,
    Bbq,
} from './hotelsService';
import RoomOption from './RoomOption';
import Policies from './Policies';
import Location from './Location';
import MiniReviewItem from './MiniReviewItem';
// import DetailBotReviewsItem from '../../tour/tourDetail/detailBottom/DetailBotReviewsItem';

const DetailLeft = ({
    hotel,
    options,
    displayedRooms,
    selectedFilter,
    selectedRoom,
    showAllRooms,
    handleFilterClick,
    handleRoomSelect,
    handleShowMore,
    averageRating,
    miniReviews,
}) => {
    const serviceComponentMap = {
        '무료 와이파이': Wifi,
        '조식 제공': Breakfast,
        '수화물 보관': Luggage,
        수영장: Pool,
        레스토랑: Restaurant,
        '반려동물 동반': Pet,
        주차: Parking,
        '24시간 체크인': CheckIn,
        스파: Spa,
        '개별 바베큐': Bbq,
    };

    const [activeTab, setActiveTab] = useState('시설/서비스');

    const buildingRef = useRef(null);
    const roomOptionRef = useRef(null);
    const hotelInfoRef = useRef(null);
    const locationRef = useRef(null);
    const reviewsRef = useRef(null);

    return (
        <div className="detail-left">
            <section className="detail-title">
                <article className="detail-title-head">
                    <div className="head-left">
                        <em>
                            {hotel.type} {hotel.star}
                        </em>
                        <h3>{hotel.name}</h3>
                        <b>{hotel.engName}</b>
                        <p className="rate">
                            <img src="/images/hotels/detail/icon/star_rate.svg" alt="별점" />
                            {averageRating} ({hotel.reviewCount})
                        </p>
                    </div>
                    <div className="more-btn">
                        <img src="/images/icon/share.svg" alt="공유" />
                        <img src="/images/icon/like.svg" alt="찜하기" />
                    </div>
                </article>
                <section className="detail-reviews" style={{ marginBottom: '20px' }}>
                    <ul className="list" style={{ listStyle: 'none', padding: 0 }}>
                        {miniReviews.map((review) => (
                            <MiniReviewItem
                                key={review.uniqueId}
                                review={review}
                                style={{
                                    padding: '15px',
                                    border: '1px solid #ddd',
                                    marginBottom: '10px',
                                    borderRadius: '5px',
                                }}
                            />
                        ))}
                    </ul>
                </section>
            </section>
            <section className="detail-data">
                <section className="detail-data-tab">
                    <div className="detail-data-tab-btns-wrap">
                        <button
                            className={activeTab === '시설/서비스' ? 'building on' : 'building'}
                            onClick={() => setActiveTab('시설/서비스')}
                        >
                            시설/서비스
                        </button>
                        <button
                            className={activeTab === '객실 선택' ? 'room-option on' : 'room-option'}
                            onClick={() => setActiveTab('객실 선택')}
                        >
                            객실 선택
                        </button>
                        <button
                            className={activeTab === '숙소 정보' ? 'hotel-info on' : 'hotel-info'}
                            onClick={() => setActiveTab('숙소 정보')}
                        >
                            숙소 정보
                        </button>
                        <button
                            className={activeTab === '위치' ? 'location on' : 'location'}
                            onClick={() => setActiveTab('위치')}
                        >
                            위치
                        </button>
                        <button
                            className={activeTab === '리뷰' ? 'reviews on' : 'reviews'}
                            onClick={() => setActiveTab('리뷰')}
                        >
                            리뷰
                        </button>
                    </div>
                </section>
                <div className="detail-contents">
                    <div className="con con1 building" ref={buildingRef}>
                        <h2>시설/서비스</h2>
                        <ul className="services-list">
                            {hotel.service.map((serviceName, index) => {
                                const ServiceComponent = serviceComponentMap[serviceName];
                                return ServiceComponent ? (
                                    <ServiceComponent key={index} />
                                ) : (
                                    <li key={index} className="service-icon">
                                        <span>{serviceName}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="con advertise">
                        <img src="/images/hotels/detail/login_first.png" alt="login_first.png" />
                    </div>
                    <div className="con con2 room-option-wrap" ref={roomOptionRef}>
                        <h2>객실 선택</h2>
                        <ul className="room-filter">
                            <li
                                className={selectedFilter === '조식 포함' ? 'active' : ''}
                                onClick={() => handleFilterClick('조식 포함')}
                            >
                                조식 포함
                            </li>
                            <li
                                className={selectedFilter === '무료 취소' ? 'active' : ''}
                                onClick={() => handleFilterClick('무료 취소')}
                            >
                                무료 취소
                            </li>
                            <li
                                className={selectedFilter === '시티뷰' ? 'active' : ''}
                                onClick={() => handleFilterClick('시티뷰')}
                            >
                                시티뷰
                            </li>
                        </ul>
                        <div className="room-box-list">
                            {displayedRooms.map((option) => (
                                <RoomOption
                                    key={option.id}
                                    roomData={option}
                                    onSelect={handleRoomSelect}
                                    isSelected={selectedRoom.id === option.id}
                                />
                            ))}
                            {!selectedFilter && !showAllRooms && options.length > 4 && (
                                <button className="more" onClick={handleShowMore}>
                                    객실 모두 보기
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="con con3 hotel-info-wrap" ref={hotelInfoRef}>
                        <h2>숙소 정보</h2>
                        <p>{hotel.about}</p>
                        <div className="contact">
                            <span>
                                <BsTelephone /> {hotel.phone}
                            </span>
                            <span>
                                <MdOutlineEmail /> {hotel.mail}
                            </span>
                        </div>
                    </div>
                    <div className="con con4 hotel-policies-wrap">
                        <Policies hotel={hotel} />
                    </div>
                    <div className="con con5 hotel-cancel-wrap">
                        <h2>취소/변경 안내</h2>
                        <ul className="follows">
                            <li>{hotel.cancellation[0]}</li>
                            <li>{hotel.cancellation[1]}</li>
                            <li>{hotel.cancellation[2]}</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DetailLeft;

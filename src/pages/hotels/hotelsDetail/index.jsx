// HotelsDetail.jsx
import { useNavigate, useParams } from 'react-router-dom';
import '../style.scss';
import useHotelStore from '../../../store/hotelStore';
import options from '../../../api/hotelsRoomTypeData'; // 원본 고정 데이터
import { useRef, useState } from 'react';
import DetailLeft from '../../../components/hotels/hotelsDetail/DetailLeft';
import DetailRight from '../../../components/hotels/hotelsDetail/DetailRight';
import DetailBottom from '../../../components/hotels/hotelsDetail/DetailBottom';
import GalleryModal from '../../../components/hotels/hotelsDetail/GalleryModal';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import SearchBarWhite from '../../../components/home/visual/search/SearchBarWhite';

const HotelsDetail = () => {
    const { slug } = useParams();
    const hotels = useHotelStore((state) => state.hotels);
    const hotel = hotels.find((h) => h.slug === slug);
    const getHotelReviews = useHotelStore((state) => state.getHotelReviews);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const buildingRef = useRef(null);
    const roomOptionRef = useRef(null);
    const hotelInfoRef = useRef(null);
    const hotelPoliciesRef = useRef(null);

    const [activeTab, setActiveTab] = useState('시설/서비스');
    const locationRef = useRef(null);
    const reviewsRef = useRef(null);

    // hotel이 없을 때 early return
    if (!hotel) {
        return (
            <div className="hotel-detail-error">
                <h2>호텔을 찾을 수 없습니다.</h2>
                <p>요청하신 호텔 정보가 존재하지 않습니다.</p>
            </div>
        );
    }

    // ✅ 가격 동적 계산 로직 추가
    const dynamicOptions = options.map((room, index) => {
        const basePrice = hotel.price; // HotelBox에서 받아온 hotel의 가격
        const priceIncrement = 36850;
        const newPrice = basePrice + (index * priceIncrement);

        return {
            ...room,
            price: newPrice,
        };
    });

    const handleScrollTo = (ref, tabName) => {
        setActiveTab(tabName);
        if (ref && ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop,
                behavior: 'smooth',
            });
        }
    };

    const allReviews = useHotelStore((state) => state.reviews);
    const hotelReviews = getHotelReviews(hotel.id, hotel.reviewCount);

    const [showAllRooms, setShowAllRooms] = useState(false);
    // ✅ 초기 선택 객실도 동적 가격으로 설정
    const [selectedRoom, setSelectedRoom] = useState(dynamicOptions[0]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const navigate = useNavigate();

    const getFilteredRooms = () => {
        if (!selectedFilter) {
            return showAllRooms ? dynamicOptions : dynamicOptions.slice(0, 4);
        }
        return dynamicOptions.filter((room) => room.include.includes(selectedFilter));
    };

    const handleFilterClick = (filterName) => {
        if (selectedFilter === filterName) {
            setSelectedFilter(null);
        } else {
            setSelectedFilter(filterName);
        }
        setShowAllRooms(false);
    };

    const handleRoomSelect = (roomData) => {
        setSelectedRoom(roomData);
    };

    const handleShowMore = () => {
        setShowAllRooms(true);
    };

    const handleImageClick = () => {
        setIsGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setIsGalleryOpen(false);
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return '0.00';
        const totalRating = reviews.reduce((sum, review) => sum + review.rate, 0);
        const average = totalRating / reviews.length;
        return average.toFixed(2);
    };

    const averageRating = calculateAverageRating(hotelReviews);
    const getHighRatedReviews = useHotelStore((state) => state.getHighRatedReviews);
    const miniReviews = getHighRatedReviews(hotel.id, 3);

    return (
        <main className="hotel-detail">
            <div className="inner">
                <SearchBarWhite />
                <section className="hotel-thum">
                    <div
                        className="img-box big-img-1"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={`/images/hotels/detail/hotelsList/${hotel.image[0]}`} alt="숙소이미지1" />
                    </div>
                    <div
                        className="img-box big-img-2"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={`/images/hotels/detail/hotelsList/${hotel.image[1]}`} alt="숙소이미지2" />
                        <img src="/images/icon/gallery.svg" alt="갤러리" />
                    </div>
                </section>
                {isGalleryOpen && (
                    <GalleryModal
                        images={hotel.image}
                        hotelName={hotel.name}
                        onClose={handleCloseGallery}
                    />
                )}
                <section className="detail-body-info">
                    <DetailLeft
                        hotel={hotel}
                        options={dynamicOptions} 
                        displayedRooms={getFilteredRooms()}
                        selectedFilter={selectedFilter}
                        selectedRoom={selectedRoom}
                        showAllRooms={showAllRooms}
                        handleFilterClick={handleFilterClick}
                        handleRoomSelect={handleRoomSelect}
                        handleShowMore={handleShowMore}
                        averageRating={averageRating}
                        miniReviews={miniReviews}
                        activeTab={activeTab}
                        handleScrollTo={handleScrollTo}
                        buildingRef={buildingRef}
                        roomOptionRef={roomOptionRef}
                        hotelInfoRef={hotelInfoRef}
                        locationRef={locationRef}
                        reviewsRef={reviewsRef}
                    />
                    <DetailRight hotel={hotel} selectedRoom={selectedRoom} />
                </section>
                <DetailBottom hotel={hotel} reviews={hotelReviews} activeTab={activeTab}
                    handleScrollTo={handleScrollTo}
                    locationRef={locationRef}
                    reviewsRef={reviewsRef} />
            </div>
        </main>
    );
};

export default HotelsDetail;
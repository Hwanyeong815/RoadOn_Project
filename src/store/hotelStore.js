import { create } from 'zustand';
import hotelListData from '../api/hotelsListData';
import hotelsReviewData from '../api/hotelsReviewData';

const useHotelStore = create((set, get) => ({
    hotels: hotelListData,
    selectedHotel: null,
    reviews: hotelsReviewData,
    
    // 검색 상태 추가
    searchParams: {
        location: '',
        startDate: null,
        endDate: null,
        people: 1,
    },

    // 기존 필터 상태
    filters: {
        type: [],
        star: [],
        service: [],
        discount: false,
        priceRange: [0, 1000000],
    },

    setSearchParams: (params) => {
        set({ searchParams: params });
    },

    // 필터 상태 업데이트 함수
    updateFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
    },

    // 필터링된 호텔을 반환하는 함수 (검색 조건 추가)
    getFilteredHotels: () => {
        const { hotels, filters, searchParams } = get();

        let filtered = hotels.filter((hotel) => {
            // 1. 검색 조건 (여행지) 체크
            let matchLocation = true;
            if (searchParams.location) {
                matchLocation = hotel.location.includes(searchParams.location);
            }

            // 2. 기존 필터 로직
            let matchType = false;
            if (filters.type.length === 0 || filters.type.includes('전체')) {
                // 필터가 아예 없거나 '전체'가 선택된 경우 모든 유형을 포함
                matchType = true;
            } else if (filters.type.includes('호텔·리조트')) {
                // '호텔·리조트'가 선택된 경우, '호텔'과 '호텔·리조트' 모두 포함
                const typesToMatch = ['호텔', '호텔·리조트'];
                matchType = typesToMatch.includes(hotel.type);
            } else {
                // 그 외의 경우, 선택된 유형과 정확히 일치하는지 확인
                matchType = filters.type.includes(hotel.type);
            }

            let matchStar = false;
            if (filters.star.length === 0 || filters.star.includes('전체')) {
                // 필터가 아예 없거나 '전체'가 선택된 경우 모든 성급을 포함
                matchStar = true;
            } else {
                // 그 외의 경우, 선택된 성급과 정확히 일치하는지 확인
                matchStar = filters.star.includes(hotel.star);
            }
            
            const matchService =
                filters.service.length === 0 ||
                filters.service.every((s) => hotel.service.includes(s));
            const matchDiscount = !filters.discount || hotel.discount === true; // 할인 여부
            const matchPrice =
                hotel.price >= filters.priceRange[0] && hotel.price <= filters.priceRange[1];

            return matchLocation && matchType && matchStar && matchService && matchDiscount && matchPrice;
        });
        return filtered;
    },

    // 나머지 기존 메서드들...
    getHotelById: (id) => {
        const { hotels } = get();
        return hotels.find((hotel) => hotel.id === id);
    },

    setSelectedHotel: (id) => {
        const hotel = get().getHotelById(id);
        set({ selectedHotel: hotel });
    },

    getAllHotels: () => get().hotels,

    getHotelReviews: (hotelId, reviewCount) => {
        const { reviews } = get();
        
        const seededRandom = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        
        const shuffledReviews = [...reviews].sort((a, b) => {
            const seedA = seededRandom(hotelId * 100 + a.id);
            const seedB = seededRandom(hotelId * 100 + b.id);
            return seedA - seedB;
        });
        
        return shuffledReviews.slice(0, reviewCount).map((review, index) => ({
            ...review,
            hotelId: hotelId,
            uniqueId: `${hotelId}-${review.id}-${index}`
        }));
    },

    getHighRatedReviews: (hotelId, count = 3) => {
        const { reviews } = get();
        
        const highRatedReviews = reviews.filter(review => review.rate >= 3);
        
        const seededRandom = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };
        
        const shuffledReviews = [...highRatedReviews].sort((a, b) => {
            const seedA = seededRandom(hotelId * 200 + a.id);
            const seedB = seededRandom(hotelId * 200 + b.id);
            return seedA - seedB;
        });
        
        return shuffledReviews.slice(0, count).map((review, index) => ({
            ...review,
            hotelId: hotelId,
            uniqueId: `mini-${hotelId}-${review.id}-${index}`
        }));
    },
}));

export default useHotelStore;
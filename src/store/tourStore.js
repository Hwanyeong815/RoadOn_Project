// src/store/tourStore.js
import { create } from 'zustand';
import packagesData from '../api/packagesData'; // 병합 완료된 패키지 데이터(이미지/benefits/slug 포함)
import packagesReviewData from '../api/packagesReviewData';

// 카테고리 탭 라벨
export const CATEGORY_LABELS = ['드라마', '영화', '예능', 'K-POP'];

// 문자열 → slug/fallback
const kebab = (s = '') =>
    s
        .toString()
        .trim()
        .replace(/[《》"'`]/g, '')
        .replace(/[\s_/]+/g, '-')
        .replace(/[^a-zA-Z0-9-가-힣]/g, '')
        .toLowerCase();

// 기존 tourData의 id 규칙과 최대한 호환되도록 slug→id 매핑(없으면 slug 사용)
const SLUG_TO_CANONICAL_ID = {
    'younskitchen2-tenerife': 'younskitchen2',
    'harbin-film-tour': 'harbin',
    'seojin-mexico-bacalar': 'seojin',
    'when-life-gives-you-tangerines': 'tangerines',
    'hometown-chachacha-tour': 'hometown-chachacha',
    'kpop-demon-hunters-tour': 'kpop-demonhunters',
    'blackpink-worldtour-seoul': 'blackpink-concert',
    'bts-yet-to-come-tour': 'bts-yet-to-come',
};

// (옵션) 숫자형 tourId도 유지하고 싶을 때 사용
const SLUG_TO_TOURID = {
    'younskitchen2-tenerife': 1,
    'harbin-film-tour': 2,
    'seojin-mexico-bacalar': 3,
    'when-life-gives-you-tangerines': 4,
    'hometown-chachacha-tour': 5,
    'kpop-demon-hunters-tour': 6,
    'blackpink-worldtour-seoul': 7,
    'bts-yet-to-come-tour': 8,
};

// packages → 컴포넌트가 쓰는 tours 포맷으로 정규화
function normalizePackagesToTours(packagesArr) {
    return packagesArr.map((p, i) => {
        const slug = p.slug || kebab(p.title);
        const id = SLUG_TO_CANONICAL_ID[slug] || slug;
        const tourId = SLUG_TO_TOURID[slug] || i + 1; // initialTourId 대응용

        return {
            // 컴포넌트(TourMainCon2)가 바로 쓰는 키들
            id, // excludedIds/키 등에 사용
            tourId, // initialTourId 지원
            category: p.contents, // "드라마" | "영화" | "예능" | "K-POP"
            title: p.title, // ex) 《윤식당 2》
            subtitle: p.subtitle,
            description: p.desc, // 컴포넌트에서 description 사용
            backgroundImg: p.backgroundImg || '',
            posterImg: p.posterImg || '',
            images: Array.isArray(p.images) ? p.images : [],
            benefits: Array.isArray(p.benefits) ? p.benefits : [],
            slug,

            // 상세 페이지용 원본 보존(필요 시 사용)
            schedule: p.schedule, // 있으면 사용
            itinerary: p.itinerary, // 패키지 기준 일정
            flight_info: p.flight_info, // 이동정보
            price: p.price, // 있으면 사용
            _source: 'packages',
        };
    });
}

const normalizedTours = normalizePackagesToTours(packagesData);

const useTourStore = create((set, get) => ({
    // 원본(참조용)
    packages: packagesData,
    reviews: packagesReviewData,

    // UI가 실제로 쓰는 목록은 packages 기준으로 정규화한 tours
    tours: normalizedTours,

    // 기본 제외: 블랙핑크만(기존 호환 id 유지)
    // 기본 제외 없음
    excludedIds: new Set(),

    // UI 상태
    activeCategory: '예능',
    activeIndex: 0,

    // 투어
    currentTour: null,

    activeTab: '시설/서비스',

// 탭을 설정하는 함수
    setActiveTab: (tabName) => set({ activeTab: tabName }),

    // 스크롤 이동을 처리하는 함수
    handleScrollTo: (ref, tabName) => {
        get().setActiveTab(tabName);
        if (ref && ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop - 120, 
                behavior: 'smooth',
            });
        }
    },

    // actions
    setCategory: (cat) => set({ activeCategory: cat, activeIndex: 0 }),
    setIndex: (idx) => set({ activeIndex: idx }),

    // 제외 제어(필요 시 페이지별 override)
    excludeIds: (ids) => set({ excludedIds: new Set(ids) }),
    toggleExclude: (id) => {
        const next = new Set(get().excludedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        set({ excludedIds: next });
    },

    // slug로 투어 데이터 설정
    setCurrentTourBySlug: (slug) => {
        const tour = packagesData.find((pkg) => pkg.slug === slug);
        if (tour) {
            set({ currentTour: tour });
        } else {
            console.warn(`Tour with slug "${slug}" not found`);
            set({ currentTour: null });
        }
    },

    // 현재 투어 초기화
    clearCurrentTour: () => set({ currentTour: null }),

    getTourHighRatedReviews: (tourId, count = 3) => {
        // 3점 이상 리뷰만 필터링
        const highRatedReviews = packagesReviewData.filter((review) => review.rate >= 3);

        // 투어 ID 기반 시드로 고정된 순서
        const seededRandom = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        // 고정된 순서로 섞기
        const shuffledReviews = [...highRatedReviews].sort((a, b) => {
            const seedA = seededRandom(tourId * 300 + a.id); // 투어용 다른 시드
            const seedB = seededRandom(tourId * 300 + b.id);
            return seedA - seedB;
        });

        return shuffledReviews.slice(0, count).map((review, index) => ({
            ...review,
            tourId: tourId,
            uniqueId: `tour-mini-${tourId}-${review.id}-${index}`,
        }));
    },

    
}));

export default useTourStore;

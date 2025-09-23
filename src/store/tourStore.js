import { create } from 'zustand';
import packagesData from '../api/packagesData';
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

// SLUG_TO_CANONICAL_ID
const SLUG_TO_CANONICAL_ID = {
    'younskitchen2-tenerife': 'younskitchen2',
    'harbin-film-tour': 'harbin',
    'seojin-mexico-bacalar': 'seojin',
    'when-life-gives-you-tangerines': 'tangerines',
    'hometown-chachacha-tour': 'hometown-chachacha',
    'blackpink-worldtour-seoul': 'blackpink-concert',
    'bts-yet-to-come-tour': 'bts-yet-to-come',
    'crimecity4-bohol-tour': 'crimecity4', // ✅ 새로 추가
};

// SLUG_TO_TOURID
const SLUG_TO_TOURID = {
    'younskitchen2-tenerife': 1,
    'harbin-film-tour': 2,
    'seojin-mexico-bacalar': 3,
    'when-life-gives-you-tangerines': 4,
    'hometown-chachacha-tour': 5,
    'blackpink-worldtour-seoul': 7,
    'bts-yet-to-come-tour': 8,
    'crimecity4-bohol-tour': 9, // ✅ 새로 추가
};

// packages → 컴포넌트가 쓰는 tours 포맷으로 정규화
function normalizePackagesToTours(packagesArr) {
    return packagesArr.map((p, i) => {
        const slug = p.slug || kebab(p.title);
        const id = SLUG_TO_CANONICAL_ID[slug] || slug;
        const tourId = SLUG_TO_TOURID[slug] || i + 1; // initialTourId 대응용

        return {
            // 컴포넌트(TourMainCon2)가 바로 쓰는 키들
            id,
            tourId,
            category: p.contents,
            title: p.title,
            subtitle: p.subtitle,
            description: p.desc,
            backgroundImg: p.backgroundImg || '',
            posterImg: p.posterImg || '',
            images: Array.isArray(p.images) ? p.images : [],
            benefits: Array.isArray(p.benefits) ? p.benefits : [],
            slug, // ✅ 추가된 필드들

            duration: p.duration || '',
            flight: p.flight || '',
            shopping: p.shopping || '',
            guide_fee: p.guide_fee || '',
            optional: p.optional ?? null, // 상세 페이지용 원본 보존

             adult_fee: p.adult_fee,
            child_fee: p.child_fee,


            schedule: p.schedule,
            itinerary: p.itinerary,
            flight_info: p.flight_info,
            price: p.price,
            _source: 'packages',
        };
    });
}

const normalizedTours = normalizePackagesToTours(packagesData);

const useTourStore = create((set, get) => ({
    // 원본(참조용)
    packages: packagesData,
    reviews: packagesReviewData, // UI가 실제로 쓰는 목록은 packages 기준으로 정규화한 tours

    tours: normalizedTours, // 기본 제외 없음

    excludedIds: new Set(), // UI 상태

    activeCategory: '예능',
    activeIndex: 0, // 투어

    currentTour: null,

    activeTab: '시설/서비스',

    // 탭을 설정하는 함수
    setActiveTab: (tabName) => set({ activeTab: tabName }), // 스크롤 이동을 처리하는 함수

    handleScrollTo: (ref, tabName) => {
        get().setActiveTab(tabName);
        if (ref && ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop - 120,
                behavior: 'smooth',
            });
        }
    }, // actions

    setCategory: (cat) => set({ activeCategory: cat, activeIndex: 0 }),
    setIndex: (idx) => set({ activeIndex: idx }), // 제외 제어

    excludeIds: (ids) => set({ excludedIds: new Set(ids) }),
    toggleExclude: (id) => {
        const next = new Set(get().excludedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        set({ excludedIds: next });
    }, // slug로 투어 데이터 설정

    setCurrentTourBySlug: (slug) => {
        const tour = get().tours.find((pkg) => pkg.slug === slug);
        if (tour) {
            set({ currentTour: tour });
        } else {
            console.warn(`Tour with slug "${slug}" not found`);
            set({ currentTour: null });
        }
    }, // 현재 투어 초기화

    clearCurrentTour: () => set({ currentTour: null }),

    getTourHighRatedReviews: (tourId, count = 3) => {
        // 3점 이상 리뷰만 필터링
        const highRatedReviews = packagesReviewData.filter((review) => review.rate >= 3); // 투어 ID 기반 시드로 고정된 순서

        const seededRandom = (seed) => {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }; // 고정된 순서로 섞기

        const shuffledReviews = [...highRatedReviews].sort((a, b) => {
            const seedA = seededRandom(tourId * 300 + a.id);
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

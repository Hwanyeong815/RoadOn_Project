// src/store/reserveStore.js
import { create } from 'zustand';
import hotelsListData from '../api/hotelsListData';
import airportListData from '../api/airportListData';
import packagesData from '../api/packagesData';

const STORAGE_KEY = 'app:reserve_v1';

// --- 개발용 시드(샘플) 데이터: 예약 항목 예시 ---
// 항공(flight) 3개, 패키지(package) 3개, 투어(tour) 3개
const SAMPLE_RESERVATIONS = [
    // --- hotels (숙소) ---
    {
        uid: 'res-hotel-001',
        reservationId: 'HOTEL-20250901-001',
        type: 'hotel',
        id: 'hotel-seoul-001',
        status: 'ready',
        createdAt: '2025-09-01T08:00:00.000Z',
        totalAmount: 180000,
        guests: { adult: 2, child: 0 },
        startDate: '2025-09-20',
        endDate: '2025-09-21',
        data: {
            name: '서울 그랜드 호텔',
            location: '서울특별시 중구',
            roomType: '더블룸',
            nights: 1,
        },
        isUsed: false,
    },
    {
        uid: 'res-hotel-002',
        reservationId: 'HOTEL-20250815-002',
        type: 'hotel',
        id: 'hotel-jeju-007',
        status: 'completed',
        createdAt: '2025-08-15T10:30:00.000Z',
        totalAmount: 95000,
        guests: { adult: 1, child: 0 },
        startDate: '2025-08-20',
        endDate: '2025-08-21',
        data: {
            name: '제주 바다뷰 게스트하우스',
            location: '제주특별자치도 서귀포시',
            roomType: '싱글',
            nights: 1,
        },
        isUsed: true,
    },
    {
        uid: 'res-hotel-003',
        reservationId: 'HOTEL-20250905-003',
        type: 'hotel',
        id: 'hotel-bangkok-01',
        status: 'ready',
        createdAt: '2025-09-05T09:00:00.000Z',
        totalAmount: 1350000,
        guests: { adult: 2, child: 1 },
        startDate: '2025-10-01',
        endDate: '2025-10-04',
        data: {
            name: 'Bangkok Luxury Hotel',
            location: 'Bangkok, Thailand',
            roomType: 'Family Suite',
            nights: 3,
        },
        isUsed: false,
    },

    // --- flights (항공) ---
    {
        uid: 'res-flight-001',
        reservationId: 'FLIGHT-20250901-001',
        type: 'flight',
        id: 101,
        status: 'ready',
        createdAt: '2025-09-01T09:10:00.000Z',
        totalAmount: 151468,
        guests: { adult: 1, child: 0 },
        startDate: '2025-09-10',
        endDate: '2025-09-10',
        data: null,
        isUsed: false,
    },
    {
        uid: 'res-flight-002',
        reservationId: 'FLIGHT-20250902-002',
        type: 'flight',
        id: 202,
        status: 'ready',
        createdAt: '2025-09-02T11:20:00.000Z',
        totalAmount: 220300,
        guests: { adult: 2, child: 0 },
        startDate: '2025-10-05',
        endDate: '2025-10-05',
        data: null,
        isUsed: false,
    },
    {
        uid: 'res-flight-003',
        reservationId: 'FLIGHT-20250903-003',
        type: 'flight',
        id: 'icn-sfo-01',
        status: 'completed',
        createdAt: '2025-08-15T08:00:00.000Z',
        totalAmount: 980000,
        guests: { adult: 1, child: 0 },
        startDate: '2025-09-15',
        endDate: '2025-09-15',
        data: null,
        isUsed: true,
    },

    // --- packages (패키지) ---
    {
        uid: 'res-package-001',
        reservationId: 'PKG-20250903-001',
        type: 'package',
        id: 'hometown-chachacha-tour',
        status: 'ready',
        createdAt: '2025-09-03T10:00:00.000Z',
        totalAmount: 999900,
        guests: { adult: 2, child: 1 },
        startDate: '2025-09-07',
        endDate: '2025-09-10',
        data: null,
        isUsed: false,
    },
    {
        uid: 'res-package-002',
        reservationId: 'PKG-20250820-002',
        type: 'package',
        id: 'autumn-korea-2n3d',
        status: 'completed',
        createdAt: '2025-08-20T12:00:00.000Z',
        totalAmount: 450000,
        guests: { adult: 2, child: 0 },
        startDate: '2025-09-01',
        endDate: '2025-09-03',
        data: null,
        isUsed: true,
    },
    {
        uid: 'res-package-003',
        reservationId: 'PKG-20250715-003',
        type: 'package',
        id: 'mountain-healing-4d',
        status: 'cancelled',
        createdAt: '2025-07-15T14:30:00.000Z',
        totalAmount: 760000,
        guests: { adult: 3, child: 0 },
        startDate: '2025-08-20',
        endDate: '2025-08-23',
        data: null,
        isUsed: true,
    },

    // --- tours (투어) ---
    {
        uid: 'res-tour-001',
        reservationId: 'TOUR-20250905-001',
        type: 'tour',
        id: 'younskitchen2-tenerife',
        status: 'ready',
        createdAt: '2025-09-05T09:00:00.000Z',
        totalAmount: 490000,
        guests: { adult: 2, child: 0 },
        startDate: '2025-10-12',
        endDate: '2025-10-15',
        data: null,
        isUsed: false,
    },
    {
        uid: 'res-tour-002',
        reservationId: 'TOUR-20250906-002',
        type: 'tour',
        id: 'kyoto-culture-3d',
        status: 'ready',
        createdAt: '2025-09-06T13:15:00.000Z',
        totalAmount: 320000,
        guests: { adult: 1, child: 0 },
        startDate: '2025-11-01',
        endDate: '2025-11-03',
        data: null,
        isUsed: false,
    },
    {
        uid: 'res-tour-003',
        reservationId: 'TOUR-20250810-003',
        type: 'tour',
        id: 'island-daytrip-jeju',
        status: 'completed',
        createdAt: '2025-08-10T07:40:00.000Z',
        totalAmount: 120000,
        guests: { adult: 2, child: 1 },
        startDate: '2025-08-15',
        endDate: '2025-08-15',
        data: null,
        isUsed: true,
    },
];

// load/save
const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            // 개발용 시드 반환 (운영 시에는 빈 배열([])로 바꾸세요.)
            return SAMPLE_RESERVATIONS.map((it) => {
                const uid = it.uid || `${it.type}-${it.id}`;
                return { ...it, uid };
            });
        }
        return JSON.parse(raw);
    } catch (e) {
        console.warn('reserveStore load error', e);
        return SAMPLE_RESERVATIONS;
    }
};

const saveToStorage = (items) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.warn('reserveStore save error', e);
    }
};

// helpers: find product by id/slug
const findHotel = (idOrSlug) => {
    if (idOrSlug == null) return null;
    const asNum = Number(idOrSlug);
    if (!Number.isNaN(asNum)) {
        const byId = hotelsListData.find((h) => Number(h.id) === asNum);
        if (byId) return byId;
    }
    return hotelsListData.find((h) => h.slug === idOrSlug || String(h.id) === String(idOrSlug));
};

const findFlight = (id) => {
    if (id == null) return null;
    const asNum = Number(id);
    if (!Number.isNaN(asNum)) {
        return airportListData.find((f) => Number(f.id) === asNum);
    }
    return airportListData.find((f) => f.slug === id || String(f.id) === String(id));
};

const findPackage = (idOrSlug) => {
    if (idOrSlug == null) return null;
    const asNum = Number(idOrSlug);
    if (!Number.isNaN(asNum)) {
        const byId = packagesData.find((p) => Number(p.id) === asNum);
        if (byId) return byId;
    }
    return packagesData.find((p) => p.slug === idOrSlug || String(p.id) === String(idOrSlug));
};

// ---------- 사용여부 추론 유틸 ----------
// YYYY-MM-DD -> Date at end of day (local)
const parseDateEndOfDay = (ymd) => {
    if (!ymd) return null;
    const parts = String(ymd).split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map((p) => Number(p));
    // monthIndex is 0-based
    return new Date(y, m - 1, d, 23, 59, 59, 999);
};

// 단순 추론: status==='completed' 이면 사용 완료,
// 아니면 endDate가 오늘 이전이면 사용 완료
const inferIsUsed = (item) => {
    try {
        if (!item) return false;
        if (item.status === 'completed') return true;
        const end = parseDateEndOfDay(item.endDate);
        if (!end) return false;
        return end.getTime() < Date.now();
    } catch (e) {
        return false;
    }
};

// hydrate: merge item -> itemDetailed (data filled) AND compute isUsed
const hydrateReservationsDetailed = (items) =>
    items.map((it) => {
        const type = (it.type || '').toString().toLowerCase();
        let data = it.data ?? null;

        try {
            if (!data) {
                if (type === 'hotel') {
                    data = findHotel(it.id) || null;
                } else if (type === 'flight' || type === 'air' || type === 'airport') {
                    data = findFlight(it.id) || null;
                } else if (type === 'package' || type === 'tour') {
                    data = findPackage(it.id) || null;
                }
            }
        } catch (e) {
            console.warn('hydrateReservationsDetailed error for item', it, e);
        }

        const uid = it.uid || `${type}-${it.id}` || `${it.reservationId || Date.now()}`;
        // isUsed: explicit 필드가 있으면 우선 사용, 없으면 자동 추론
        const isUsed = typeof it.isUsed === 'boolean' ? it.isUsed : inferIsUsed(it);

        return { ...it, uid, type, data, isUsed };
    });

const useReserveStore = create((set, get) => {
    const initialItems = loadFromStorage();
    const initialDetailed = hydrateReservationsDetailed(initialItems);

    return {
        // raw reservations
        items: initialItems,
        // hydrated reservations (with product data merged)
        itemsDetailed: initialDetailed,

        // 원본 참조 데이터
        hotels: hotelsListData,
        airports: airportListData,
        packages: packagesData,

        // 편의 조회
        getByReservationId: (reservationId) =>
            (get().itemsDetailed || []).find((r) => r.reservationId === reservationId),
        getByUid: (uid) => (get().itemsDetailed || []).find((r) => r.uid === uid),
        getByType: (type) =>
            (get().itemsDetailed || []).filter(
                (r) => (r.type || '').toString().toLowerCase() === String(type).toLowerCase()
            ),

        // actions
        addReservation: (reservation) => {
            const type = (reservation.type || '').toString().toLowerCase();
            const id = reservation.id;
            const uid =
                reservation.uid || reservation.reservationId || `${type}-${id}-${Date.now()}`;
            const exists = get().items.some(
                (it) => it.uid === uid || it.reservationId === reservation.reservationId
            );
            if (exists) return;
            const next = [...get().items, { ...reservation, uid }];
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        removeReservation: (reservationIdOrUid) => {
            const next = get().items.filter(
                (it) => it.uid !== reservationIdOrUid && it.reservationId !== reservationIdOrUid
            );
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        updateReservation: (reservationIdOrUid, patch) => {
            const next = get().items.map((it) => {
                if (it.uid === reservationIdOrUid || it.reservationId === reservationIdOrUid) {
                    return { ...it, ...patch };
                }
                return it;
            });
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        changeStatus: (reservationIdOrUid, status) => {
            const next = get().items.map((it) => {
                if (it.uid === reservationIdOrUid || it.reservationId === reservationIdOrUid) {
                    return {
                        ...it,
                        status,
                        isUsed:
                            typeof it.isUsed === 'boolean'
                                ? it.isUsed
                                : inferIsUsed({ ...it, status }),
                    };
                }
                return it;
            });
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        // 새로 추가: 수동으로 사용 상태 설정 (예: 체크인 처리)
        markAsUsed: (reservationIdOrUid, used = true) => {
            const next = get().items.map((it) => {
                if (it.uid === reservationIdOrUid || it.reservationId === reservationIdOrUid) {
                    return { ...it, isUsed: !!used };
                }
                return it;
            });
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        isReserved: (reservationIdOrUid) =>
            get().items.some(
                (it) => it.uid === reservationIdOrUid || it.reservationId === reservationIdOrUid
            ),

        getCount: () => (get().items || []).length,

        // 조회 + 페이징 유틸 (간단)
        listPaged: (page = 1, pageSize = 10, type = null) => {
            const all = get().itemsDetailed || [];
            const filtered = type ? all.filter((r) => r.type === type) : all;
            const start = (page - 1) * pageSize;
            return {
                total: filtered.length,
                page,
                pageSize,
                items: filtered.slice(start, start + pageSize),
            };
        },

        clearAll: () => {
            set({ items: [], itemsDetailed: [] });
            saveToStorage([]);
        },

        resetToSeed: () => {
            const seed = SAMPLE_RESERVATIONS.map((it) => {
                const uid = it.uid || `${it.type}-${it.id}`;
                const type = (it.type || '').toString().toLowerCase();
                return { ...it, uid, type };
            });
            set({ items: seed, itemsDetailed: hydrateReservationsDetailed(seed) });
            saveToStorage(seed);
        },

        refreshDetailed: () => {
            const cur = get().items || [];
            set({ itemsDetailed: hydrateReservationsDetailed(cur) });
        },
    };
});

export default useReserveStore;

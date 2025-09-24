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
// 🔧 helper
const _slugify = (s) =>
    String(s || '')
        .trim()
        .toLowerCase()
        .replace(/[ _./]+/g, '-') // 구분자 통일
        .replace(/-+/g, '-');

// 결제에서 들어온 임시 키 정리 (ex: "hotel_1758..._dvwxpk숙소")
const _candidatesFromRaw = (raw) => {
    const s = String(raw || '');
    const cleaned = s
        .replace(/숙소$/g, '') // 한국어 접미사 제거
        .replace(/^hotels?[_-]?/i, '') // prefix 제거
        .replace(/[_-][a-z0-9]{4,}$/i, ''); // 랜덤토큰 제거
    const cand = [s, cleaned, _slugify(cleaned), _slugify(s)].filter(Boolean);
    return Array.from(new Set(cand));
};

// ✅ 관대한 매칭: 숫자 id → slug → (한글/영문)정확 → 부분 포함
const findHotel = (idOrSlugOrName) => {
    if (!idOrSlugOrName) return null;

    // 1) 숫자 id
    const asNum = Number(idOrSlugOrName);
    if (!Number.isNaN(asNum)) {
        const byId = hotelsListData.find((h) => Number(h.id) === asNum);
        if (byId) return byId;
    }

    const cands = _candidatesFromRaw(idOrSlugOrName);
    const candsLc = cands.map((x) => String(x).toLowerCase());

    // 2) slug 정확 매칭
    let found = hotelsListData.find((h) => candsLc.includes(String(h.slug).toLowerCase()));
    if (found) return found;

    // 3) (한글/영문) 이름 정확 매칭
    found = hotelsListData.find(
        (h) =>
            candsLc.includes(String(h.name).toLowerCase()) ||
            candsLc.includes(String(h.engName).toLowerCase())
    );
    if (found) return found;

    // 4) 느슨한 포함 매칭 (slug/이름에 포함)
    found = hotelsListData.find((h) => {
        const n = String(h.name || '').toLowerCase();
        const e = String(h.engName || '').toLowerCase();
        const sg = String(h.slug || '').toLowerCase();
        return candsLc.some((c) => n.includes(c) || e.includes(c) || sg.includes(c));
    });

    return found || null;
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
            // uid는 가능한 한 안정적으로(동일 예약에 동일 uid 유지)
            const fallbackUid = `${type}-${id || 'unknown'}`;
            const uid = reservation.uid || reservation.reservationId || fallbackUid;
            const rid = reservation.reservationId || '';

            // 기존 아이템 인덱스 찾기: reservationId 우선, 없으면 uid
            const items = get().items || [];
            const idx = items.findIndex(
                (it) =>
                    (rid && it.reservationId === rid) ||
                    (!rid && (it.uid === uid || it.uid === fallbackUid))
            );

            let next;
            if (idx >= 0) {
                // ✅ 업서트: 기존 레코드와 병합 (새로 들어온 필드 우선)
                const merged = { ...items[idx], ...reservation, uid: items[idx].uid || uid };
                next = [...items];
                next[idx] = merged;
            } else {
                // 신규 추가
                next = [...items, { ...reservation, uid }];
            }

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
        updatePayment: (reservationIdOrUid, paymentPatch) => {
            const next = (get().items || []).map((it) => {
                if (it.reservationId === reservationIdOrUid || it.uid === reservationIdOrUid) {
                    const prevPay = it.payment || {};
                    return { ...it, payment: { ...prevPay, ...paymentPatch } };
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

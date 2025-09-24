// src/store/reserveStore.js
import { create } from 'zustand';
import hotelsListData from '../api/hotelsListData';
import airportListData from '../api/airportListData';
import packagesData from '../api/packagesData';

const STORAGE_KEY = 'app:reserve_v1';

// --- 개발용 시드(샘플) 데이터 ---
const SAMPLE_RESERVATIONS = [
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
const _slugify = (s) =>
    String(s || '')
        .trim()
        .toLowerCase()
        .replace(/[ _./]+/g, '-')
        .replace(/-+/g, '-');

const _candidatesFromRaw = (raw) => {
    const s = String(raw || '');
    const cleaned = s
        .replace(/숙소$/g, '')
        .replace(/^hotels?[_-]?/i, '')
        .replace(/[_-][a-z0-9]{4,}$/i, '');
    const cand = [s, cleaned, _slugify(cleaned), _slugify(s)].filter(Boolean);
    return Array.from(new Set(cand));
};

const findHotel = (idOrSlugOrName) => {
    if (!idOrSlugOrName) return null;
    const asNum = Number(idOrSlugOrName);
    if (!Number.isNaN(asNum)) {
        const byId = hotelsListData.find((h) => Number(h.id) === asNum);
        if (byId) return byId;
    }
    const cands = _candidatesFromRaw(idOrSlugOrName);
    const candsLc = cands.map((x) => String(x).toLowerCase());

    let found = hotelsListData.find((h) => candsLc.includes(String(h.slug).toLowerCase()));
    if (found) return found;

    found = hotelsListData.find(
        (h) =>
            candsLc.includes(String(h.name).toLowerCase()) ||
            candsLc.includes(String(h.engName).toLowerCase())
    );
    if (found) return found;

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

// ---------- 사용여부 추론 ----------
const parseDateEndOfDay = (ymd) => {
    if (!ymd) return null;
    const parts = String(ymd).split('-');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map((p) => Number(p));
    return new Date(y, m - 1, d, 23, 59, 59, 999);
};

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

const hydrateReservationsDetailed = (items) =>
    (items || []).map((it) => {
        const type = (it.type || '').toString().toLowerCase();
        let data = it.data ?? null;

        try {
            if (!data) {
                if (type === 'hotel') data = findHotel(it.id) || null;
                else if (type === 'flight' || type === 'air' || type === 'airport')
                    data = findFlight(it.id) || null;
                else if (type === 'package' || type === 'tour') data = findPackage(it.id) || null;
            }
        } catch (e) {
            console.warn('hydrateReservationsDetailed error for item', it, e);
        }

        const uid = it.uid || `${type}-${it.id}` || `${it.reservationId || Date.now()}`;
        const isUsed = typeof it.isUsed === 'boolean' ? it.isUsed : inferIsUsed(it);

        return { ...it, uid, type, data, isUsed };
    });

const useReserveStore = create((set, get) => {
    const initialItems = loadFromStorage();
    const initialDetailed = hydrateReservationsDetailed(initialItems);

    return {
        // raw
        items: initialItems,
        // hydrated
        itemsDetailed: initialDetailed,

        // refs
        hotels: hotelsListData,
        airports: airportListData,
        packages: packagesData,

        // selectors
        getByReservationId: (reservationId) =>
            (get().itemsDetailed || []).find((r) => r.reservationId === reservationId),

        getByOrderId: (orderId) =>
            (get().itemsDetailed || []).find((r) => r?.payment?.orderId === String(orderId)),

        getByUid: (uid) => (get().itemsDetailed || []).find((r) => r.uid === uid),

        getByType: (type) =>
            (get().itemsDetailed || []).filter(
                (r) => (r.type || '').toString().toLowerCase() === String(type).toLowerCase()
            ),

        // actions
        // ✅ 업서트(있으면 merge, 없으면 추가)
        addReservation: (reservation) => {
            const type = (reservation.type || '').toString().toLowerCase();
            const id = reservation.id;
            const fallbackUid = `${type}-${id || 'unknown'}`;
            const uid = reservation.uid || reservation.reservationId || fallbackUid;
            const rid = reservation.reservationId || '';

            const items = get().items || [];
            const idx = items.findIndex(
                (it) =>
                    (rid && it.reservationId === rid) ||
                    (!rid && (it.uid === uid || it.uid === fallbackUid))
            );

            let next;
            if (idx >= 0) {
                const merged = { ...items[idx], ...reservation, uid: items[idx].uid || uid };
                next = [...items];
                next[idx] = merged;
            } else {
                next = [...items, { ...reservation, uid }];
            }

            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        // ✅ 결제 정보만 갱신
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

        removeReservation: (reservationIdOrUid) => {
            const next = (get().items || []).filter(
                (it) => it.uid !== reservationIdOrUid && it.reservationId !== reservationIdOrUid
            );
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        updateReservation: (reservationIdOrUid, patch) => {
            const next = (get().items || []).map((it) => {
                if (it.uid === reservationIdOrUid || it.reservationId === reservationIdOrUid) {
                    return { ...it, ...patch };
                }
                return it;
            });
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        changeStatus: (reservationIdOrUid, status) => {
            const next = (get().items || []).map((it) => {
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

        markAsUsed: (reservationIdOrUid, used = true) => {
            const next = (get().items || []).map((it) => {
                if (it.uid === reservationIdOrUid || it.reservationId === reservationIdOrUid) {
                    return { ...it, isUsed: !!used };
                }
                return it;
            });
            set({ items: next, itemsDetailed: hydrateReservationsDetailed(next) });
            saveToStorage(next);
        },

        isReserved: (reservationIdOrUid) =>
            (get().items || []).some(
                (it) => it.uid === reservationIdOrUid || it.reservationId === reservationIdOrUid
            ),

        getCount: () => (get().items || []).length,

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

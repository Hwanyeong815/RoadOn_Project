// src/store/wishStore.js
import { create } from 'zustand';
import hotelsListData from '../api/hotelsListData';
import airportListData from '../api/airportListData';
import packagesData from '../api/packagesData';

const STORAGE_KEY = 'app:wishlist_v1';

// --- 개발용 샘플 데이터 ---
const SAMPLE_ITEMS = [
    {
        uid: 'hotel-2',
        type: 'hotel',
        id: 2,
        data: {
            name: '세인트존스 호텔',
            location: '서울 중구',
            price: 310000,
            slug: 'saint-johns-hotel',
        },
    },
    {
        uid: 'hotel-16',
        type: 'hotel',
        id: 16,
        data: {
            name: '만다린 오리엔탈 방콕',
            location: '태국 방콕',
            price: 480000,
            slug: 'mandarin-oriental-bangkok',
        },
    },

    {
        uid: 'tour-younskitchen2-tenerife',
        type: 'tour',
        id: 'younskitchen2-tenerife', // slug 기반 id
        data: {
            title: '윤식당 스페인 투어',
            subtitle: '스페인 가라치코 3박 4일',
            duration: '3박 4일',
            adult_fee: 490000,
            desc: "tvN 예능 '윤식당' 촬영지 투어 - 맛과 풍경을 함께 즐기는 여행",
            slug: 'younskitchen2-tenerife',
        },
    },
];

const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return SAMPLE_ITEMS.map((it) => {
                const uid = it.uid || `${it.type}-${it.id ?? it.slug}`;
                return { ...it, uid };
            });
        }
        return JSON.parse(raw);
    } catch (e) {
        console.warn('wishStore load error', e);
        return SAMPLE_ITEMS;
    }
};

const saveToStorage = (items) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.warn('wishStore save error', e);
    }
};

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

const hydrateItemsDetailed = (items) => {
    return items.map((it) => {
        const type = (it.type || '').toString().toLowerCase();
        let data = it.data ?? null;

        try {
            if (!data) {
                if (type === 'hotel') {
                    data = findHotel(it.id ?? it.slug) || null;
                } else if (type === 'flight' || type === 'air' || type === 'airport') {
                    data = findFlight(it.id ?? it.slug) || null;
                } else if (type === 'package' || type === 'tour') {
                    data = findPackage(it.id ?? it.slug) || null;
                }
            }
        } catch (e) {
            console.warn('hydrateItemsDetailed error for item', it, e);
        }

        const uid = it.uid || `${type}-${it.id ?? it.slug}`;
        return { ...it, uid, type, data };
    });
};

const useWishStore = create((set, get) => {
    const initialItems = loadFromStorage();
    const initialItemsDetailed = hydrateItemsDetailed(initialItems);

    return {
        items: initialItems,
        itemsDetailed: initialItemsDetailed,

        hotels: hotelsListData,
        airports: airportListData,
        packages: packagesData,

        getHotelById: (idOrSlug) => findHotel(idOrSlug),
        getAirportById: (id) => findFlight(id),
        getPackageById: (idOrSlug) => findPackage(idOrSlug),

        add: (item) => {
            const type = (item.type || '').toString().toLowerCase();
            const id = item.id ?? item.slug;
            const uid = item.uid || `${type}-${id}`;
            const exists = get().items.some(
                (it) =>
                    it.uid === uid || (it.type === type && String(it.id ?? it.slug) === String(id))
            );
            if (exists) return;
            const next = [...get().items, { uid, type, id, data: item.data ?? null }];
            set({ items: next, itemsDetailed: hydrateItemsDetailed(next) });
            saveToStorage(next);
        },

        remove: (type, idOrSlug) => {
            const t = (type || '').toString().toLowerCase();
            const id = idOrSlug;
            const uid = `${t}-${id}`;
            const next = get().items.filter(
                (it) =>
                    it.uid !== uid && !(it.type === t && String(it.id ?? it.slug) === String(id))
            );
            set({ items: next, itemsDetailed: hydrateItemsDetailed(next) });
            saveToStorage(next);
        },

        toggle: (item) => {
            const type = (item.type || '').toString().toLowerCase();
            const id = item.id ?? item.slug;
            const uid = item.uid || `${type}-${id}`;
            const exists = get().items.some(
                (it) =>
                    it.uid === uid || (it.type === type && String(it.id ?? it.slug) === String(id))
            );
            if (exists) {
                const next = get().items.filter(
                    (it) =>
                        !(
                            it.uid === uid ||
                            (it.type === type && String(it.id ?? it.slug) === String(id))
                        )
                );
                set({ items: next, itemsDetailed: hydrateItemsDetailed(next) });
                saveToStorage(next);
            } else {
                const next = [...get().items, { uid, type, id, data: item.data ?? null }];
                set({ items: next, itemsDetailed: hydrateItemsDetailed(next) });
                saveToStorage(next);
            }
        },

        isSaved: (type, idOrSlug) => {
            const t = (type || '').toString().toLowerCase();
            const id = idOrSlug;
            return get().items.some(
                (it) =>
                    (it.type === t && String(it.id ?? it.slug) === String(id)) ||
                    it.uid === `${t}-${id}`
            );
        },
    };
});

export default useWishStore;

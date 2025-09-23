// src/store/wishStore.js
import { create } from 'zustand';
import hotelsListData from '../api/hotelsListData';
import airportListData from '../api/airportListData';
import packagesData from '../api/packagesData';
import useAuthStore from './authStore'; // ✅ 계정 연동

const STORAGE_KEY = 'app:wishlist_v1';
/*
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
        id: 'younskitchen2-tenerife',
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
*/

// === 🧠 유저별 키 네임스페이스 ===
const getCurrentUID = () => useAuthStore.getState().currentUser?.id || 'guest';
const keyFor = (uid) => `${STORAGE_KEY}:${uid || 'guest'}`;

// === Storage I/O ===
const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return []; // ✅ 스토리지 없으면 빈 배열
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : []; // ✅ 형식 방어
    } catch (e) {
        console.warn('wishStore load error', e);
        return []; // ✅ 파싱 실패도 빈 배열
    }
};

const saveToStorage = (uid, items) => {
    const key = keyFor(uid);
    try {
        localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
        console.warn('wishStore save error', e);
    }
};

// === Lookups ===
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
    if (!Number.isNaN(asNum)) return airportListData.find((f) => Number(f.id) === asNum);
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

const hydrateItemsDetailed = (items) =>
    items.map((it) => {
        const type = (it.type || '').toString().toLowerCase();
        let data = it.data ?? null;
        try {
            if (!data) {
                if (type === 'hotel') data = findHotel(it.id ?? it.slug) || null;
                else if (type === 'flight' || type === 'air' || type === 'airport')
                    data = findFlight(it.id ?? it.slug) || null;
                else if (type === 'package' || type === 'tour')
                    data = findPackage(it.id ?? it.slug) || null;
            }
        } catch (e) {
            console.warn('hydrateItemsDetailed error for item', it, e);
        }
        const uid = it.uid || `${type}-${it.id ?? it.slug}`;
        return { ...it, uid, type, data };
    });

// === 🧮 선택사항: 유저의 wishlistCount 동기화(프로필 뱃지 등) ===
const syncWishlistCount = (uid, count) => {
    const auth = useAuthStore.getState();
    const user = auth.users.find((u) => u.id === uid);
    if (user && typeof auth.updateUser === 'function')
        auth.updateUser(uid, { wishlistCount: count });
};

const useWishStore = create((set, get) => {
    const bootUID = getCurrentUID();
    const initialItems = loadFromStorage(bootUID);
    const initialItemsDetailed = hydrateItemsDetailed(initialItems);

    return {
        // state
        items: initialItems,
        itemsDetailed: initialItemsDetailed,

        hotels: hotelsListData,
        airports: airportListData,
        packages: packagesData,

        // selectors
        getHotelById: (idOrSlug) => findHotel(idOrSlug),
        getAirportById: (id) => findFlight(id),
        getPackageById: (idOrSlug) => findPackage(idOrSlug),

        // actions
        add: (item) => {
            const uidOwner = getCurrentUID();
            const type = (item.type || '').toString().toLowerCase();
            const id = item.id ?? item.slug;
            const uid = item.uid || `${type}-${id}`;
            const exists = get().items.some(
                (it) =>
                    it.uid === uid || (it.type === type && String(it.id ?? it.slug) === String(id))
            );
            if (exists) return;

            const next = [...get().items, { uid, type, id, data: item.data ?? null }];
            const nextDetailed = hydrateItemsDetailed(next);
            set({ items: next, itemsDetailed: nextDetailed });
            saveToStorage(uidOwner, next);
            syncWishlistCount(uidOwner, next.length);
        },

        remove: (type, idOrSlug) => {
            const uidOwner = getCurrentUID();
            const t = (type || '').toString().toLowerCase();
            const id = idOrSlug;
            const uid = `${t}-${id}`;
            const next = get().items.filter(
                (it) =>
                    it.uid !== uid && !(it.type === t && String(it.id ?? it.slug) === String(id))
            );
            const nextDetailed = hydrateItemsDetailed(next);
            set({ items: next, itemsDetailed: nextDetailed });
            saveToStorage(uidOwner, next);
            syncWishlistCount(uidOwner, next.length);
        },

        toggle: (item) => {
            const uidOwner = getCurrentUID();
            const type = (item.type || '').toString().toLowerCase();
            const id = item.id ?? item.slug;
            const uid = item.uid || `${type}-${id}`;
            const exists = get().items.some(
                (it) =>
                    it.uid === uid || (it.type === type && String(it.id ?? it.slug) === String(id))
            );

            let next;
            if (exists) {
                next = get().items.filter(
                    (it) =>
                        !(
                            it.uid === uid ||
                            (it.type === type && String(it.id ?? it.slug) === String(id))
                        )
                );
            } else {
                next = [...get().items, { uid, type, id, data: item.data ?? null }];
            }
            const nextDetailed = hydrateItemsDetailed(next);
            set({ items: next, itemsDetailed: nextDetailed });
            saveToStorage(uidOwner, next);
            syncWishlistCount(uidOwner, next.length);
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

// === 🔄 계정 전환/로그아웃 시 자동 재하이드레이트 ===
const rehydrateForUser = (uid) => {
    const items = loadFromStorage(uid);
    useWishStore.setState({
        items,
        itemsDetailed: hydrateItemsDetailed(items),
    });
    if (uid) syncWishlistCount(uid, items.length);
};

useAuthStore.subscribe(
    (s) => s.currentUser?.id, // 바뀐 값 추적
    (uid) => rehydrateForUser(uid) // uid 변경 시 위시리스트 교체
);

export default useWishStore;

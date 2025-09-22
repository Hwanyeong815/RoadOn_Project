// src/store/rewardStore.js
import { create } from 'zustand';

/** 테스트용 쿠폰 풀 (API 미사용) */
const TEST_COUPON_POOL = [
    {
        id: 1,
        className: 'c-tour',
        label: '투어쿠폰',
        amount: 10000,
        condition: '3만원 이상 투어 예약 시',
        period: '2025-09-01 ~ 2025-09-10',
        disabled: false,
    },
    {
        id: 2,
        className: 'c-tour',
        label: '투어쿠폰',
        amount: 15000,
        condition: '5만원 이상 투어 결제 시',
        period: '2025-09-05 ~ 2025-09-15',
        disabled: true,
    },
    {
        id: 3,
        className: 'c-tour',
        label: '투어쿠폰',
        amount: 20000,
        condition: '7만원 이상 투어 예약 시',
        period: '2025-09-10 ~ 2025-09-20',
        disabled: false,
    },
    {
        id: 4,
        className: 'c-tour',
        label: '투어쿠폰',
        amount: 30000,
        condition: '10만원 이상 투어 결제 시',
        period: '2025-09-12 ~ 2025-09-25',
        disabled: false,
    },
    {
        id: 5,
        className: 'c-tour',
        label: '투어쿠폰',
        amount: 5000,
        condition: '1만원 이상 투어 예약 시',
        period: '2025-09-15 ~ 2025-09-30',
        disabled: true,
    },
    {
        id: 6,
        className: 'c-hotel',
        label: '숙소쿠폰',
        amount: 20000,
        condition: '7만원 이상 숙소 예약 시',
        period: '2025-09-01 ~ 2025-09-12',
        disabled: false,
    },
    {
        id: 7,
        className: 'c-hotel',
        label: '숙소쿠폰',
        amount: 30000,
        condition: '10만원 이상 숙소 예약 시',
        period: '2025-09-05 ~ 2025-09-20',
        disabled: true,
    },
    {
        id: 8,
        className: 'c-hotel',
        label: '숙소쿠폰',
        amount: 40000,
        condition: '15만원 이상 숙소 예약 시',
        period: '2025-09-07 ~ 2025-09-25',
        disabled: false,
    },
    {
        id: 9,
        className: 'c-hotel',
        label: '숙소쿠폰',
        amount: 50000,
        condition: '20만원 이상 숙소 결제 시',
        period: '2025-09-10 ~ 2025-09-30',
        disabled: false,
    },
    {
        id: 10,
        className: 'c-hotel',
        label: '숙소쿠폰',
        amount: 10000,
        condition: '2만원 이상 숙소 예약 시',
        period: '2025-09-15 ~ 2025-09-28',
        disabled: true,
    },
    {
        id: 11,
        className: 'c-tour',
        label: '투어쿠폰',
        amount: 25000,
        condition: '9만원 이상 투어 결제 시',
        period: '2025-09-18 ~ 2025-10-01',
        disabled: false,
    },
    {
        id: 12,
        className: 'c-hotel',
        label: '숙소쿠폰',
        amount: 35000,
        condition: '12만원 이상 숙소 예약 시',
        period: '2025-09-20 ~ 2025-10-05',
        disabled: true,
    },
];

// --- KST(Asia/Seoul) 기준 YYYY-MM-DD ---
const todayKST = () => {
    try {
        return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 10);
    } catch {
        return new Date().toISOString().split('T')[0];
    }
};

// 최초 지급 포인트: 오늘 날짜로 5,000P
const INITIAL_POINT_ITEM = {
    date: todayKST(),
    type: '가입 축하 포인트',
    amount: 5000,
    status: '적립',
};

const createEmptyUserReward = () => ({
    coupons: [],
    points: { userName: '', items: [] },
    claimed: { welcomePack: false },
    flags: { signupGranted: false },
});

// parse period like "2025-09-01 ~ 2025-09-10" -> end Date at KST 23:59:59
const parsePeriodEndDateKST = (periodStr) => {
    if (!periodStr || typeof periodStr !== 'string') return null;
    const m = periodStr.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
    if (!m) return null;
    const [, , endStr] = m;
    const parts = endStr.split('-').map((p) => Number(p));
    if (parts.length !== 3) return null;
    const [y, mm, d] = parts;
    // Return a JS Date representing local time y,mm-1,d 23:59:59.999
    return new Date(y, mm - 1, d, 23, 59, 59, 999);
};

const isCouponExpiredByPeriod = (coupon) => {
    try {
        if (!coupon || !coupon.period) return false;
        const end = parsePeriodEndDateKST(coupon.period);
        if (!end) return false;
        return Date.now() > end.getTime();
    } catch {
        return false;
    }
};

const useRewardStore = create((set, get) => ({
    rewardByUser: {
        u_test_1: {
            coupons: [], // 기본 쿠폰 없음 — 웰컴팩으로 지급
            points: { userName: 'u_test_1', items: [INITIAL_POINT_ITEM] },
            claimed: { welcomePack: false },
            flags: { signupGranted: true }, // 테스트 계정은 이미 가입 보너스 취급
        },
    },

    // --- getters ---
    getCoupons: (userId) => {
        get()._ensureUser(userId);
        // prune expired then return
        get()._pruneExpiredCoupons(userId);
        return get().rewardByUser[userId]?.coupons || [];
    },

    getPoints: (userId) => {
        get()._ensureUser(userId);
        const points = get().rewardByUser[userId]?.points || { userName: '', items: [] };
        const balance = (points.items || []).reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
        return { ...points, balance };
    },

    hasClaimedWelcomePack: (userId) => !!get().rewardByUser[userId]?.claimed?.welcomePack,

    // --- internal utils ---
    _ensureUser: (userId) => {
        const state = get();
        if (!state.rewardByUser[userId]) {
            set((prev) => ({
                rewardByUser: { ...prev.rewardByUser, [userId]: createEmptyUserReward() },
            }));
        }
    },

    // prune expired coupons for a user (removes expired coupons from store)
    _pruneExpiredCoupons: (userId) => {
        if (!userId) return;
        const state = get();
        const userReward = state.rewardByUser[userId];
        if (!userReward || !Array.isArray(userReward.coupons) || userReward.coupons.length === 0)
            return;
        const beforeLen = userReward.coupons.length;
        const alive = userReward.coupons.filter((c) => !isCouponExpiredByPeriod(c));
        if (alive.length !== beforeLen) {
            set((prev) => {
                const prevUser = prev.rewardByUser[userId] || createEmptyUserReward();
                return {
                    rewardByUser: {
                        ...prev.rewardByUser,
                        [userId]: { ...prevUser, coupons: alive },
                    },
                };
            });
        }
    },

    addCoupon: (userId, coupon) => {
        if (!userId || !coupon) return;
        get()._ensureUser(userId);
        // don't add expired coupon
        if (isCouponExpiredByPeriod(coupon)) return;
        set((state) => {
            const userReward = state.rewardByUser[userId] || createEmptyUserReward();
            const exists = (userReward.coupons || []).some(
                (c) => String(c.id) === String(coupon.id)
            );
            if (exists) return { rewardByUser: { ...state.rewardByUser } };
            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: { ...userReward, coupons: [...(userReward.coupons || []), coupon] },
                },
            };
        });
    },

    /**
     * 고정형 웰컴팩: 숙소(c-hotel) N장, 투어(c-tour) M장(기본 3,3)
     * - 정확히 각각 요청한 수량을 확보할 수 있어야 발급(안그러면 실패)
     */
    claimWelcomePackFixed: (userId, hotelCount = 3, tourCount = 3) => {
        if (!userId) return { ok: false, reason: 'invalid-user' };
        get()._ensureUser(userId);

        // prune expired first
        get()._pruneExpiredCoupons(userId);

        const state = get();
        const userReward = state.rewardByUser[userId];

        if (userReward.claimed?.welcomePack) return { ok: false, reason: 'already-claimed' };

        const ownedIds = new Set((userReward.coupons || []).map((c) => String(c.id)));
        const available = TEST_COUPON_POOL.filter(
            (c) => !ownedIds.has(String(c.id)) && !isCouponExpiredByPeriod(c)
        );

        const hotels = available.filter((c) => c.className === 'c-hotel');
        const tours = available.filter((c) => c.className === 'c-tour');

        if (hotels.length < hotelCount || tours.length < tourCount) {
            return {
                ok: false,
                reason: 'insufficient-coupons-for-categories',
                available: { hotels: hotels.length, tours: tours.length },
            };
        }

        const selectedHotels = hotels
            .slice(0, hotelCount)
            .map((c) => ({ ...c, note: 'WELCOME 쿠폰팩', source: 'welcome' }));
        const selectedTours = tours
            .slice(0, tourCount)
            .map((c) => ({ ...c, note: 'WELCOME 쿠폰팩', source: 'welcome' }));

        const pack = [...selectedHotels, ...selectedTours];

        set((prev) => {
            const prevUser = prev.rewardByUser[userId] || createEmptyUserReward();
            const prevCoupons = prevUser.coupons || [];
            const merged = [...prevCoupons, ...pack];
            return {
                rewardByUser: {
                    ...prev.rewardByUser,
                    [userId]: {
                        ...prevUser,
                        coupons: merged,
                        claimed: { ...(prevUser.claimed || {}), welcomePack: true },
                    },
                },
            };
        });

        return { ok: true, added: pack.length, pack };
    },

    // 이전 호환용 웰컴팩
    claimWelcomePack: (userId, count = 5) => {
        if (!userId) return { ok: false, reason: 'invalid-user' };
        get()._ensureUser(userId);

        get()._pruneExpiredCoupons(userId);

        const state = get();
        const userReward = state.rewardByUser[userId];

        if (userReward.claimed?.welcomePack) return { ok: false, reason: 'already-claimed' };

        const ownedIds = new Set((userReward.coupons || []).map((c) => String(c.id)));
        let available = TEST_COUPON_POOL.filter(
            (c) => !ownedIds.has(String(c.id)) && !isCouponExpiredByPeriod(c)
        );

        const pack = available
            .slice(0, count)
            .map((c) => ({ ...c, note: 'WELCOME 쿠폰팩', source: 'welcome' }));
        if (!pack.length) return { ok: false, reason: 'no-coupons-left' };

        set((prev) => {
            const prevUser = prev.rewardByUser[userId] || createEmptyUserReward();
            return {
                rewardByUser: {
                    ...prev.rewardByUser,
                    [userId]: {
                        ...prevUser,
                        coupons: [...(prevUser.coupons || []), ...pack],
                        claimed: { ...(prevUser.claimed || {}), welcomePack: true },
                    },
                },
            };
        });

        return { ok: true, added: pack.length, pack };
    },

    // --- point actions ---
    addPointItem: (userId, item) => {
        if (!userId || !item) return;
        get()._ensureUser(userId);
        set((state) => {
            const userReward = state.rewardByUser[userId];
            const updatedPoints = {
                ...userReward.points,
                items: [item, ...(userReward.points?.items || [])],
            };
            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: { ...userReward, points: updatedPoints },
                },
            };
        });
    },

    useCouponAndAddPoints: (userId, coupon) => {
        if (!userId || !coupon) return {};
        get()._ensureUser(userId);
        set((state) => {
            const rw = state.rewardByUser[userId];
            const coupons = (rw.coupons || []).map((c) =>
                String(c.id) === String(coupon.id) ? { ...c, disabled: true } : c
            );
            const prevPoints = rw.points?.items || [];
            const newPointItem = {
                date: todayKST(),
                type: `${coupon.label || '쿠폰'} 사용 리워드`,
                amount: coupon.amount || 0,
                status: '적립',
            };
            const points = { ...rw.points, items: [newPointItem, ...prevPoints] };
            return {
                rewardByUser: { ...state.rewardByUser, [userId]: { ...rw, coupons, points } },
            };
        });
    },

    // 가입 보너스 + 웰컴팩 (원샷) — 고정형(3,3)으로 호출
    grantSignupBonusAndWelcome: (userId, welcomeHotelCount = 3, welcomeTourCount = 3) => {
        if (!userId) return { ok: false, reason: 'invalid-user' };
        get()._ensureUser(userId);

        const pts = get().getPoints(userId);
        const alreadyToday = pts.items?.some(
            (it) => it.type === '가입 축하 포인트' && it.date === todayKST()
        );
        if (!alreadyToday) {
            get().addPointItem(userId, {
                date: todayKST(),
                type: '가입 축하 포인트',
                amount: 5000,
                status: '적립',
            });
        }

        const res = get().claimWelcomePackFixed(userId, welcomeHotelCount, welcomeTourCount);
        if (!res.ok) {
            return { ok: false, reason: res.reason || 'welcome-failed', welcome: res };
        }
        return { ok: true, welcome: res };
    },

    // 리셋/테스트 유틸
    resetCoupons: (userId) => {
        if (!userId) return;
        get()._ensureUser(userId);
        set((state) => {
            const rw = state.rewardByUser[userId];
            return { rewardByUser: { ...state.rewardByUser, [userId]: { ...rw, coupons: [] } } };
        });
    },

    resetWelcomePackClaim: (userId) => {
        if (!userId) return;
        get()._ensureUser(userId);
        set((state) => {
            const rw = state.rewardByUser[userId];
            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: { ...rw, claimed: { ...(rw.claimed || {}), welcomePack: false } },
                },
            };
        });
    },

    resetRewards: (userId) => {
        if (!userId) return;
        get()._ensureUser(userId);
        set((state) => {
            const rw = state.rewardByUser[userId];
            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: {
                        ...rw,
                        coupons: [],
                        points: { userName: '', items: [] },
                        claimed: { ...(rw.claimed || {}), welcomePack: false },
                    },
                },
            };
        });
    },
}));

export default useRewardStore;

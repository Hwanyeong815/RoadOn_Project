// src/store/rewardStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

/* ===== 날짜 유틸 (KST) ===== */
const toYmd = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
};
const todayKST = () => {
    try {
        return toYmd(new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })));
    } catch {
        return toYmd(new Date());
    }
};
const addDaysYmd = (ymd, days) => {
    const [y, m, d] = ymd.split('-').map(Number);
    const base = new Date(y, m - 1, d);
    base.setDate(base.getDate() + days);
    return toYmd(base);
};
const parseYmd = (s) => {
    const [y, m, d] = String(s || '')
        .split('-')
        .map((n) => +n);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 23, 59, 59, 999);
};
const parsePeriodRange = (period) => {
    const [a, b] = String(period || '')
        .split('~')
        .map((s) => s.trim());
    return { start: parseYmd(a), end: parseYmd(b) };
};
const isCouponActiveToday = (c) => {
    if (!c) return false;
    const now = parseYmd(todayKST());
    // 동적(validFrom/validTo) 우선
    if (c.validFrom || c.validTo) {
        const s = c.validFrom ? parseYmd(c.validFrom) : null;
        const e = c.validTo ? parseYmd(c.validTo) : null;
        if (s && now < s) return false;
        if (e && now > e) return false;
        return true;
    }
    // 기존 period 문자열 fallback
    const { start, end } = parsePeriodRange(c.period);
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
};

/* ===== 최초 지급 포인트(오늘 날짜로 5,000P) ===== */
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

const useRewardStore = create(
    persist(
        (set, get) => ({
            /* 초기 상태 (persist가 있으면 로컬스토리지 값으로 대체됨) */
            rewardByUser: {
                u_test_1: {
                    coupons: [], // 기본 쿠폰 없음 — 웰컴팩으로 지급
                    points: { userName: 'u_test_1', items: [INITIAL_POINT_ITEM] },
                    claimed: { welcomePack: false },
                    flags: { signupGranted: true },
                },
            },

            /* ===== getters ===== */
            getCoupons: (userId) => {
                const list = get().rewardByUser[userId]?.coupons || [];
                // 오늘 기준 사용가능한 쿠폰만 노출
                return list.filter(isCouponActiveToday);
            },
            getPoints: (userId) => {
                const points = get().rewardByUser[userId]?.points || { userName: '', items: [] };
                const balance = (points.items || []).reduce(
                    (sum, it) => sum + (Number(it.amount) || 0),
                    0
                );
                return { ...points, balance };
            },
            hasClaimedWelcomePack: (userId) => !!get().rewardByUser[userId]?.claimed?.welcomePack,

            /* 내부 유틸 */
            _ensureUser: (userId) => {
                const state = get();
                if (!state.rewardByUser[userId]) {
                    set((prev) => ({
                        rewardByUser: { ...prev.rewardByUser, [userId]: createEmptyUserReward() },
                    }));
                }
            },

            /* ===== actions ===== */
            addCoupon: (userId, coupon) => {
                if (!userId || !coupon) return;
                get()._ensureUser(userId);
                set((state) => {
                    const userReward = state.rewardByUser[userId];
                    return {
                        rewardByUser: {
                            ...state.rewardByUser,
                            [userId]: {
                                ...userReward,
                                coupons: [...(userReward.coupons || []), coupon],
                            },
                        },
                    };
                });
            },

            /** 웰컴팩(고정): 숙소 3장 + 투어 3장
             * 지급되는 모든 쿠폰에 유통기한 부여: 오늘 ~ 30일 후
             * (validFrom/validTo/period, grantedAt 필드 주입)
             */
            claimWelcomePackFixed: (userId, hotelCount = 3, tourCount = 3) => {
                if (!userId) return { ok: false, reason: 'invalid-user' };
                get()._ensureUser(userId);

                const state = get();
                const userReward = state.rewardByUser[userId];
                if (userReward.claimed?.welcomePack)
                    return { ok: false, reason: 'already-claimed' };

                const ownedIds = new Set((userReward.coupons || []).map((c) => String(c.id)));
                const available = TEST_COUPON_POOL.filter((c) => !ownedIds.has(String(c.id)));

                // 사용가능 우선 정렬 (활성 & not disabled 먼저)
                const orderByActive = (arr) => {
                    const active = arr.filter((c) => isCouponActiveToday(c) && !c.disabled);
                    const inactive = arr.filter((c) => !(isCouponActiveToday(c) && !c.disabled));
                    return [...active, ...inactive];
                };
                const hotels = orderByActive(available.filter((c) => c.className === 'c-hotel'));
                const tours = orderByActive(available.filter((c) => c.className === 'c-tour'));

                if (hotels.length < hotelCount || tours.length < tourCount) {
                    return {
                        ok: false,
                        reason: 'insufficient-coupons-for-categories',
                        available: { hotels: hotels.length, tours: tours.length },
                    };
                }

                const startYmd = todayKST();
                const endYmd = addDaysYmd(startYmd, 30); // 오늘 포함 30일 유효
                const stamp = (c) => ({
                    ...c,
                    note: 'WELCOME 쿠폰팩',
                    source: 'welcome',
                    grantedAt: startYmd,
                    validFrom: startYmd,
                    validTo: endYmd,
                    period: `${startYmd} ~ ${endYmd}`,
                });

                const selectedHotels = hotels.slice(0, hotelCount).map(stamp);
                const selectedTours = tours.slice(0, tourCount).map(stamp);
                const pack = [...selectedHotels, ...selectedTours];

                set((prev) => {
                    const prevUser = prev.rewardByUser[userId] || createEmptyUserReward();
                    const merged = [...(prevUser.coupons || []), ...pack];
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

            // (호환) 범용 웰컴팩
            claimWelcomePack: (userId, count = 6) => {
                if (!userId) return { ok: false, reason: 'invalid-user' };
                get()._ensureUser(userId);

                const state = get();
                const userReward = state.rewardByUser[userId];
                if (userReward.claimed?.welcomePack)
                    return { ok: false, reason: 'already-claimed' };

                const ownedIds = new Set((userReward.coupons || []).map((c) => String(c.id)));
                const available = TEST_COUPON_POOL.filter((c) => !ownedIds.has(String(c.id)));

                const startYmd = todayKST();
                const endYmd = addDaysYmd(startYmd, 30);
                const stamp = (c) => ({
                    ...c,
                    note: 'WELCOME 쿠폰팩',
                    source: 'welcome',
                    grantedAt: startYmd,
                    validFrom: startYmd,
                    validTo: endYmd,
                    period: `${startYmd} ~ ${endYmd}`,
                });

                const pack = available.slice(0, count).map(stamp);
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

            // 포인트
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
                        rewardByUser: {
                            ...state.rewardByUser,
                            [userId]: { ...rw, coupons, points },
                        },
                    };
                });
            },

            // 가입 보너스 + 웰컴팩(원샷)
            grantSignupBonusAndWelcome: (userId, welcomeHotelCount = 3, welcomeTourCount = 3) => {
                if (!userId) return { ok: false, reason: 'invalid-user' };
                get()._ensureUser(userId);
                const pts = get().getPoints(userId);
                const alreadyToday = (pts.items || []).some(
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
                const res = get().claimWelcomePackFixed(
                    userId,
                    welcomeHotelCount,
                    welcomeTourCount
                );
                return { ok: true, welcome: res };
            },

            // 리셋/테스트
            resetCoupons: (userId) => {
                if (!userId) return;
                get()._ensureUser(userId);
                set((state) => {
                    const rw = state.rewardByUser[userId];
                    return {
                        rewardByUser: { ...state.rewardByUser, [userId]: { ...rw, coupons: [] } },
                    };
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
                            [userId]: {
                                ...rw,
                                claimed: { ...(rw.claimed || {}), welcomePack: false },
                            },
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
            // --- NEW: 결제 후 리워드 반영용 ---
            applyPaymentReward: (
                userId,
                { couponId = null, usedPoints = 0, memo = '결제' } = {}
            ) => {
                if (!userId) return;
                const { rewardByUser } = get();
                const rw = rewardByUser[userId];
                if (!rw) return;

                // 1) 쿠폰 사용 처리(비활성화)
                let nextCoupons = rw.coupons || [];
                if (couponId != null) {
                    nextCoupons = nextCoupons.map((c) =>
                        String(c.id) === String(couponId) ? { ...c, disabled: true } : c
                    );
                }

                // 2) 포인트 차감: 음수 항목 추가
                const ptsItems = rw.points?.items || [];
                const used = Number(usedPoints || 0);
                const pointDelta =
                    used > 0
                        ? [
                              {
                                  date: new Date().toISOString().slice(0, 10),
                                  type: `포인트 사용 - ${memo}`,
                                  amount: -used, // ⬅️ 음수로 기록
                                  status: '사용',
                              },
                          ]
                        : [];

                const next = {
                    ...rw,
                    coupons: nextCoupons,
                    points: { ...rw.points, items: [...pointDelta, ...ptsItems] },
                };

                set({ rewardByUser: { ...rewardByUser, [userId]: next } });
            },
        }),
        {
            name: 'reward_store_v1',
            storage: createJSONStorage(() => localStorage),
            version: 1,
            // 필요시: 어떤 필드만 저장할지 제한하고 싶으면 아래 주석 해제
            // partialize: (state) => ({ rewardByUser: state.rewardByUser }),
        }
    )
);

// ✅ 디버그 전역 노출 (어느 페이지든 콘솔에서 접근 가능)
if (typeof window !== 'undefined') {
    window.__USE_REWARD_STORE = useRewardStore;
    console.log('[rewardStore] exposed at window.__USE_REWARD_STORE');
}

export default useRewardStore;

// src/store/rewardStore.js
import { create } from 'zustand';
// import pointData from '../api/pointData';

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

// const STARTER_COUPONS = [
//     TEST_COUPON_POOL.find((c) => c.id === 1), // 투어 1만원
//     TEST_COUPON_POOL.find((c) => c.id === 6), // 숙소 2만원
// ].filter(Boolean);

// const useRewardStore = create((set, get) => ({
//     /** 초기 상태: u_test_1 유저가 쿠폰 '약간' 보유한 상태로 시작 */
//     rewardByUser: {
//         u_test_1: {
//             coupons: [...STARTER_COUPONS], // ← 초기 보유 쿠폰 2장
//             points: pointData, // { userName, items: [...] }
//             claimed: { welcomePack: false }, // 웰컴팩(5장) 수령 여부
//         },
//     },

//     // --- getters ---
//     getCoupons: (userId) => get().rewardByUser[userId]?.coupons || [],
//     getPoints: (userId) => {
//         const points = get().rewardByUser[userId]?.points || { userName: '', items: [] };
//         const balance = points.items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
//         return { ...points, balance };
//     },
//     hasClaimedWelcomePack: (userId) => !!get().rewardByUser[userId]?.claimed?.welcomePack,

//     // --- coupon actions ---
//     addCoupon: (userId, coupon) =>
//         set((state) => {
//             const userReward = state.rewardByUser[userId] || {
//                 coupons: [],
//                 points: { items: [] },
//                 claimed: { welcomePack: false },
//             };
//             return {
//                 rewardByUser: {
//                     ...state.rewardByUser,
//                     [userId]: { ...userReward, coupons: [...userReward.coupons, coupon] },
//                 },
//             };
//         }),

//     /** 웰컴팩(기본 5장) 1회만 발급 */
//     claimWelcomePack: (userId, count = 5) => {
//         const state = get();
//         const userReward = state.rewardByUser[userId] || {
//             coupons: [],
//             points: { items: [] },
//             claimed: { welcomePack: false },
//         };

//         if (userReward.claimed?.welcomePack) {
//             return { ok: false, reason: 'already-claimed' };
//         }

//         const ownedIds = new Set((userReward.coupons || []).map((c) => String(c.id)));
//         const candidates = TEST_COUPON_POOL.filter((c) => !ownedIds.has(String(c.id)));
//         const pack = candidates.slice(0, count).map((c) => ({
//             ...c,
//             note: 'WELCOME 기념 발급',
//             source: 'welcome',
//         }));

//         if (!pack.length) {
//             return { ok: false, reason: 'no-coupons-left' };
//         }

//         set((prev) => {
//             const prevUser = prev.rewardByUser[userId] || {
//                 coupons: [],
//                 points: { items: [] },
//                 claimed: { welcomePack: false },
//             };
//             return {
//                 rewardByUser: {
//                     ...prev.rewardByUser,
//                     [userId]: {
//                         ...prevUser,
//                         coupons: [...(prevUser.coupons || []), ...pack],
//                         claimed: { ...(prevUser.claimed || {}), welcomePack: true },
//                     },
//                 },
//             };
//         });

//         return { ok: true, added: pack.length };
//     },

//     // --- point actions ---
//     addPointItem: (userId, item) =>
//         set((state) => {
//             const userReward = state.rewardByUser[userId] || {
//                 coupons: [],
//                 points: { items: [] },
//                 claimed: { welcomePack: false },
//             };
//             const updatedPoints = {
//                 ...userReward.points,
//                 items: [item, ...(userReward.points.items || [])],
//             };
//             return {
//                 rewardByUser: {
//                     ...state.rewardByUser,
//                     [userId]: { ...userReward, points: updatedPoints },
//                 },
//             };
//         }),

//     // 쿠폰 사용 → 포인트 적립
//     useCouponAndAddPoints: (userId, coupon) =>
//         set((state) => {
//             const userReward = state.rewardByUser[userId];
//             if (!userReward) return {};

//             const coupons = (userReward.coupons || []).map((c) =>
//                 String(c.id) === String(coupon.id) ? { ...c, disabled: true } : c
//             );

//             const prevPoints = userReward.points?.items || [];
//             const newPointItem = {
//                 date: new Date().toISOString().split('T')[0],
//                 type: `${coupon.label || '쿠폰'} 사용 리워드`,
//                 amount: coupon.amount || 0,
//                 status: '적립',
//             };
//             const points = { ...userReward.points, items: [newPointItem, ...prevPoints] };

//             return {
//                 rewardByUser: {
//                     ...state.rewardByUser,
//                     [userId]: { ...userReward, coupons, points },
//                 },
//             };
//         }),

//     // --- 테스트/리셋용 ---
//     resetCoupons: (userId) =>
//         set((state) => {
//             const userReward = state.rewardByUser[userId];
//             if (!userReward) return {};
//             return {
//                 rewardByUser: {
//                     ...state.rewardByUser,
//                     [userId]: { ...userReward, coupons: [] },
//                 },
//             };
//         }),

//     resetWelcomePackClaim: (userId) =>
//         set((state) => {
//             const userReward = state.rewardByUser[userId];
//             if (!userReward) return {};
//             return {
//                 rewardByUser: {
//                     ...state.rewardByUser,
//                     [userId]: {
//                         ...userReward,
//                         claimed: { ...(userReward.claimed || {}), welcomePack: false },
//                     },
//                 },
//             };
//         }),

//     resetRewards: (userId) =>
//         set((state) => {
//             const userReward = state.rewardByUser[userId];
//             if (!userReward) return {};
//             return {
//                 rewardByUser: {
//                     ...state.rewardByUser,
//                     [userId]: {
//                         ...userReward,
//                         coupons: [],
//                         claimed: { ...(userReward.claimed || {}), welcomePack: false },
//                     },
//                 },
//             };
//         }),
// }));

export default useRewardStore;

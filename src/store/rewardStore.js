// src/store/rewardStore.js
import { create } from 'zustand';
import couponData from '../api/couponData';
import pointData from '../api/pointData';

const useRewardStore = create((set, get) => ({
    rewardByUser: {
        // 예시 기본 유저
        u_test_1: {
            coupons: [...couponData],
            points: pointData, // { userName, items: [...] }
            claimed: { welcomePack: false }, // ✅ 쿠폰팩 발급 여부
        },
    },

    // --- getters ---
    getCoupons: (userId) => get().rewardByUser[userId]?.coupons || [],
    getPoints: (userId) => {
        const points = get().rewardByUser[userId]?.points || { userName: '', items: [] };
        const balance = points.items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
        return { ...points, balance };
    },
    hasClaimedWelcomePack: (userId) => !!get().rewardByUser[userId]?.claimed?.welcomePack,

    // --- coupon actions ---
    addCoupon: (userId, coupon) =>
        set((state) => {
            const userReward = state.rewardByUser[userId] || {
                coupons: [],
                points: { items: [] },
                claimed: { welcomePack: false },
            };
            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: { ...userReward, coupons: [...userReward.coupons, coupon] },
                },
            };
        }),

    // ✅ 쿠폰팩(5장) 1회만 발급
    claimWelcomePack: (userId, count = 5) => {
        const state = get();
        const userReward = state.rewardByUser[userId] || {
            coupons: [],
            points: { items: [] },
            claimed: { welcomePack: false },
        };

        // 이미 발급했다면 차단
        if (userReward.claimed?.welcomePack) {
            return { ok: false, reason: 'already-claimed' };
        }

        // 이미 가진 쿠폰 제외하고 5장 뽑기 (기본은 앞에서부터)
        const ownedIds = new Set((userReward.coupons || []).map((c) => String(c.id)));
        const candidates = couponData.filter((c) => !ownedIds.has(String(c.id)));
        const pack = candidates.slice(0, count);

        // 발급할 쿠폰이 없을 때
        if (!pack.length) {
            return { ok: false, reason: 'no-coupons-left' };
        }

        // 적용
        set((prev) => {
            const prevUser = prev.rewardByUser[userId] || {
                coupons: [],
                points: { items: [] },
                claimed: { welcomePack: false },
            };
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

        return { ok: true, added: pack.length };
    },

    // --- point actions ---
    addPointItem: (userId, item) =>
        set((state) => {
            const userReward = state.rewardByUser[userId] || {
                coupons: [],
                points: { items: [] },
                claimed: { welcomePack: false },
            };
            const updatedPoints = {
                ...userReward.points,
                items: [item, ...(userReward.points.items || [])],
            };
            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: { ...userReward, points: updatedPoints },
                },
            };
        }),

    // ✅ 쿠폰 사용 → 포인트 적립 동시 처리
    useCouponAndAddPoints: (userId, coupon) =>
        set((state) => {
            const userReward = state.rewardByUser[userId];
            if (!userReward) return {};

            const coupons = (userReward.coupons || []).map((c) =>
                String(c.id) === String(coupon.id) ? { ...c, disabled: true } : c
            );

            const prevPoints = userReward.points?.items || [];
            const newPointItem = {
                date: new Date().toISOString().split('T')[0],
                type: `${coupon.label || '쿠폰'} 사용 리워드`,
                amount: coupon.amount || 0,
                status: '적립',
            };
            const points = { ...userReward.points, items: [newPointItem, ...prevPoints] };

            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: { ...userReward, coupons, points },
                },
            };
        }),
}));

export default useRewardStore;

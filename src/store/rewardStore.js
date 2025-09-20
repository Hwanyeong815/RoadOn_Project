// src/store/rewardStore.js
import { create } from 'zustand';
import couponData from '../api/couponData';
import pointData from '../api/pointData';

const useRewardStore = create((set, get) => ({
    rewardByUser: {
        u_test_1: {
            coupons: couponData,
            points: pointData, // { userName, items: [...] }
        },
    },

    // --- getters ---
    getCoupons: (userId) => get().rewardByUser[userId]?.coupons || [],

    getPoints: (userId) => {
        const points = get().rewardByUser[userId]?.points || { userName: '', items: [] };
        // ✅ 항상 balance를 items.reduce()로 계산
        const balance = points.items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0);
        return { ...points, balance };
    },

    // --- coupon actions ---
    addCoupon: (userId, coupon) =>
        set((state) => {
            const userReward = state.rewardByUser[userId] || { coupons: [], points: { items: [] } };
            return {
                rewardByUser: {
                    ...state.rewardByUser,
                    [userId]: { ...userReward, coupons: [...userReward.coupons, coupon] },
                },
            };
        }),

    // --- point actions ---
    addPointItem: (userId, item) =>
        set((state) => {
            const userReward = state.rewardByUser[userId] || { coupons: [], points: { items: [] } };
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

            // 쿠폰 사용 처리 (id 안전 비교)
            const coupons = (userReward.coupons || []).map((c) =>
                String(c.id) === String(coupon.id) ? { ...c, disabled: true } : c
            );

            // 포인트 적립 처리 (쿠폰 금액만큼)
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

// src/components/ui/coupon/CouponButton.jsx
import React, { useState } from 'react';
import useAuthStore from '../../../store/authStore';
import useRewardStore from '../../../store/rewardStore';
import './style.scss';

const CouponButton = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id || 'u_test_1';

    // ✅ 상태를 직접 구독 (claimed, coupons)
    const claimed = useRewardStore((s) => !!s.rewardByUser[userId]?.claimed?.welcomePack);
    const couponsCount = useRewardStore((s) => (s.rewardByUser[userId]?.coupons || []).length);

    const claimWelcomePack = useRewardStore((s) => s.claimWelcomePack);
    const resetRewards = useRewardStore((s) => s.resetRewards);

    const [loading, setLoading] = useState(false);

    const handleClaim = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await claimWelcomePack(userId, 5); // 5장 발급
            if (!res?.ok) {
                const msg =
                    res?.reason === 'already-claimed'
                        ? '이미 쿠폰팩을 받았습니다.'
                        : res?.reason === 'no-coupons-left'
                        ? '발급 가능한 쿠폰이 더 이상 없습니다.'
                        : '쿠폰 발급에 실패했습니다.';
                alert(msg);
                return;
            }
            alert(`쿠폰 ${res.added}개가 쿠폰함에 추가되었어요!`);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await resetRewards(userId); // ✅ 쿠폰 목록 + claimed 둘 다 초기화
            alert('쿠폰과 발급 상태가 초기화되었습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="coupon-button-wrap">
            {!claimed ? (
                <button
                    type="button"
                    className="button  g coupon-claim-btn"
                    onClick={handleClaim}
                    disabled={loading}
                >
                    {loading ? '발급 중...' : '쿠폰 전체 받기'}
                </button>
            ) : (
                <button
                    type="button"
                    className="button  g coupon-reset-btn"
                    onClick={handleReset}
                    disabled={loading}
                >
                    {loading ? '초기화 중...' : `쿠폰 초기화 (${couponsCount}장 보유 중)`}
                </button>
            )}
        </div>
    );
};

export default CouponButton;

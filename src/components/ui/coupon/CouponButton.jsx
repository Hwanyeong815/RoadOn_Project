// src/components/ui/coupon/CouponButton.jsx
import React, { useMemo } from 'react';
import useRewardStore from '../../../store/rewardStore';
import useAuthStore from '../../../store/authStore';

const CouponButton = ({ count = 5 }) => {
    // 로그인 유저
    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id || 'u_test_1'; // 로그인 없을 때 로컬 기본값

    // 스토어
    const claimWelcomePack = useRewardStore((s) => s.claimWelcomePack);
    const hasClaimedWelcomePack = useRewardStore((s) => s.hasClaimedWelcomePack);

    // 계정당 1회만
    const claimed = useMemo(() => hasClaimedWelcomePack(userId), [hasClaimedWelcomePack, userId]);

    const onClick = () => {
        if (claimed) {
            alert('이미 쿠폰팩을 발급받았습니다.');
            return;
        }
        const res = claimWelcomePack(userId, count);
        if (res?.ok) {
            alert(`쿠폰 ${res.added}장이 발급되었습니다!`);
            return;
        }
        if (res?.reason === 'already-claimed') {
            alert('이미 쿠폰팩을 발급받았습니다.');
            return;
        }
        if (res?.reason === 'no-coupons-left') {
            alert('발급 가능한 쿠폰이 없습니다.');
            return;
        }
        alert('쿠폰 발급 중 문제가 발생했습니다.');
    };

    return (
        <button
            className={`coupon-btn ${claimed ? 'is-disabled' : ''}`}
            onClick={onClick}
            disabled={claimed}
            title={claimed ? '이미 발급 완료' : `쿠폰 ${count}개 받기`}
            style={{
                margin: '16px 0',
                padding: '10px 16px',
                borderRadius: 8,
                border: '1px solid #ddd',
                background: claimed ? '#f3f3f3' : '#ffedd5',
                color: '#333',
                cursor: claimed ? 'not-allowed' : 'pointer',
                fontWeight: 600,
            }}
        >
            🎁 {claimed ? '발급 완료' : `쿠폰 ${count}개 받기`}
        </button>
    );
};

export default CouponButton;

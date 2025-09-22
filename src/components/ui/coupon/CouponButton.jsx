import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import useRewardStore from '../../../store/rewardStore';
import { openSwal, openCouponBoxShortcut } from '../swal/presets';
import './style.scss';

const CouponButton = ({
    onIssued,
    // 🔧 강조(하이라이트) 커스터마이즈용 props — 추후 문구만 바꾸고 싶을 때 여기만 변경하면 됨
    highlightOnClaim = true,
    highlightLabel = '쿠폰 지급 완료', // ← 나중에 원하는 문구로 교체
    highlightDuration = 2000, // 강조 유지 시간(ms)
    highlightClassName = 'just-claimed', // 강조용 클래스명
}) => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id || 'u_test_1';

    // ✅ 상태 구독
    const claimed = useRewardStore((s) => !!s.rewardByUser[userId]?.claimed?.welcomePack);
    const couponsCount = useRewardStore((s) => (s.rewardByUser[userId]?.coupons || []).length);

    const claimWelcomePack = useRewardStore((s) => s.claimWelcomePack);
    const resetRewards = useRewardStore((s) => s.resetRewards);

    const [loading, setLoading] = useState(false);
    const [justClaimed, setJustClaimed] = useState(false); // ✅ 방금 지급 강조 상태
    const timerRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleClaim = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await claimWelcomePack(userId, 5); // 5장 발급

            if (!res?.ok) {
                const html =
                    res?.reason === 'already-claimed'
                        ? '이미 쿠폰팩을 받았습니다.'
                        : res?.reason === 'no-coupons-left'
                        ? '발급 가능한 쿠폰이 더 이상 없습니다.'
                        : '쿠폰 발급에 실패했습니다.';
                await openSwal({
                    title: '<strong>쿠폰 발급 안내</strong>',
                    html,
                    icon: 'info',
                    showCancelButton: false,
                    confirmButtonText: '확인',
                });
                return;
            }

            // ✅ 발급 성공: SweetAlert2 → (확인 시) 쿠폰함 이동
            await openCouponBoxShortcut({ navigate });
            onIssued?.();

            // ✅ 강조 전환 (사용자가 이동을 취소했을 때도 시각적으로 피드백)
            if (highlightOnClaim) {
                setJustClaimed(true);
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => setJustClaimed(false), highlightDuration);
            }
        } catch (err) {
            await openSwal({
                title: '<strong>오류가 발생했습니다</strong>',
                html: err?.message || '쿠폰 발급 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: '확인',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await resetRewards(userId);
            await openSwal({
                title: '<strong>초기화 완료</strong>',
                html: '쿠폰과 발급 상태가 초기화되었습니다.',
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: '확인',
            });
        } catch (err) {
            await openSwal({
                title: '<strong>초기화 실패</strong>',
                html: err?.message || '초기화 중 오류가 발생했습니다.',
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: '확인',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="coupon-button-wrap">
            {/* 지급 전 */}
            {!claimed ? (
                <button
                    type="button"
                    className="button g coupon-claim-btn"
                    onClick={handleClaim}
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? '발급 중...' : '쿠폰 전체 받기'}
                </button>
            ) : (
                // 지급 후: 기본은 "쿠폰 초기화", 방금 지급/전환 직후에는 강조 표시
                <button
                    type="button"
                    className={`button g coupon-reset-btn ${justClaimed ? highlightClassName : ''}`}
                    onClick={handleReset}
                    disabled={loading || justClaimed} // 강조 중엔 클릭 잠깐 막기(선택)
                    aria-busy={loading}
                    aria-live="polite" // 스크린리더에 전환 안내
                >
                    {loading
                        ? '초기화 중...'
                        : justClaimed
                        ? highlightLabel // 👈 여기 문구만 나중에 "쿠폰 지급 완료" 등으로 자유 변경
                        : `쿠폰 초기화 (${couponsCount}장 보유 중)`}
                </button>
            )}
        </div>
    );
};

export default CouponButton;

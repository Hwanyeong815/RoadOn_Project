// src/components/myPage/CouponButton.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import useRewardStore from "../../../store/rewardStore";
import { openSwal, openCouponBoxShortcut } from "../swal/presets";
import "./style.scss";

const CouponButton = ({
  onIssued,
  highlightOnClaim = true,
  highlightLabel = "쿠폰 지급 완료",
  highlightDuration = 2000,
  highlightClassName = "just-claimed",
}) => {
  const currentUser = useAuthStore((s) => s.currentUser);
  const userId = currentUser?.id || "u_test_1";

  // 상태 구독
  const claimed = useRewardStore(
    (s) => !!s.rewardByUser[userId]?.claimed?.welcomePack
  );
  const couponsCount = useRewardStore(
    (s) => (s.rewardByUser[userId]?.coupons || []).length
  );

  // 고정형 웰컴팩 함수 사용 (숙소 3장, 투어 3장)
  const claimWelcomePackFixed = useRewardStore((s) => s.claimWelcomePackFixed);
  const resetRewards = useRewardStore((s) => s.resetRewards);

  const [loading, setLoading] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
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
      // **숙소 3장, 투어 3장** 고정 발급
      const res = await claimWelcomePackFixed(userId, 3, 3);

      if (!res?.ok) {
        const html =
          res?.reason === "already-claimed"
            ? "이미 쿠폰팩을 받았습니다."
            : res?.reason === "insufficient-coupons-for-categories"
            ? `충분한 카테고리 쿠폰이 없습니다. (호텔:${
                res.available?.hotels || 0
              }, 투어:${res.available?.tours || 0})`
            : res?.reason === "no-coupons-left"
            ? "발급 가능한 쿠폰이 더 이상 없습니다."
            : "쿠폰 발급에 실패했습니다.";
        await openSwal({
          title: "<strong>쿠폰 발급 안내</strong>",
          html,
          icon: "info",
          showCancelButton: false,
          confirmButtonText: "확인",
        });
        return;
      }

      // 성공
      await openCouponBoxShortcut({ navigate });
      onIssued?.();

      if (highlightOnClaim) {
        setJustClaimed(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(
          () => setJustClaimed(false),
          highlightDuration
        );
      }
    } catch (err) {
      await openSwal({
        title: "<strong>오류가 발생했습니다</strong>",
        html:
          err?.message ||
          "쿠폰 발급 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "확인",
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
        title: "<strong>초기화 완료</strong>",
        html: "쿠폰과 발급 상태가 초기화되었습니다.",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "확인",
      });
    } catch (err) {
      await openSwal({
        title: "<strong>초기화 실패</strong>",
        html: err?.message || "초기화 중 오류가 발생했습니다.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "확인",
      });
    } finally {
      setLoading(false);
    }
  };
  // after successful claim (inside handleClaim)
  console.log(
    "DEBUG rewardByUser AFTER claim:",
    useRewardStore.getState().rewardByUser
  );

  return (
    <div className="coupon-button-wrap">
      {!claimed ? (
        <button
          type="button"
          className="coupon-btn button g coupon-claim-btn"
          onClick={handleClaim}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "발급 중..." : "쿠폰 전체 받기"}
        </button>
      ) : (
        <button
          type="button"
          className={`coupon-btn button g coupon-reset-btn ${
            justClaimed ? highlightClassName : ""
          }`}
          onClick={handleReset}
          disabled={loading || justClaimed}
          aria-busy={loading}
          aria-live="polite"
        >
          {loading
            ? "초기화 중..."
            : justClaimed
            ? highlightLabel
            : `쿠폰 초기화 (${couponsCount}장 보유 중)`}
        </button>
      )}
    </div>
  );
};

export default CouponButton;

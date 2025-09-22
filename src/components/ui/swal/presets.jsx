// src/ui/swal/presets.jsx
import Swal from 'sweetalert2';
import './style.scss';

// 🌟 라우트 상수 (요청한 주소)
export const ROUTES = {
    wishlist: '/myPage?mypage_section=wishlist',
    coupons: '/myPage?mypage_section=reward&reward_tab=coupons',
};

// 키별 기본 이동 경로 매핑 (confirm 버튼 기준)
const DEFAULT_CONFIRM_ROUTES = {
    addedToWishlist: ROUTES.wishlist,
    couponIssued: ROUTES.coupons,
};

// 공통 옵션
export const baseSwal = Swal.mixin({
    reverseButtons: true,
    buttonsStyling: false,
    showCloseButton: false,
    customClass: {
        container: 'swalx-container',
        popup: 'swalx-popup',
        title: 'swalx-title',
        htmlContainer: 'swalx-html',
        actions: 'swalx-actions',
        confirmButton: 'swalx-btn swalx-confirm',
        cancelButton: 'swalx-btn swalx-cancel',
    },
});

/**
 * 프리셋 모음
 * - 버튼 텍스트/표현만 관리, 실제 라우팅은 openAndNavigate가 처리
 */
export const presets = {
    loginRequired: {
        html: '로그인이 필요한 서비스입니다. \n 로그인 하시겠습니까?',
        showCancelButton: true,
        cancelButtonText: '취소',
        confirmButtonText: '확인',
        customClass: {
            container: 'swalx-container',
            popup: 'swalx-popup',
            title: 'swalx-title',
            htmlContainer: 'swalx-html swalx-html--login-sm',
            actions: 'swalx-actions',
            confirmButton: 'swalx-btn swalx-confirm',
            cancelButton: 'swalx-btn swalx-cancel',
        },
    },
    loginRequired2: {
        title: '<strong>로그인 하시겠습니까?</strong>',
        html: '로그인이 필요한 서비스입니다. \n 로그인 하시겠습니까?',
        showCancelButton: true,
        cancelButtonText: '취소',
        confirmButtonText: '로그인 하러가기',
    },
    addedToWishlist: {
        title: '<strong>찜 목록에 추가하였습니다.</strong>',
        html: '마이페이지 &gt; 찜 목록에서 확인이 가능합니다.',
        showCancelButton: true,
        cancelButtonText: '계속 둘러보기',
        confirmButtonText: '찜 목록 바로가기', // ✅ confirm → 찜목록 이동
    },
    endReservation: {
        title: '<strong>예약을 종료하시겠습니까?</strong>',
        html:
            '진행 중인 예약이 종료되며, 작성하신 내용은 모두 사라집니다.<br/>' +
            '계속 예약하시려면 “계속 예약” 버튼을 눌러주세요.',
        showCancelButton: true,
        cancelButtonText: '예약 종료',
        confirmButtonText: '계속 예약',
    },
    couponIssued: {
        title: '<strong>쿠폰이 발급되었습니다.</strong>',
        html: '마이페이지 &gt; 쿠폰함에서 확인하세요.',
        showCancelButton: true,
        cancelButtonText: '닫기',
        confirmButtonText: '쿠폰함 바로가기', // ✅ confirm → 쿠폰함 이동
    },
};

export const openSwal = (key, override = {}) => {
    const cfg = presets[key];
    if (!cfg) return Promise.reject(new Error(`Unknown preset: ${key}`));
    return baseSwal.fire({ ...cfg, ...override });
};

export const toast = (text, override = {}) =>
    baseSwal.fire({
        toast: true,
        position: 'top-end',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        html: text,
        ...override,
    });

/**
 * 확인/취소 버튼에 따른 이동 래퍼
 * - confirmTo/cancelTo가 안 넘어오면, 키 기반 기본 경로를 사용(있는 경우)
 * - navigate가 있으면 SPA 네비게이션, 없으면 window.open
 */
export const openAndNavigate = async (
    key,
    { confirmTo, cancelTo, target = '_self', navigate } = {}
) => {
    const res = await openSwal(key);

    // 기본 confirm 경로 자동 보정 (키 → 기본 경로)
    const confirmedPath = confirmTo ?? DEFAULT_CONFIRM_ROUTES[key];

    if (res.isConfirmed && confirmedPath) {
        navigate ? navigate(confirmedPath) : window.open(confirmedPath, target);
    }
    if (res.dismiss === Swal.DismissReason.cancel && cancelTo) {
        navigate ? navigate(cancelTo) : window.open(cancelTo, target);
    }
    return res;
};

// 🔸 사용 편의를 위한 헬퍼 (선택)
export const openWishlistShortcut = (opts = {}) =>
    openAndNavigate('addedToWishlist', { confirmTo: ROUTES.wishlist, ...opts });

export const openCouponBoxShortcut = (opts = {}) =>
    openAndNavigate('couponIssued', { confirmTo: ROUTES.coupons, ...opts });

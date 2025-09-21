// src/ui/swal/presets.jsx
import Swal from 'sweetalert2';
import './style.scss';

// 공통 옵션 (테마/애니메이션/클래스)
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
 * - 각 항목은 SweetAlert2 옵션 객체
 * - 필요한 텍스트만 바꿔 쓰고, 색/레이아웃은 SCSS에서 통일
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
        confirmButtonText: '찜 목록 바로가기',
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
        confirmButtonText: '쿠폰함 바로가기',
    },
};

export const openSwal = (key, override = {}) => {
    const cfg = presets[key];
    if (!cfg) return Promise.reject(new Error(`Unknown preset: ${key}`));
    return baseSwal.fire({ ...cfg, ...override });
};

// 토스트도 필요하면 이렇게
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
export const openAndNavigate = async (
    key,
    { confirmTo, cancelTo, target = '_self', navigate } = {}
) => {
    const res = await openSwal(key);
    if (res.isConfirmed && confirmTo) {
        navigate ? navigate(confirmTo) : window.open(confirmTo, target);
    }
    if (res.dismiss === Swal.DismissReason.cancel && cancelTo) {
        navigate ? navigate(cancelTo) : window.open(cancelTo, target);
    }
    return res;
};

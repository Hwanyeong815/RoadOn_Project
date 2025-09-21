// src/pages/Test.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { openSwal, toast, openAndNavigate } from '../../ui/swal/presets'; // 경로 맞춤

const Test = () => {
    const navigate = useNavigate();

    // 기본 프리셋 호출들
    const onLogin = async () => {
        const { isConfirmed } = await openSwal('loginRequired');
        if (isConfirmed) toast('로그인 페이지로 이동합니다.');
    };
    const onWishlist = () => openSwal('addedToWishlist');
    const onEndReservation = async () => {
        const r = await openSwal('endReservation');
        if (r.isConfirmed) toast('계속 예약을 진행합니다.');
        else toast('예약을 종료합니다.');
    };
    const onCoupon = () => openSwal('couponIssued');
    const onToast = () => toast('토스트 알림 예시');

    // === 이동 예시들 ===

    // (A) 확인/취소에 따라 SPA 라우팅
    // 확인 -> /login, 취소 -> /
    const goLoginWithRoute = () =>
        openAndNavigate('loginRequired', {
            confirmTo: '/login',
            cancelTo: '/',
            navigate, // react-router 이동 사용
            // reverseButtons: true 를 쓰고 싶으면 presets에서 또는 override로 지정 가능
        });

    // (B) 쿠폰 알림 후 확인을 누르면 외부 링크 새 탭 열기
    const openCouponCenter = () =>
        openAndNavigate('couponIssued', {
            confirmTo: 'https://example.com/coupons',
            target: '_blank', // 새 탭
            // navigate 미전달 => window.open 사용
        });

    // (C) 예약 종료 팝업: 확인(계속 예약) -> /reservation/continue
    //                      취소(예약 종료) -> /reservation/ended
    const endReservationRoute = () =>
        openAndNavigate('endReservation', {
            confirmTo: '/reservation/continue',
            cancelTo: '/reservation/ended',
            navigate,
        });

    return (
        <div style={{ padding: 100 }}>
            <h2>SweetAlert2 Presets Demo</h2>

            <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
                {/* 기본 프리셋 데모 */}
                <button onClick={onLogin}>로그인 필요</button>
                <button onClick={onWishlist}>찜 추가 완료</button>
                <button onClick={onEndReservation}>예약 종료 확인</button>
                <button onClick={onCoupon}>쿠폰 발급 알림</button>
                <button onClick={onToast}>토스트 예시</button>

                <hr />

                {/* 이동 예시 */}
                <button onClick={goLoginWithRoute}>[이동] 로그인 확인 후 라우팅</button>
                <button onClick={openCouponCenter}>[이동] 쿠폰 확인 후 외부 링크(새 탭)</button>
                <button onClick={endReservationRoute}>
                    [이동] 예약 종료(확인/취소 분기 라우팅)
                </button>
            </div>
        </div>
    );
};

export default Test;

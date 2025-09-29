import { useNavigate } from 'react-router-dom';
import { openSwal, toast, openAndNavigate } from '../../ui/swal/presets'; // ← openCouponBoxShortcut import 불필요
import CouponButton from '../../ui/coupon/CouponButton';
import SearchBar from '../SearchBar/SearchBar';

const Test = () => {
    const navigate = useNavigate();

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

    const onToast = () => toast('토스트 알림 예시');

    const goLoginWithRoute = () =>
        openAndNavigate('loginRequired', {
            confirmTo: '/login',
            cancelTo: '/',
            navigate,
        });

    const endReservationRoute = () =>
        openAndNavigate('endReservation', {
            confirmTo: '/reservation/continue',
            cancelTo: '/reservation/ended',
            navigate,
        });

    return (
        <div style={{ padding: 100, background: 'grey' }}>
            {/*  */}
            {/* 화이트 테마 */}
            <SearchBar className="white" />
            {/* 투명 테마 */}
            <SearchBar className="transparent" />
            {/*  */}
            <h2>SweetAlert2 Presets Demo</h2>
            <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
                <button onClick={onLogin}>로그인 필요</button>
                <button onClick={onWishlist}>찜 추가 완료</button>
                <button onClick={onEndReservation}>예약 종료 확인</button>
                <button onClick={onToast}>토스트 예시</button>

                <hr />

                <button onClick={goLoginWithRoute}>[이동] 로그인 확인 후 라우팅</button>
                <button onClick={endReservationRoute}>
                    [이동] 예약 종료(확인/취소 분기 라우팅)
                </button>

                <hr />

                {/* ✅ 쿠폰 발급: 내부 로직에 알림+이동 포함 → onIssued 제거 */}
                <div className="coupon-wrap">
                    <CouponButton />
                </div>
            </div>
        </div>
    );
};

export default Test;

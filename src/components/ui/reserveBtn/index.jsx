import './style.scss';
import { openSwal } from '../swal/presets';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';

const ReserveBtn = ({ className = '', disabled = false, onReserve }) => {
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const currentUser = useAuthStore((s) => s.currentUser);

    const handleClick = async (e) => {
        e.stopPropagation();

        // ✅ 로그인 상태 확인
        if (!isLoggedIn || !currentUser) {
            const res = await openSwal('loginRequired2');
            if (res.isConfirmed) {
                navigate('/login');
            }
            return;
        }

        // ✅ 로그인 되어 있으면 예약 로직 실행
        if (typeof onReserve === 'function') {
            onReserve();
        } else {
            navigate('/payment'); // 필요 시 기본 이동
        }
    };

    return (
        <button
            className={`button large reserve ${className}`}
            disabled={disabled}
            onClick={handleClick}
        >
            예약하기
        </button>
    );
};

export default ReserveBtn;

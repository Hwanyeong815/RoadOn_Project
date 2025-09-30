import './style.scss';
import { openSwal } from '../swal/presets';
import { useNavigate } from 'react-router-dom';

const ReserveBtn = ({ className = '', disabled = false, onReserve }) => {
    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.stopPropagation();

        // swal 띄우기
        const res = await openSwal('loginRequired2');

        if (res.isConfirmed) {
            // ✅ 로그인 페이지로 이동
            navigate('/login');
        } else {
            // ❌ 취소 시 동작 없음 (원하면 여기서 toast 같은 것 넣을 수 있음)
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

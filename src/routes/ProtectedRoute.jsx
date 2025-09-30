// src/routes/protectedRoute.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { openSwal } from '../components/ui/swal/presets';

const ProtectedRoute = ({ children }) => {
    const currentUser = useAuthStore((s) => s.currentUser ?? s.current ?? s.user ?? null);
    const location = useLocation();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true); // ✅ 초기 로딩 상태 추가

    useEffect(() => {
        if (!currentUser) {
            openSwal('loginRequired2').then((res) => {
                if (res.isConfirmed) {
                    navigate('/login', { state: { from: location }, replace: false });
                } else {
                    navigate('/', { replace: true }); // 로그인 거부 시 홈으로 돌려보내기
                }
            });
        }
        setChecking(false);
    }, [currentUser, navigate, location]);

    // ✅ 체크 중이거나 로그인 안 된 상태면 children을 렌더링하지 않음
    if (checking || !currentUser) return null;

    return children;
};

export default ProtectedRoute;

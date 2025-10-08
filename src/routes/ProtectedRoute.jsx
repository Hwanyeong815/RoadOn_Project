// src/routes/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { openSwal } from '../components/ui/swal/presets';

const ProtectedRoute = ({ children }) => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const location = useLocation();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // store 복원 전이면 대기
        if (currentUser === undefined) return;

        if (!isLoggedIn || !currentUser) {
            openSwal('loginRequired2').then((res) => {
                if (res.isConfirmed) {
                    navigate('/login', { state: { from: location }, replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            });
        }
        setChecking(false);
    }, [currentUser, isLoggedIn, navigate, location]);

    // 로그인 체크 중이거나 로그인 실패 시 → 아무것도 안 그림
    if (checking || !isLoggedIn || !currentUser) return null;

    return children;
};

export default ProtectedRoute;

// src/routes/protectedRoute.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { openSwal } from '../components/ui/swal/presets';
// import { openSwal } from '../ui/swal/presets';

const ProtectedRoute = ({ children }) => {
    const currentUser = useAuthStore((s) => s.currentUser ?? s.current ?? s.user ?? null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            openSwal('loginRequired2').then((res) => {
                if (res.isConfirmed) {
                    navigate('/login', { state: { from: location }, replace: true });
                }
            });
        }
    }, [currentUser, navigate, location]);

    // 👇 로그인 안 되어 있어도 children을 그대로 보여줌
    return children;
};

export default ProtectedRoute;

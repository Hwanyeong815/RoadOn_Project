// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';
import useAuthStore from '../../store/authStore';

/** 옵션
 * - afterMs: 지정 시 n ms 뒤 자동으로 메인으로 이동 (기본 비활성화)
 * - onExtraClear: 추가로 지울 게 있으면 함수 주입
 */
const Logout = ({ afterMs = 0, onExtraClear }) => {
    const nav = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    useEffect(() => {
        try {
            // ✅ zustand 상태까지 초기화
            logout();

            // 추가 정리 필요하면 실행
            if (typeof onExtraClear === 'function') onExtraClear();
        } catch (e) {
            console.warn('Logout error', e);
        }
    }, [logout, onExtraClear]);

    // 자동 이동 옵션
    useEffect(() => {
        if (!afterMs) return;
        const t = setTimeout(() => nav('/', { replace: true }), afterMs);
        return () => clearTimeout(t);
    }, [afterMs, nav]);

    return (
        <section className="logout-done">
            <div className="logout-done__icon" aria-hidden>
                <img src="/images/icon/question.png" alt="" />
            </div>
            <h1 className="logout-done__title">로그아웃이 완료되었습니다</h1>
            <p className="logout-done__desc">이용해주셔서 감사합니다</p>

            <div className="logout-done__actions" role="group" aria-label="다음 작업">
                <button
                    type="button"
                    className="button button-outline"
                    onClick={() => nav('/login', { replace: true })}
                >
                    로그인 하기
                </button>
                <button
                    type="button"
                    className="button g"
                    onClick={() => nav('/', { replace: true })}
                >
                    메인페이지로 이동
                </button>
            </div>
        </section>
    );
};

export default Logout;

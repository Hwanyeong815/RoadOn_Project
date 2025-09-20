import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';

/** 옵션
 * - afterMs: 지정 시 n ms 뒤 자동으로 메인으로 이동 (기본 비활성화)
 * - onExtraClear: 추가로 지울 게 있으면 함수 주입
 */

const Logout = ({ afterMs = 0, onExtraClear }) => {
    const nav = useNavigate();

    // 실제 로그아웃 처리 (필요에 맞게 수정)
    useEffect(() => {
        try {
            // 예: 액세스 토큰/유저 정보/임시 캐시 등 제거
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('tmp_cart');

            // zustand/redux 등 상태 초기화가 필요하면 여기서…
            if (typeof onExtraClear === 'function') onExtraClear();
        } catch (e) {
            // noop
        }
    }, [onExtraClear]);

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
                    onClick={() => nav('/login')}
                >
                    로그인 하기
                </button>
                <button type="button" className="button g" onClick={() => nav('/')}>
                    메인페이지로 이동
                </button>
            </div>
        </section>
    );
};

export default Logout;

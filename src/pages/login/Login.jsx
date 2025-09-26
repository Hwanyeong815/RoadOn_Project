// src/pages/Login.jsx
import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import KakaoLoginButton from '../../components/ui/kakaoLogin/KakaoLoginButton';

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const Login = ({ initialMode = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [mode, setMode] = useState(() => {
        const p = (initialMode || '').toLowerCase();
        const s = (location.state?.mode || '').toLowerCase();
        const q = (searchParams.get('mode') || '').toLowerCase();
        const m = p || s || q || 'login';
        return m === 'register' ? 'register' : 'login';
    });

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = useAuthStore((s) => s.validateCredentials);
    const setCurrent = useAuthStore((s) => s.setCurrent);
    const setToken = useAuthStore((s) => s.setToken);
    const formRef = useRef(null);

    // ✅ 일반 로그인 처리
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setErr('');
        if (!identifier.trim()) return setErr('아이디(또는 이메일)를 입력하세요.');
        if (!password) return setErr('비밀번호를 입력하세요.');

        setLoading(true);
        try {
            const user = validate(identifier, password);
            if (!user) return setErr('계정이 없거나 비밀번호가 일치하지 않습니다.');
            setCurrent(user);
            navigate('/mypage');
        } catch {
            setErr('로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoRegister = () => {
        if (mode !== 'register') {
            setMode('register');
            return;
        }
        navigate('/join');
    };

    const handleLoginButton = () => {
        if (mode !== 'login') {
            setMode('login');
            return;
        }
        const formEl = formRef.current;
        if (!formEl) return;
        if (typeof formEl.requestSubmit === 'function') formEl.requestSubmit();
        else formEl.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    };

    // ✅ 카카오 OAuth 콜백 처리
    useEffect(() => {
        const code = searchParams.get('code');
        if (!code) return;

        (async () => {
            try {
                const body = new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: KAKAO_CLIENT_ID,
                    redirect_uri: KAKAO_REDIRECT_URI,
                    code,
                });

                const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
                    body: body.toString(),
                });

                const token = await tokenRes.json();
                if (!token.access_token) throw new Error('토큰 발급 실패');

                const meRes = await fetch('https://kapi.kakao.com/v2/user/me', {
                    headers: { Authorization: `Bearer ${token.access_token}` },
                });

                const me = await meRes.json();
                if (!me?.id) throw new Error('사용자 정보 조회 실패');

                const nickname =
                    me?.kakao_account?.profile?.nickname ||
                    me?.properties?.nickname ||
                    `kakao_${me.id}`;
                const avatar =
                    me?.kakao_account?.profile?.profile_image_url ||
                    me?.properties?.profile_image ||
                    '/images/icon/human.png';

                const user = {
                    id: `kakao_${me.id}`,
                    provider: 'kakao',
                    username: nickname,
                    nameKo: nickname,
                    avatar,
                    email: me?.kakao_account?.email || '',
                };

                // zustand 저장
                setCurrent(user);
                setToken?.(token.access_token);

                // URL 정리
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, '', cleanUrl);

                navigate('/mypage', { replace: true });
            } catch (e) {
                console.error(e);
                setErr('카카오 로그인 처리 중 오류가 발생했습니다.');
                // URL 정리
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, '', cleanUrl);
            }
        })();
    }, [searchParams, navigate, setCurrent, setToken]);

    const bgVars = {
        '--bg-left': `url('/images/login/bg-left.png')`,
        '--bg-right': `url('/images/login/bg-right.png')`,
    };

    return (
        <div id="login" className={mode === 'register' ? 'is-register' : 'is-login'} style={bgVars}>
            <div className="inner">
                <div className={`login-wrap ${mode === 'register' ? 'is-register' : 'is-login'}`}>
                    <div className="slider" aria-hidden="true" />

                    {/* 왼쪽: 로그인 */}
                    <div
                        className={`login-group left ${mode === 'login' ? 'on' : ''}`}
                        aria-live="polite"
                    >
                        <h2 className="login-group-title">회원 로그인</h2>
                        <h2 className="login-group-subtitle">계정이 있으신가요?</h2>

                        {/* ⬇️ 조건부 렌더링 ❌ 제거 → 항상 보여줌 */}
                        <form className="login-group-form" onSubmit={handleSubmit} ref={formRef}>
                            <input
                                type="text"
                                className="id"
                                placeholder="아이디 또는 이메일"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                autoComplete="username"
                            />
                            <input
                                type="password"
                                className="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                            <button
                                className="button g middle button-login"
                                type="button"
                                onClick={handleLoginButton}
                                aria-pressed={mode === 'login'}
                            >
                                {loading ? '로그인 중…' : '로그인'}
                            </button>
                        </form>

                        {err && <p className="help-text error">{err}</p>}

                        <div className="login-group-find">아이디 찾기 ｜ 비밀번호 찾기</div>

                        <div className="login-sns-icons-wrap" aria-hidden={mode !== 'login'}>
                            <KakaoLoginButton />
                        </div>
                    </div>

                    {/* 오른쪽: 회원가입 */}
                    <div className={`login-group right ${mode === 'register' ? 'on' : ''}`}>
                        <h2 className="login-group-title">회원 가입</h2>
                        <h2 className="login-group-subtitle">계정이 없으신가요?</h2>

                        <button
                            className="button o large button-login"
                            type="button"
                            onClick={handleGoRegister}
                        >
                            통합회원가입 하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

// src/pages/Login.jsx
import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import KakaoLoginButton from '../../components/ui/kakaoLogin/KakaoLoginButton';

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY; // REST API 키
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI; // 로컬/배포 각각 .env.local / .env

const Login = ({ initialMode = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const pickMode = () => {
        const p = (initialMode || '').toLowerCase();
        const s = (location.state?.mode || '').toLowerCase();
        const q = (searchParams.get('mode') || '').toLowerCase();
        const m = p || s || q || 'login';
        return m === 'register' ? 'register' : 'login';
    };

    const [mode, setMode] = useState(pickMode);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = useAuthStore((s) => s.validateCredentials);
    const setCurrent = useAuthStore((s) => s.setCurrent);
    const formRef = useRef(null);

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

    // ✅ URL 쿼리 / state 변경 시 모드 동기화
    useEffect(() => {
        const next = pickMode();
        if (next !== mode) setMode(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, location.state, initialMode]);

    // ✅ 헤더에서 보낸 intent를 "내부 버튼과 동일한 효과"로 실행
    useEffect(() => {
        const intent = location.state?.intent;
        if (!intent) return;

        if (intent === 'register') {
            if (mode !== 'register') {
                setMode('register');
            } else {
                navigate('/join');
            }
        } else if (intent === 'login') {
            if (mode !== 'login') {
                setMode('login');
            } else {
                const formEl = formRef.current;
                if (formEl) {
                    if (typeof formEl.requestSubmit === 'function') formEl.requestSubmit();
                    else
                        formEl.dispatchEvent(
                            new Event('submit', { cancelable: true, bubbles: true })
                        );
                }
            }
        }

        // 실행 후 state 제거(재실행 방지)
        navigate(
            { pathname: location.pathname, search: location.search },
            { replace: true, state: {} }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state, mode]);

    const bgVars = {
        '--bg-left': `url('/images/login/bg-left.png')`,
        '--bg-right': `url('/images/login/bg-right.png')`,
    };
    return (
        <div id="login" className={mode === 'register' ? 'is-register' : 'is-login'} style={bgVars}>
            <div className="inner">
                <div className={`login-wrap ${mode === 'register' ? 'is-register' : 'is-login'}`}>
                    {/* 슬라이더(흰 카드) */}
                    <div className="slider" aria-hidden="true" />

                    {/* 왼쪽: 로그인 */}
                    <div
                        className={`login-group left ${mode === 'login' ? 'on' : ''}`}
                        aria-live="polite"
                    >
                        <h2 className="login-group-title">회원 로그인</h2>
                        <h2 className="login-group-subtitle">계정이 있으신가요?</h2>

                        <form
                            className="login-group-form"
                            onSubmit={handleSubmit}
                            ref={formRef}
                            aria-disabled={mode !== 'login'}
                        >
                            <input
                                type="text"
                                className="id"
                                placeholder="아이디 또는 이메일"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                autoComplete="username"
                                disabled={mode !== 'login'}
                                aria-disabled={mode !== 'login'}
                            />
                            <input
                                type="password"
                                className="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                disabled={mode !== 'login'}
                                aria-disabled={mode !== 'login'}
                            />
                            {/* 버튼은 항상 클릭 가능하지만 내부 로직이 처리함 */}
                            <button
                                className="button g middle button-login"
                                type="button"
                                onClick={handleLoginButton}
                                aria-pressed={mode === 'login'}
                            >
                                {loading ? '로그인 중…' : '로그인'}
                            </button>{' '}
                        </form>

                        {err && <p className="help-text error">{err}</p>}

                        <div className="login-group-find">아이디 찾기 ｜ 비밀번호 찾기</div>

                        <div className="login-sns-icons-wrap" aria-hidden={mode !== 'login'}>
                            {/* <div className="login-sns-icons-item">
                                <img src="/images/icon/google.svg" alt="google" />
                            </div> */}
                            <KakaoLoginButton />
                            {/* <div className="login-sns-icons-item kakao">
                                <img src="/images/icon/kakao.svg" alt="kakao" />
                                <p>카카오톡으로 로그인</p>
                            </div> */}
                            {/* <div className="login-sns-icons-item">
                                <img src="/images/icon/apple.svg" alt="apple" />
                            </div> */}
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

                        <div className="login-sns-icons-wrap" aria-hidden={mode !== 'register'}>
                            {/* <div className="login-sns-icons-item">
                                <img src="/images/icon/google.svg" alt="google" />
                            </div> */}
                            {/* <div className="login-sns-icons-item kakao">
                                <img src="/images/icon/kakao.svg" alt="kakao" />
                                <p>카카오톡으로 로그인</p>
                            </div> */}
                            {/* <div className="login-sns-icons-item">
                                <img src="/images/icon/apple.svg" alt="apple" />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

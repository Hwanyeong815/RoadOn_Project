// src/pages/Login.jsx
import React, { useState, useRef } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import KakaoLoginButton from '../../components/ui/kakaoLogin/KakaoLoginButton';

const Login = () => {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = useAuthStore((s) => s.validateCredentials);
    const setCurrent = useAuthStore((s) => s.setCurrent);
    const navigate = useNavigate();

    // form ref so we can trigger submit programmatically
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

    // 오른쪽 버튼: 1번 클릭 → 슬라이드, 2번 클릭 → /join 이동
    const handleGoRegister = () => {
        if (mode !== 'register') {
            setMode('register');
            return;
        }
        navigate('/join');
    };

    // 왼쪽 버튼: 첫 클릭이면 패널 활성화, 활성 상태면 폼 submit
    const handleLoginButton = () => {
        if (mode !== 'login') {
            setMode('login');
            return;
        }
        // active 상태면 폼 제출 (requestSubmit 지원 브라우저 대상)
        formRef.current?.requestSubmit?.() ??
            formRef.current?.dispatchEvent(new Event('submit', { cancelable: true }));
    };
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

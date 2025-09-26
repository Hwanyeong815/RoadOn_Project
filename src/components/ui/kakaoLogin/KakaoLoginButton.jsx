// src/components/ui/kakaoLogin/KakaoLoginButton.jsx
import React from 'react';

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const KakaoLoginButton = ({ className = 'login-sns-icons-item kakao', children }) => {
    const handleClick = () => {
        const url =
            `https://kauth.kakao.com/oauth/authorize?response_type=code` +
            `&client_id=${encodeURIComponent(KAKAO_CLIENT_ID)}` +
            `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`;
        window.location.href = url;
    };

    return (
        <button type="button" id="kakaoBtn" className={className} onClick={handleClick}>
            {children ?? (
                <>
                    <img src="/images/icon/kakao.svg" alt="kakao" />
                    <p>카카오톡으로 로그인</p>
                </>
            )}
        </button>
    );
};

export default KakaoLoginButton;

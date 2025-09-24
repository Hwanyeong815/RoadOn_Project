import React, { useEffect } from 'react';
import './style.scss';
const KakaoLoginButton = () => {
    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
            console.log('Kakao initialized:', window.Kakao.isInitialized());
        }
    }, []);

    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            alert('카카오 SDK가 로드되지 않았습니다.');
            return;
        }

        window.Kakao.Auth.login({
            success: function (authObj) {
                console.log('로그인 성공', authObj);
                // 예: authObj.access_token 서버로 보내서 사용자 정보 요청 등 처리
            },
            fail: function (err) {
                console.error('로그인 실패', err);
            },
        });
    };

    return (
        <button id="kakaoBtn" onClick={handleKakaoLogin}>
            카카오 로그인
        </button>
    );
};

export default KakaoLoginButton;

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const kakaoAuthUrl =
    `https://kauth.kakao.com/oauth/authorize?response_type=code` +
    `&client_id=${encodeURIComponent(REST_API_KEY)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

window.location.href = kakaoAuthUrl;

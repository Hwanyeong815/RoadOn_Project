const isLocal = window.location.hostname === 'localhost';
console.log(isLocal);
export const KAKAO_REDIRECT_URI = isLocal
    ? 'http://localhost:5173/oauth/'
    : 'https://xxx.vercel.app/oauth/';
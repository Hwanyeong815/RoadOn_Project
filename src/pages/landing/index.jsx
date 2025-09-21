// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom';
import './style.scss';

const Landing = () => {
    const navigate = useNavigate();
    const go = (path) => navigate(path);

    return (
        <section className="landingpage">
            <div className="inner">
                {/* ✅ 외부 링크 (새 탭) */}
                <a
                    className="card vion"
                    href="https://ottprojectvion.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="content">
                        <h2>VI:0N</h2>
                        <strong>영화 같은 몰입의 시작</strong>
                        <p>장면 속으로 들어가고 싶다면?</p>
                    </div>
                </a>

                {/* 내부 라우팅 유지 */}
                <div className="card roadon" onClick={() => go('/')}>
                    <div className="content">
                        <h2>ROAD:ON</h2>
                        <strong>영화 같은 여행의 시작</strong>
                        <p>장면 속으로 떠나고 싶다면?</p>
                    </div>
                </div>

                <div className="symbol">
                    <img
                        src="/images/landing/default_logo.png"
                        alt="symbol"
                        className="default-logo"
                    />
                    <img src="/images/landing/hover_logo.png" alt="symbol" className="hover-logo" />
                </div>
            </div>
        </section>
    );
};

export default Landing;

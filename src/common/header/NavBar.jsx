// src/components/NavBar.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // 경로에 맞게 조정

const NavBar = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const setCurrent = useAuthStore((s) => s.setCurrent);
    const setToken = useAuthStore((s) => s.setToken); // 토큰 제거용
    const navigate = useNavigate();

    const handleLogout = () => {
        setCurrent(null);
        setToken && setToken(null);
        navigate('/');
    };

    const avatarSrc = currentUser?.avatar || '/images/icon/human.png';
    const displayName = currentUser?.nameKo || currentUser?.username || '';

    return (
        <>
            <nav className="nav">
                <ul className="nav-menu">
                    <li>
                        <Link to="/hotels">
                            <img src="/images/icon/hotel-g.svg" alt="hotel" />
                            숙소
                        </Link>
                    </li>
                    <li>
                        <Link to="/tour" className="tour">
                            <img src="/images/icon/tour-g.svg" alt="tour" />
                            씬투어
                        </Link>
                    </li>
                    <li>
                        <Link to="/airport">
                            <img src="/images/icon/airport-g.svg" alt="air" />
                            항공
                        </Link>
                    </li>
                </ul>

                <ul className="my-menu">
                    {currentUser ? (
                        <>
                            <li>
                                <Link to="/myPage" className="profile-link">
                                    <span>{displayName}</span>님 환영합니다
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/logout"
                                    type="button"
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login?mode=login"
                                    state={{ mode: 'login', intent: 'login', ts: Date.now() }} // ts로 state 변화 보장
                                >
                                    <img src="/images/icon/human.png" alt="human" />
                                    로그인
                                </Link>
                            </li>
                            <li className="line">
                                <Link
                                    to="/login?mode=register"
                                    state={{ mode: 'register', intent: 'register', ts: Date.now() }}
                                >
                                    회원가입
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default NavBar;

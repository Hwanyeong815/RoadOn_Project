// src/components/NavBar.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore'; // 경로에 맞게 조정

const NavBar = () => {
    const currentUser = useAuthStore((s) => s.currentUser);
    const setCurrent = useAuthStore((s) => s.setCurrent);
    const setToken = useAuthStore((s) => s.setToken); // 토큰 제거용
    const navigate = useNavigate();

    // arrow function 스타일로 핸들러
    const handleLogout = () => {
        // store에서 현재 사용자 제거 -> isLoggedIn도 false로 바뀜
        setCurrent(null);

        // 토큰도 제거 (있다면)
        setToken && setToken(null);

        // 필요하면 로컬스토리지 등 추가 정리: (store에 clearAll이 있으면 사용 가능)
        // useAuthStore.getState().clearAll();

        // 로그아웃 후 홈으로 이동
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
                            <li className="none-line">
                                <Link to="/login">
                                    <img src="/images/icon/human.png" alt="human" />
                                    로그인 ｜ 회원가입
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

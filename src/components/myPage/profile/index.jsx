// src/components/myPage/profile.jsx
import './style.scss';
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import useRewardStore from '../../../store/rewardStore';

const Profile = ({ activeSection = null, onNavigate = () => {} }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useAuthStore((s) => s.currentUser);
    const { getCoupons, getPoints } = useRewardStore();

    const handleKey = (e, target, opts = {}) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateOrLogin(target, opts);
        }
    };

    const navigateOrLogin = (target, opts = {}) => {
        if (currentUser) {
            onNavigate(target, opts);
        } else {
            navigate('/login');
        }
    };

    const goEditProfile = () => {
        if (currentUser) {
            navigate('/editProfile');
        } else {
            navigate('/login', { state: { from: location } });
        }
    };

    const handleKeyEditProfile = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goEditProfile();
        }
    };

    const displayName = currentUser?.nameKo || currentUser?.username || '게스트';
    const avatarSrc = currentUser?.avatar || 'images/myPage/profile-img.png';

    // ✅ 쿠폰/포인트 연동
    const couponCount = currentUser
        ? getCoupons(currentUser.id).filter((c) => !c.disabled).length
        : 0;

    const userPoints = currentUser ? getPoints(currentUser.id) : { items: [] };
    const points = userPoints.items
        ? userPoints.items.reduce((sum, it) => sum + (Number(it.amount) || 0), 0)
        : 0;

    const gradeLabel = currentUser?.grade ?? 'Guest';
    const gradeInitial = (gradeLabel && String(gradeLabel)[0]) || 'G';

    return (
        <section id="profile">
            <h2 className="mypage-title">마이페이지</h2>

            <article className="profile-name-wrap">
                <div className="profile-img-wrap">
                    <img src={avatarSrc} alt="profile-img" />
                </div>

                <div className="profile-name-zone">
                    <strong>
                        {displayName}
                        <span>님</span>
                    </strong>

                    <div
                        className="grade"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigateOrLogin('grade')}
                        onKeyDown={(e) => handleKey(e, 'grade')}
                    >
                        <div className="grade-circle">
                            <p>{gradeInitial}</p>
                        </div>
                        <p>
                            {gradeLabel} 등급
                            <em>
                                <IoIosArrowForward />
                            </em>
                        </p>
                    </div>
                </div>

                <div className="profile-coupons-wrap">
                    <div
                        className="profile-coupon box"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigateOrLogin('reward', { tab: 'coupons' })}
                        onKeyDown={(e) => handleKey(e, 'reward', { tab: 'coupons' })}
                    >
                        <div className="head">
                            <img src="" alt="" />
                            <p>
                                쿠폰
                                <em>
                                    <IoIosArrowForward />
                                </em>
                            </p>
                        </div>
                        <strong>
                            {couponCount}
                            <span>개</span>
                        </strong>
                    </div>

                    <div
                        className="profile-points box"
                        role="button"
                        tabIndex={0}
                        onClick={() => navigateOrLogin('reward', { tab: 'points' })}
                        onKeyDown={(e) => handleKey(e, 'reward', { tab: 'points' })}
                    >
                        <div className="head">
                            <img src="" alt="" />
                            <p>
                                적립금
                                <em>
                                    <IoIosArrowForward />
                                </em>
                            </p>
                        </div>
                        <strong>
                            {points.toLocaleString()}
                            <span>P</span>
                        </strong>
                    </div>
                </div>
            </article>

            <article className="profile-menu-wrap">
                <div className="profile-menu-reserve">
                    <h3 className="category-title">예약 내역</h3>
                    <div className="category-con">
                        <p
                            className={`menu-item ${
                                activeSection === 'reserve' ? 'is-active' : ''
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigateOrLogin('reserve')}
                            onKeyDown={(e) => handleKey(e, 'reserve')}
                        >
                            숙소
                        </p>

                        <p
                            className={`menu-item ${
                                activeSection === 'reserve' ? 'is-active' : ''
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigateOrLogin('reserve')}
                            onKeyDown={(e) => handleKey(e, 'reserve')}
                        >
                            체험·투어
                        </p>

                        <p
                            className={`menu-item none-line ${
                                activeSection === 'reserve' ? 'is-active' : ''
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigateOrLogin('reserve')}
                            onKeyDown={(e) => handleKey(e, 'reserve')}
                        >
                            항공
                        </p>
                    </div>
                </div>

                <div className="profile-menu-user">
                    <h3 className="category-title">나의 정보 관리</h3>
                    <div className="category-con">
                        <p
                            className="menu-item"
                            role="button"
                            tabIndex={0}
                            onClick={() => onNavigate(null)}
                        >
                            내 후기
                        </p>
                        <p
                            className="menu-item"
                            role="button"
                            tabIndex={0}
                            onClick={() => onNavigate(null)}
                        >
                            내 문의 내역
                        </p>
                        <p
                            className={`menu-item none-line ${
                                activeSection === 'wishlist' ? 'is-active' : ''
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigateOrLogin('wishlist')}
                            onKeyDown={(e) => handleKey(e, 'wishlist')}
                        >
                            찜 목록
                        </p>

                        <p
                            className="menu-item none-line"
                            role="button"
                            tabIndex={0}
                            onClick={goEditProfile}
                            onKeyDown={handleKeyEditProfile}
                        >
                            회원 정보 변경
                        </p>
                    </div>
                </div>

                <div className="profile-menu-support">
                    <h3 className="category-title">고객센터</h3>
                    <div className="category-con">
                        <p
                            className={`menu-item ${
                                activeSection === 'support' ? 'is-active' : ''
                            }`}
                            role="button"
                            tabIndex={0}
                            onClick={() => navigateOrLogin('support', { tab: 'notice' })}
                            onKeyDown={(e) => handleKey(e, 'support', { tab: 'notice' })}
                        >
                            공지사항
                        </p>

                        <p
                            className="menu-item"
                            role="button"
                            tabIndex={0}
                            onClick={() => navigateOrLogin('support', { tab: 'faq' })}
                            onKeyDown={(e) => handleKey(e, 'support', { tab: 'faq' })}
                        >
                            자주하는질문
                        </p>

                        <p
                            className="menu-item none-line"
                            role="button"
                            tabIndex={0}
                            onClick={() => navigateOrLogin('support', { tab: 'guide' })}
                            onKeyDown={(e) => handleKey(e, 'support', { tab: 'guide' })}
                        >
                            고객센터 안내
                        </p>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default Profile;

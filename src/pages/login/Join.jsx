// src/pages/Join.jsx
import { useState, useMemo } from 'react';
import './style.scss';
import useAuthStore from '../../store/authStore';
import useRewardStore from '../../store/rewardStore';
import JoinConsent from '../../components/login/join/JoinConsent';

const Join = () => {
    const [activeField, setActiveField] = useState(null);
    const [gender, setGender] = useState('male');
    const [isSmsRequested, setIsSmsRequested] = useState(false);
    const [consentOk, setConsentOk] = useState(false);

    const [form, setForm] = useState({
        username: '',
        lastNameEn: '',
        firstNameEn: '',
        nameKo: '',
        email: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        phoneCode: '',
        birth: '',
        address: '',
    });

    const onFocus = (key) => () => setActiveField(key);
    const onBlur = () => setActiveField(null);
    const onChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

    // 간단한 유효성: 아이디 형식
    const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;
    const isUsernameValid = useMemo(
        () => (form.username ? usernameRegex.test(form.username) : true),
        [form.username]
    );

    const handleRequestCode = () => setIsSmsRequested(true);

    // auth store
    const addUser = useAuthStore((s) => s.addUser);
    const setCurrent = useAuthStore((s) => s.setCurrent);

    // reward store
    const addPointItem = useRewardStore((s) => s.addPointItem);
    const claimWelcomePack = useRewardStore((s) => s.claimWelcomePack);
    const grantSignupBonusAndWelcome = useRewardStore((s) => s.grantSignupBonusAndWelcome);

    // KST 오늘(YYYY-MM-DD)
    const todayKST = () => {
        try {
            return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 10);
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    };

    // 개발용 아바타 빌더 (간단)
    const buildAvatar = (name) => '/images/myPage/profile-img.png';

    const handleSubmit = (e) => {
        e.preventDefault();

        // 최소 유효성
        if (!form.email) return alert('이메일을 입력하세요.');
        if (!isUsernameValid)
            return alert('아이디 형식이 맞지 않습니다. 영문/숫자/언더스코어 5~20자');
        if (form.password && form.password !== form.passwordConfirm) {
            return alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        }
        if (!consentOk) return alert('필수 약관에 모두 동의해 주세요.');

        // 저장할 user 객체
        const user = {
            username: form.username || `${form.firstNameEn}${form.lastNameEn}`.toLowerCase(),
            nameKo: form.nameKo,
            firstNameEn: form.firstNameEn,
            lastNameEn: form.lastNameEn,
            email: form.email,
            phone: form.phone,
            birth: form.birth,
            gender,
            address: form.address,
            avatar: buildAvatar(form.nameKo || form.username),
            grade: 'Family',
            // 요약 필드(points/couponCount)는 스토어 계산과 충돌될 수 있으니 생략 권장
            reserveCount: 0,
            wishlistCount: 0,
        };

        // 가입 처리
        const created = addUser(user);
        setCurrent(created);

        // 🔹 가입 보너스 5,000P(오늘) + 웰컴팩 즉시 지급
        // 1) 원샷 액션이 있으면 그것부터
        if (grantSignupBonusAndWelcome) {
            grantSignupBonusAndWelcome(created.id, 5);
        } else {
            // 2) 없으면 수동 지급
            addPointItem(created.id, {
                date: todayKST(),
                type: '가입 축하 포인트',
                amount: 5000,
                status: '적립',
            });
            claimWelcomePack(created.id, 5);
        }

        alert('가입(테스트용) 완료되었습니다. 웰컴 혜택이 지급되었습니다.');
        console.log('created user:', created);
        // 필요 시 navigate('/mypage')
    };

    return (
        <main id="Join">
            <div className="inner">
                <div className="title-wrap">
                    <h2 className="title">회원가입</h2>
                </div>
                <div className="title-des">
                    <p>필수입력항목</p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    {/* 이메일 */}
                    <div className="form-group">
                        <div className="label">
                            이메일 <span></span>
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일 주소를 입력하세요."
                            autoComplete="email"
                            inputMode="email"
                            value={form.email}
                            onChange={onChange('email')}
                            onFocus={onFocus('email')}
                            onBlur={onBlur}
                        />
                    </div>

                    {/* 영문 이름 */}
                    <div className="form-group en two">
                        <div className="label">
                            영문 이름 <span />
                        </div>
                        <div className="fields-2col">
                            <div className="field">
                                <div className="sublabel">성</div>
                                <input
                                    type="text"
                                    name="lastNameEn"
                                    placeholder="hong"
                                    autoComplete="family-name"
                                    value={form.lastNameEn}
                                    onChange={onChange('lastNameEn')}
                                    onFocus={onFocus('lastNameEn')}
                                    onBlur={onBlur}
                                />
                            </div>
                            <div className="field">
                                <div className="sublabel">이름</div>
                                <input
                                    type="text"
                                    name="firstNameEn"
                                    placeholder="gil-dong"
                                    autoComplete="given-name"
                                    value={form.firstNameEn}
                                    onChange={onChange('firstNameEn')}
                                    onFocus={onFocus('firstNameEn')}
                                    onBlur={onBlur}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 이름 */}
                    <div className="form-group">
                        <div className="label">
                            이름 <span></span>
                        </div>
                        <input
                            type="text"
                            name="nameKo"
                            placeholder="홍길동"
                            autoComplete="name"
                            value={form.nameKo}
                            onChange={onChange('nameKo')}
                            onFocus={onFocus('nameKo')}
                            onBlur={onBlur}
                        />
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <div className="label">
                            비밀번호 <span></span>
                        </div>
                        <div className="input-wrap">
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호를 입력하세요."
                                autoComplete="new-password"
                                value={form.password}
                                onChange={onChange('password')}
                                onFocus={onFocus('password')}
                                onBlur={onBlur}
                            />
                            {activeField === 'password' && (
                                <p className="help-text">
                                    8~16자리, 영문 대/소문자·숫자·특수문자 4가지 조합을 입력해주세요
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <div className="label">
                            비밀번호 확인 <span></span>
                        </div>
                        <div className="input-wrap">
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="비밀번호를 다시 입력하세요."
                                autoComplete="new-password"
                                value={form.passwordConfirm}
                                onChange={onChange('passwordConfirm')}
                                onFocus={onFocus('passwordConfirm')}
                                onBlur={onBlur}
                            />
                            {activeField === 'passwordConfirm' && (
                                <p className="help-text">비밀번호를 일치하게 해주세요</p>
                            )}
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div className="form-group phone">
                        <div className="label">
                            연락처 <span></span>
                        </div>
                        <div className="input-wrap">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="01012345678"
                                inputMode="numeric"
                                autoComplete="tel-national"
                                value={form.phone}
                                onChange={onChange('phone')}
                                onFocus={onFocus('phone')}
                                onBlur={onBlur}
                            />
                            {activeField === 'phone' && (
                                <p className="help-text">'-' 를 제외한 숫자만 적어주세요</p>
                            )}
                        </div>
                        <button type="button" className="button" onClick={handleRequestCode}>
                            인증번호 받기
                        </button>
                    </div>

                    {/* 휴대폰 인증 */}
                    {isSmsRequested && (
                        <div className="form-group phoneAuth">
                            <div className="label">
                                휴대폰 인증 <span></span>
                            </div>
                            <input
                                type="text"
                                name="phoneCode"
                                placeholder="인증번호 입력"
                                inputMode="numeric"
                                value={form.phoneCode}
                                onChange={onChange('phoneCode')}
                                onFocus={onFocus('phoneCode')}
                                onBlur={onBlur}
                            />
                            <button type="button" className="button">
                                인증 완료
                            </button>
                        </div>
                    )}

                    {/* 생년월일 + 성별 */}
                    <div className="form-row">
                        <div className="form-group">
                            <div className="label">
                                생년월일<span></span>
                            </div>
                            <input
                                type="text"
                                name="birth"
                                placeholder="YYYYMMDD"
                                inputMode="numeric"
                                maxLength={8}
                                value={form.birth}
                                onChange={onChange('birth')}
                                onFocus={onFocus('birth')}
                                onBlur={onBlur}
                            />
                        </div>

                        <div className="form-group gender">
                            <div className="gender-group">
                                <label className={gender === 'male' ? 'active' : ''}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === 'male'}
                                        onChange={() => setGender('male')}
                                    />
                                    남성
                                </label>
                                <label className={gender === 'female' ? 'active' : ''}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === 'female'}
                                        onChange={() => setGender('female')}
                                    />
                                    여성
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 주소 */}
                    <div className="form-group">
                        <label className="label">주소</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="서울시 강남구 서초동"
                            autoComplete="street-address"
                            value={form.address}
                            onChange={onChange('address')}
                            onFocus={onFocus('address')}
                            onBlur={onBlur}
                        />
                    </div>

                    <JoinConsent onRequiredChange={(v) => setConsentOk(Boolean(v))} />

                    {/* 제출 */}
                    <div className="form-actions">
                        <button type="submit" className="button g middle go" disabled={!consentOk}>
                            회원가입
                        </button>
                        <button
                            type="button"
                            className="button middle back"
                            onClick={() => window.history.back()}
                        >
                            돌아가기
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Join;

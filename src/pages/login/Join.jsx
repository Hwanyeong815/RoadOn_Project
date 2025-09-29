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
    const [isSmsVerified, setIsSmsVerified] = useState(false);
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

    const [errors, setErrors] = useState({});

    const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;

    const validateField = (key, value) => {
        switch (key) {
            case 'email':
                if (!value) return '이메일을 입력하세요.';
                if (!value.includes('@')) return '올바른 이메일 주소를 입력하세요.';
                break;
            case 'username':
                if (!value) return '아이디를 입력하세요.';
                if (!usernameRegex.test(value)) return '영문/숫자/언더스코어 5~20자';
                break;
            case 'nameKo':
                if (!value) return '이름을 입력하세요.';
                break;
            case 'password':
                if (!value) return '비밀번호를 입력하세요.';
                if (form.passwordConfirm && value !== form.passwordConfirm)
                    return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
                break;
            case 'passwordConfirm':
                if (!value) return '비밀번호 확인을 입력하세요.';
                if (form.password && value !== form.password)
                    return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
                break;
            case 'phone':
                if (!value) return '휴대폰 번호를 입력하세요.';
                break;
            case 'phoneCode':
                if (!isSmsVerified) return '휴대폰 인증을 완료해주세요.';
                break;
            case 'birth':
                if (!value) return '생년월일을 입력하세요.';
                break;
            case 'address':
                if (!value) return '주소를 입력하세요.';
                break;
            default:
                return '';
        }
        return '';
    };

    const onChange = (key) => (e) => {
        const value = e.target.value;
        setForm((s) => ({ ...s, [key]: value }));
        const errorMsg = validateField(key, value);
        setErrors((prev) => ({ ...prev, [key]: errorMsg }));
    };

    const onFocus = (key) => () => {
        setActiveField(key);
        const errorMsg = validateField(key, form[key]);
        setErrors((prev) => ({ ...prev, [key]: errorMsg }));
    };

    const onBlur = (key) => () => {
        setActiveField(null);
        const errorMsg = validateField(key, form[key]);
        setErrors((prev) => ({ ...prev, [key]: errorMsg }));
    };

    const handleRequestCode = () => {
        alert('인증번호: 1234');
        setIsSmsRequested(true);
    };

    const handleVerifyCode = () => {
        if (form.phoneCode === '1234') {
            setIsSmsVerified(true);
            alert('휴대폰 인증이 완료되었습니다.');
        } else {
            setIsSmsVerified(false);
            alert('인증번호가 올바르지 않습니다.');
        }
    };

    // store
    const addUser = useAuthStore((s) => s.addUser);
    const setCurrent = useAuthStore((s) => s.setCurrent);
    const addPointItem = useRewardStore((s) => s.addPointItem);
    const claimWelcomePack = useRewardStore((s) => s.claimWelcomePack);
    const grantSignupBonusAndWelcome = useRewardStore((s) => s.grantSignupBonusAndWelcome);

    const todayKST = () => {
        try {
            return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).slice(0, 10);
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    };

    const buildAvatar = () => '/images/myPage/profile-img.png';

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};
        Object.keys(form).forEach((key) => {
            const msg = validateField(key, form[key]);
            if (msg) newErrors[key] = msg;
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0 || !consentOk) {
            alert('필수항목을 확인해주세요.');
            return;
        }

        const user = {
            username: form.username,
            nameKo: form.nameKo,
            firstNameEn: form.firstNameEn,
            lastNameEn: form.lastNameEn,
            email: form.email,
            phone: form.phone,
            birth: form.birth,
            gender,
            address: form.address,
            avatar: buildAvatar(),
            grade: 'Family',
            reserveCount: 0,
            wishlistCount: 0,
        };

        const created = addUser(user);
        setCurrent(created);

        if (grantSignupBonusAndWelcome) {
            grantSignupBonusAndWelcome(created.id, 5);
        } else {
            addPointItem(created.id, {
                date: todayKST(),
                type: '가입 축하 포인트',
                amount: 5000,
                status: '적립',
            });
            claimWelcomePack(created.id, 5);
        }

        alert('가입 완료! 웰컴 혜택이 지급되었습니다.');
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
                            이메일 <span />
                        </div>
                        <div className="form-line">
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일 주소를 입력하세요."
                                autoComplete="email"
                                value={form.email}
                                onChange={onChange('email')}
                                onFocus={onFocus('email')}
                                onBlur={onBlur('email')}
                            />
                            {(activeField === 'email' || errors.email) && errors.email && (
                                <p className="help-text">{errors.email}</p>
                            )}
                        </div>
                    </div>
                    {/* 영문 이름 */}
                    <div className="form-group en two">
                        <div className="label">영문 이름</div>
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
                                />
                            </div>
                        </div>
                    </div>
                    {/* 이름 */}
                    <div className="form-group">
                        <div className="label">이름</div>
                        <div className="form-line">
                            <input
                                type="text"
                                name="nameKo"
                                placeholder="홍길동"
                                value={form.nameKo}
                                onChange={onChange('nameKo')}
                            />
                        </div>
                    </div>
                    {/* 비밀번호 */}
                    <div className="form-group">
                        <div className="label">
                            비밀번호 <span />
                        </div>
                        <div className="form-line">
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호를 입력하세요."
                                autoComplete="new-password"
                                value={form.password}
                                onChange={onChange('password')}
                                onFocus={onFocus('password')}
                                onBlur={onBlur('password')}
                            />
                            {(activeField === 'password' || errors.password) && errors.password && (
                                <p className="help-text">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <div className="label">
                            비밀번호 확인 <span />
                        </div>
                        <div className="form-line">
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="비밀번호를 다시 입력하세요."
                                autoComplete="new-password"
                                value={form.passwordConfirm}
                                onChange={onChange('passwordConfirm')}
                                onFocus={onFocus('passwordConfirm')}
                                onBlur={onBlur('passwordConfirm')}
                            />
                            {(activeField === 'passwordConfirm' || errors.passwordConfirm) &&
                                errors.passwordConfirm && (
                                    <p className="help-text">{errors.passwordConfirm}</p>
                                )}
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div className="form-group phone">
                        <div className="label">
                            연락처 <span />
                        </div>
                        <div className="form-line">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="01012345678"
                                value={form.phone}
                                onChange={onChange('phone')}
                                onFocus={onFocus('phone')}
                                onBlur={onBlur('phone')}
                            />
                            {(activeField === 'phone' || errors.phone) && errors.phone && (
                                <p className="help-text">{errors.phone}</p>
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
                                휴대폰 인증 <span />
                            </div>
                            <div className="form-line">
                                <input
                                    type="text"
                                    name="phoneCode"
                                    placeholder="인증번호 입력"
                                    value={form.phoneCode}
                                    onChange={onChange('phoneCode')}
                                    onFocus={onFocus('phoneCode')}
                                    onBlur={onBlur('phoneCode')}
                                />

                                {(activeField === 'phoneCode' || errors.phoneCode) &&
                                    errors.phoneCode && (
                                        <p className="help-text">{errors.phoneCode}</p>
                                    )}
                            </div>
                            <button
                                type="button"
                                className={`button ${isSmsVerified ? '' : 'disabled'}`}
                                style={{
                                    pointerEvents: isSmsVerified ? 'auto' : 'none',
                                    opacity: isSmsVerified ? 1 : 0.5,
                                }}
                                onClick={handleVerifyCode}
                            >
                                인증 완료
                            </button>
                        </div>
                    )}

                    {/* 생년월일 + 성별 */}
                    <div className="form-row">
                        <div className="form-group">
                            <div className="label">생년월일</div>
                            <div className="form-line">
                                <input
                                    type="text"
                                    name="birth"
                                    placeholder="YYYYMMDD"
                                    inputMode="numeric"
                                    maxLength={8}
                                    value={form.birth}
                                    onChange={onChange('birth')}
                                    onFocus={onFocus('birth')}
                                    onBlur={onBlur('birth')}
                                />
                                {(activeField === 'birth' || errors.birth) && errors.birth && (
                                    <p className="help-text">{errors.birth}</p>
                                )}
                            </div>
                        </div>

                        <div className="form-group gender">
                            <div className="gender-group" role="radiogroup" aria-label="성별">
                                <label
                                    className={`gender-label ${gender === 'male' ? 'active' : ''}`}
                                    htmlFor="gender-male"
                                    onClick={() => setGender('male')}
                                >
                                    <input
                                        id="gender-male"
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === 'male'}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    <span className="gender-label-text">남성</span>
                                </label>

                                <label
                                    className={`gender-label ${
                                        gender === 'female' ? 'active' : ''
                                    }`}
                                    htmlFor="gender-female"
                                    onClick={() => setGender('female')}
                                >
                                    <input
                                        id="gender-female"
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === 'female'}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    <span className="gender-label-text">여성</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* 주소 */}
                    <div className="form-group">
                        <div className="label">
                            주소 <span />
                        </div>
                        <div className="form-line">
                            <input
                                type="text"
                                name="address"
                                placeholder="서울시 강남구 서초동"
                                value={form.address}
                                onChange={onChange('address')}
                                onFocus={onFocus('address')}
                                onBlur={onBlur('address')}
                            />
                            {(activeField === 'address' || errors.address) && errors.address && (
                                <p className="help-text">{errors.address}</p>
                            )}
                        </div>
                    </div>

                    <JoinConsent onRequiredChange={(v) => setConsentOk(Boolean(v))} />

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

// src/pages/profile/EditProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.scss';
import useAuthStore from '../../../store/authStore';

const EditProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = useAuthStore((s) => s.currentUser ?? s.current ?? s.user ?? null);
    const updateUser = useAuthStore((s) => s.updateUser ?? s.editUser ?? s.addUser ?? null);
    const setCurrent = useAuthStore((s) => s.setCurrent ?? s.setCurrentUser ?? (() => null));

    const [isReady, setIsReady] = useState(false);
    const [gender, setGender] = useState('male');
    const [activeField, setActiveField] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        username: '',
        lastNameEn: '',
        firstNameEn: '',
        nameKo: '',
        email: '',
        password: '',
        passwordConfirm: '',
        phone: '',
        birth: '',
        address: '',
    });

    const normalizeGender = (g) => {
        if (!g) return 'male';
        const gg = String(g).trim().toLowerCase();
        if (gg === 'male' || gg.startsWith('m')) return 'male';
        if (gg === 'female' || gg.startsWith('f')) return 'female';
        return 'male';
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/login', { state: { from: location }, replace: true });
            return;
        }
        setForm({
            username: currentUser.username ?? '',
            lastNameEn: currentUser.lastNameEn ?? '',
            firstNameEn: currentUser.firstNameEn ?? '',
            nameKo: currentUser.nameKo ?? '',
            email: currentUser.email ?? '',
            password: '',
            passwordConfirm: '',
            phone: currentUser.phone ?? '',
            birth: currentUser.birth ?? '',
            address: currentUser.address ?? '',
        });
        setGender(normalizeGender(currentUser.gender));
        setIsReady(true);
    }, [currentUser, navigate, location]);

    const validateField = (key, value) => {
        switch (key) {
            case 'email':
                if (!value) return '이메일을 입력하세요.';
                if (!value.includes('@')) return '올바른 이메일 주소를 입력하세요.';
                break;
            case 'nameKo':
                if (!value) return '이름을 입력하세요.';
                break;
            case 'passwordConfirm':
                if (form.password && value !== form.password)
                    return '비밀번호와 확인이 일치하지 않습니다.';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        Object.keys(form).forEach((key) => {
            const msg = validateField(key, form[key]);
            if (msg) newErrors[key] = msg;
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            alert('필수항목을 확인해주세요.');
            return;
        }

        const payload = {
            ...currentUser,
            username: form.username || currentUser.username,
            nameKo: form.nameKo,
            firstNameEn: form.firstNameEn,
            lastNameEn: form.lastNameEn,
            email: form.email,
            phone: form.phone,
            birth: form.birth,
            gender,
            address: form.address,
            avatar: currentUser?.avatar ?? '/images/myPage/profile-img.png',
            ...(form.password ? { password: form.password } : {}),
        };

        try {
            const result = updateUser ? await Promise.resolve(updateUser(payload)) : null;
            if (setCurrent) setCurrent(result ?? payload);
            alert('프로필이 저장되었습니다.');
            navigate('/mypage');
        } catch (err) {
            console.error('EditProfile save error:', err);
            alert('프로필 저장 중 오류가 발생했습니다.');
        }
    };

    if (!isReady) {
        return (
            <main id="EditProfile">
                <div className="inner">
                    <p>로딩 중... (로그인 상태 여부 확인)</p>
                </div>
            </main>
        );
    }

    return (
        <main id="EditProfile">
            <div className="inner">
                <div className="title-wrap">
                    <h2 className="title">회원정보 변경</h2>
                </div>
                <div className="title-des">
                    <p>필요한 정보만 수정 후 저장하세요.</p>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    {/* 이메일 */}
                    <div className="form-group">
                        <div className="label">이메일</div>
                        <div className="form-line">
                            <input
                                type="email"
                                name="email"
                                placeholder="이메일 주소를 입력하세요."
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
                                onFocus={onFocus('nameKo')}
                                onBlur={onBlur('nameKo')}
                            />
                            {(activeField === 'nameKo' || errors.nameKo) && errors.nameKo && (
                                <p className="help-text">{errors.nameKo}</p>
                            )}
                        </div>
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <div className="label">비밀번호 (변경 시만 입력)</div>
                        <div className="form-line">
                            <input
                                type="password"
                                name="password"
                                placeholder="새 비밀번호를 입력하세요."
                                value={form.password}
                                onChange={onChange('password')}
                                onFocus={onFocus('password')}
                                onBlur={onBlur('password')}
                            />
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <div className="label">비밀번호 확인</div>
                        <div className="form-line">
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="비밀번호를 다시 입력하세요."
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
                        <div className="label">연락처</div>
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
                        </div>
                    </div>

                    {/* 생년월일 + 성별 */}
                    <div className="form-row">
                        <div className="form-group">
                            <div className="label">생년월일</div>
                            <div className="form-line">
                                <input
                                    type="text"
                                    name="birth"
                                    placeholder="YYYYMMDD"
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
                        <div className="label">주소</div>
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
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="button g middle go">
                            저장
                        </button>
                        <button
                            type="button"
                            className="button middle back"
                            onClick={() => navigate(-1)}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default EditProfile;

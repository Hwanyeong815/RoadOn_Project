// src/pages/profile/EditProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './style.scss';
import useAuthStore from '../../../store/authStore';

const EditProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 안전한 사용자 조회 (스토어마다 키명이 다를 수 있으므로 모두 검사)
    const currentUser = useAuthStore((s) => s.currentUser ?? s.current ?? s.user ?? null);
    // 스토어 업데이트 함수들 (이름이 다를 경우를 대비)
    const updateUser = useAuthStore((s) => s.updateUser ?? s.editUser ?? s.addUser ?? null);
    const setCurrent = useAuthStore((s) => s.setCurrent ?? s.setCurrentUser ?? (() => null));

    const [isReady, setIsReady] = useState(false);
    const [gender, setGender] = useState('male');
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

    // 유틸: 성별 정규화
    const normalizeGender = (g) => {
        if (!g) return 'male';
        const gg = String(g).trim().toLowerCase();
        if (gg === 'male' || gg.startsWith('m')) return 'male';
        if (gg === 'female' || gg.startsWith('f')) return 'female';
        return 'male';
    };

    // 초기화 + 로그인 체크
    useEffect(() => {
        if (!currentUser) {
            // 로그인 상태가 아니면 로그인 페이지로 보냄 (복귀 경로 전달)
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
            phoneCode: '',
            birth: currentUser.birth ?? '',
            address: currentUser.address ?? '',
        });

        setGender(normalizeGender(currentUser.gender));
        setIsReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const onChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

    const buildAvatar = (name) => '/images/myPage/profile-img.png';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email) {
            alert('이메일을 입력하세요.');
            return;
        }
        if (form.password && form.password !== form.passwordConfirm) {
            alert('비밀번호와 확인이 일치하지 않습니다.');
            return;
        }

        // payload 준비 (빈 비밀번호는 제외)
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
            avatar: currentUser?.avatar ?? buildAvatar(form.nameKo || form.username),
            ...(form.password ? { password: form.password } : {}),
        };

        try {
            // updateUser가 async일 수도 있으니 await 처리
            const result = updateUser ? await Promise.resolve(updateUser(payload)) : null;
            // setCurrent 호출로 로컬 스토어 갱신
            if (setCurrent) setCurrent(result ?? payload);

            alert('프로필이 저장되었습니다.');
            // 저장 후 마이페이지로 복귀 (경로: /mypage — 당신이 준 라우트 구조에 맞춤)
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
                    <p>로딩 중... (로그인 상태 여부를 확인합니다)</p>
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
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일 주소를 입력하세요."
                            autoComplete="email"
                            inputMode="email"
                            value={form.email}
                            onChange={onChange('email')}
                        />
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
                        <input
                            type="text"
                            name="nameKo"
                            placeholder="홍길동"
                            autoComplete="name"
                            value={form.nameKo}
                            onChange={onChange('nameKo')}
                        />
                    </div>

                    {/* 비밀번호 (옵션) */}
                    <div className="form-group">
                        <div className="label">비밀번호 (변경 원할 경우만 입력)</div>
                        <div className="input-wrap">
                            <input
                                type="password"
                                name="password"
                                placeholder="새 비밀번호를 입력하세요."
                                autoComplete="new-password"
                                value={form.password}
                                onChange={onChange('password')}
                            />
                        </div>
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <div className="label">비밀번호 확인</div>
                        <div className="input-wrap">
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="비밀번호를 다시 입력하세요."
                                autoComplete="new-password"
                                value={form.passwordConfirm}
                                onChange={onChange('passwordConfirm')}
                            />
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div className="form-group phone">
                        <div className="label">연락처</div>
                        <div className="input-wrap">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="01012345678"
                                inputMode="numeric"
                                autoComplete="tel-national"
                                value={form.phone}
                                onChange={onChange('phone')}
                            />
                        </div>
                    </div>

                    {/* 생년월일 + 성별 */}
                    <div className="form-row">
                        <div className="form-group">
                            <div className="label">생년월일</div>
                            <input
                                type="text"
                                name="birth"
                                placeholder="YYYYMMDD"
                                inputMode="numeric"
                                maxLength={8}
                                value={form.birth}
                                onChange={onChange('birth')}
                            />
                        </div>

                        <div className="form-group gender">
                            {/* <div className="label">성별</div> */}

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
                        <label className="label">주소</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="서울시 강남구 서초동"
                            autoComplete="street-address"
                            value={form.address}
                            onChange={onChange('address')}
                        />
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

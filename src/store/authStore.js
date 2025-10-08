// src/store/authStore.js
import { create } from 'zustand';

const STORAGE_KEY = 'auth_store_test_v1';
const generateId = () => `u_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// === 테스트용 유저 ===
const defaultTestUser = {
    id: 'u_test_1',
    username: 'honggildong',
    nameKo: '홍길동',
    firstNameEn: 'gil-dong',
    lastNameEn: 'hong',
    email: 'hong@example.com',
    phone: '01012345678',
    birth: '19900101',
    gender: 'male',
    address: '서울시 강남구',
    avatar: '/images/myPage/profile-img.png',
    grade: 'Family',
    roles: ['user'],
    createdAt: new Date().toISOString(),
    reserveCount: 0,
    wishlistCount: 0,
    password: 'password123',
};

const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('authStore: failed to parse storage', e);
        return null;
    }
};

const initial = (() => {
    const base = { users: [defaultTestUser], currentUser: undefined }; // 🚨 null → undefined
    if (typeof window === 'undefined') return base;

    const stored = loadFromStorage();
    if (stored && Array.isArray(stored.users) && stored.users.length > 0) {
        const users = stored.users;
        const currentUser = users.find((u) => u.id === stored.currentUserId) || null;
        return { users, currentUser };
    }
    return base;
})();

const saveToStorage = (get) => {
    try {
        const users = get().users || [];
        const currentUserId = get().currentUser ? get().currentUser.id : null;
        const payload = { users, currentUserId };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn('authStore: failed to save storage', e);
    }
};

const useAuthStore = create((set, get) => ({
    users: initial.users,
    currentUser: initial.currentUser,
    token: null,
    isLoggedIn: !!initial.currentUser,

    // 사용자 추가
    addUser: (user) => {
        const u = {
            ...user,
            id: user.id || generateId(), // ✅ 항상 id 보장
            createdAt: user.createdAt || new Date().toISOString(),
            password: user.password || undefined,
        };
        set((state) => ({ users: [...state.users, u] }));
        saveToStorage(get);
        return u;
    },

    // 현재 사용자 ID로 설정
    setCurrentById: (id) => {
        const u = get().users.find((x) => x.id === id) || null;
        set({ currentUser: u, isLoggedIn: !!u });
        saveToStorage(get);
    },

    // 현재 사용자 직접 설정
    setCurrent: (user) => {
        if (!user) {
            set({ currentUser: null, isLoggedIn: false });
            saveToStorage(get);
            return;
        }

        // ✅ 항상 id 보장
        const u = { ...user, id: user.id || generateId() };

        // 이미 users 배열에 있으면 업데이트, 없으면 추가
        const exists = get().users.some((x) => x.id === u.id);
        if (!exists) {
            set((state) => ({ users: [...state.users, u], currentUser: u, isLoggedIn: true }));
        } else {
            set((state) => ({
                users: state.users.map((x) => (x.id === u.id ? u : x)),
                currentUser: u,
                isLoggedIn: true,
            }));
        }
        saveToStorage(get);
    },

    // 사용자 정보 업데이트
    updateUser: (id, patch) => {
        set((state) => {
            const users = state.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
            const currentUser =
                state.currentUser && state.currentUser.id === id
                    ? { ...state.currentUser, ...patch }
                    : state.currentUser;
            return { users, currentUser };
        });
        saveToStorage(get);
    },

    // 사용자 제거
    removeUser: (id) => {
        set((state) => {
            const users = state.users.filter((u) => u.id !== id);
            const currentUser =
                state.currentUser && state.currentUser.id === id ? null : state.currentUser;
            return { users, currentUser, isLoggedIn: !!currentUser };
        });
        saveToStorage(get);
    },

    // 토큰 설정
    setToken: (token) => {
        set({ token });
        saveToStorage(get);
    },

    // 요약/프로필 일부 필드 업데이트
    setSummary: (partialSummary) => {
        set((state) => {
            const currentUser = state.currentUser
                ? { ...state.currentUser, ...partialSummary }
                : state.currentUser;
            const users = state.users.map((u) =>
                currentUser && u.id === currentUser.id ? currentUser : u
            );
            return { users, currentUser };
        });
        saveToStorage(get);
    },

    // 비밀번호 설정
    setPassword: (id, plainPassword) => {
        set((state) => {
            const users = state.users.map((u) =>
                u.id === id ? { ...u, password: plainPassword } : u
            );
            const currentUser =
                state.currentUser && state.currentUser.id === id
                    ? { ...state.currentUser, password: plainPassword }
                    : state.currentUser;
            return { users, currentUser };
        });
        saveToStorage(get);
    },

    // 자격 증명 검사 (username 또는 email + 비번)
    validateCredentials: (identifier, plainPassword) => {
        if (!identifier) return null;
        const idLower = String(identifier).trim().toLowerCase();
        const user = get().users.find((u) => {
            const un = (u.username || '').toLowerCase();
            const em = (u.email || '').toLowerCase();
            return un === idLower || em === idLower;
        });
        if (!user) return null;
        return (user.password || '') === plainPassword ? user : null;
    },

    // 로그아웃
    logout: () => {
        set({ currentUser: null, isLoggedIn: false, token: null });
        saveToStorage(get);
    },

    // 전체 초기화
    clearAll: () => {
        set({ users: [], currentUser: null, token: null, isLoggedIn: false });
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
    },
}));

export default useAuthStore;

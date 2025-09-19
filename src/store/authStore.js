// src/store/authStore.js
import { create } from 'zustand';

const STORAGE_KEY = 'auth_store_test_v1';
const generateId = () => `u_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

// === 테스트용 유저 (개발/테스트에서 바로 보이게 할 값) ===

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
    couponCount: 13,
    points: 250900,
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
    if (typeof window === 'undefined')
        return { users: [defaultTestUser], currentUser: defaultTestUser };
    const stored = loadFromStorage();
    if (stored && Array.isArray(stored.users) && stored.users.length > 0) {
        const users = stored.users;
        const currentUser = users.find((u) => u.id === stored.currentUserId) || users[0] || null;
        return { users, currentUser };
    }
    return { users: [defaultTestUser], currentUser: defaultTestUser };
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

    // --- add user (password optional) ---
    addUser: (user) => {
        const u = {
            ...user,
            id: user.id || generateId(),
            createdAt: user.createdAt || new Date().toISOString(),
            // password may be provided (plain text for test mode)
            password: user.password || undefined,
        };
        set((state) => ({ users: [...state.users, u] }));
        saveToStorage(get);
        return u;
    },

    // set current by id
    setCurrentById: (id) => {
        const u = get().users.find((x) => x.id === id) || null;
        set({ currentUser: u, isLoggedIn: !!u });
        saveToStorage(get);
    },

    // set current user (if not present, push to users)
    setCurrent: (user) => {
        const u = user || null;
        if (u && !get().users.some((x) => x.id === u.id)) {
            set((state) => ({ users: [...state.users, u], currentUser: u, isLoggedIn: true }));
        } else {
            set({ currentUser: u, isLoggedIn: !!u });
        }
        saveToStorage(get);
    },

    // update user
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

    // remove user
    removeUser: (id) => {
        set((state) => {
            const users = state.users.filter((u) => u.id !== id);
            const currentUser =
                state.currentUser && state.currentUser.id === id ? null : state.currentUser;
            return { users, currentUser, isLoggedIn: !!currentUser };
        });
        saveToStorage(get);
    },

    // set token
    setToken: (token) => {
        set({ token });
        saveToStorage(get);
    },

    // set summary (stored on user entry for dev convenience)
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

    // --- password helpers (test mode only) ---
    // set or change password for given user id
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

    // validate credentials: identifier (username or email), password
    // returns the user object if match, otherwise null
    validateCredentials: (identifier, plainPassword) => {
        if (!identifier) return null;
        const idLower = String(identifier).trim().toLowerCase();
        const user = get().users.find((u) => {
            const un = (u.username || '').toLowerCase();
            const em = (u.email || '').toLowerCase();
            return un === idLower || em === idLower;
        });
        if (!user) return null;
        // for test mode we compare plain text (again: insecure for prod)
        if ((user.password || '') === plainPassword) return user;
        return null;
    },

    // clear all (and storage)
    clearAll: () => {
        set({ users: [], currentUser: null, token: null, isLoggedIn: false });
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
            /* ignore */
        }
    },
}));

export default useAuthStore;

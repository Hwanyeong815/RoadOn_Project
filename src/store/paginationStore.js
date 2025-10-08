// 여러 화면에서 공유할 수 있는 페이지네이션 스토어

import { create } from 'zustand';
import { useEffect } from 'react';

const usePaginationStore = create((set) => ({
    state: {}, // { [key]: { page, pageSize } }

    setPage: (key, page) =>
        set((s) => ({
            state: {
                ...s.state,
                [key]: { page, pageSize: s.state[key]?.pageSize ?? 5 },
            },
        })),

    setPageSize: (key, pageSize) =>
        set((s) => ({
            state: {
                ...s.state,
                [key]: { page: s.state[key]?.page ?? 1, pageSize },
            },
        })),

    reset: (key) =>
        set((s) => {
            const next = { ...s.state };
            delete next[key];
            return { state: next };
        }),
}));

// 편의 훅: totalForVisibility를 넘기면 showPagination을 계산
export function usePagination(
    key,
    defaultPageSize = 5,
    totalForVisibility = null, // 총 아이템 개수(선택)
    options = {} // { hideWhenTotalLTE?: number }
) {
    const page = usePaginationStore((s) => s.state[key]?.page ?? 1);
    const pageSize = usePaginationStore((s) => s.state[key]?.pageSize ?? defaultPageSize);
    const setPage = usePaginationStore((s) => s.setPage);
    const setPageSize = usePaginationStore((s) => s.setPageSize);

    // 초기 페이지 사이즈 세팅 (렌더 중 set 방지)
    useEffect(() => {
        if (usePaginationStore.getState().state[key]?.pageSize == null) {
            setPageSize(key, defaultPageSize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, defaultPageSize]);

    // 총 개수 변동 시 현재 페이지가 초과하면 마지막 페이지로 보정
    useEffect(() => {
        if (totalForVisibility == null) return;
        const totalPages = Math.max(1, Math.ceil(totalForVisibility / pageSize));
        if (page > totalPages) setPage(key, totalPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalForVisibility, pageSize, page, key]);

    const { hideWhenTotalLTE = defaultPageSize } = options || {};
    const showPagination =
        totalForVisibility == null ? true : totalForVisibility > hideWhenTotalLTE;

    return {
        page,
        pageSize,
        setPage: (p) => setPage(key, p),
        setPageSize: (sz) => setPageSize(key, sz),
        showPagination, // ✅ 결과가 5개 이하면 false
    };
}

export default usePaginationStore;

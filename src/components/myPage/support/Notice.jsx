// src/components/support/Notice.jsx
import { useMemo } from 'react';
import useSupportStore from '../../../store/supportStore';
import NoticeItem from './NoticeItem';
import { usePagination } from '../../../store/paginationStore';
import Pagination from '../../ui/pagination/Pagination';

const Notice = () => {
    const notices = useSupportStore((state) => state.notices);

    // ✅ pagination: notice 네임스페이스, 페이지당 10개
    const { page, pageSize, setPage } = usePagination('notice', 3);

    const total = notices.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (page > totalPages) {
        setPage(totalPages);
    }
    // 현재 페이지 아이템
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return notices.slice(start, start + pageSize);
    }, [notices, page, pageSize]);

    return (
        <div className="notice">
            <div className="support-notice-table-wrap">
                <table className="support-notice-table">
                    <colgroup>
                        <col />
                        <col />
                        <col />
                    </colgroup>

                    <thead>
                        <tr>
                            <th scope="col">등록일</th>
                            <th scope="col">제목</th>
                            <th scope="col">조회수</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pageItems.map((notice) => (
                            <NoticeItem key={notice.id} notice={notice} />
                        ))}
                        {pageItems.length === 0 && (
                            <tr>
                                <td colSpan={3} className="empty">
                                    등록된 공지사항이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ✅ 페이지네이션 UI */}
            <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
        </div>
    );
};

export default Notice;

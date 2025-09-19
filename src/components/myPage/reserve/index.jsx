// src/components/myPage/reserve.jsx
import { useEffect, useMemo, useState } from 'react';
import TabButton from '../../ui/tabButton/TabButton';
import ReserveItem from './ReserveItem.jsx';
import './style.scss';
import { IoIosArrowForward } from 'react-icons/io';
import Pagination from '../../ui/pagination/Pagination';
import useReserveStore from '../../../store/reserveStore';

const TABS = ['전체', '국내숙소', '해외숙소', '체험·투어입장권', '항공'];

/**
 * tab -> filter type
 * - '전체' => null
 * - '국내숙소' => hotel + domestic heuristic
 * - '해외숙소' => hotel + !domestic
 * - '체험·투어입장권' => package|tour
 * - '항공' => flight
 */
const tabToFilter = (label) => {
    const l = (label || '').toString();
    if (/전체/.test(l)) return { type: null };
    if (/국내/.test(l)) return { type: 'hotel', domestic: true };
    if (/해외/.test(l)) return { type: 'hotel', domestic: false };
    if (/체험|투어|입장권/.test(l)) return { type: ['package', 'tour'] };
    if (/항공/.test(l)) return { type: 'flight' };
    return { type: null };
};

// 휴리스틱: 호텔 위치 텍스트로 국내/해외 판단 (간단하고 명시적으로 키워드 포함 검사)
const isDomesticLocation = (loc) => {
    if (!loc) return false;
    const s = String(loc).toLowerCase();
    const keywords = [
        '한국',
        '대한민국',
        '서울',
        '제주',
        '부산',
        '대구',
        '인천',
        '광주',
        '대전',
        '울산',
        '세종',
        '강원',
        '경상',
        '전라',
        '충청',
        'korea',
        'kr',
    ].map((k) => k.toLowerCase());
    return keywords.some((kw) => s.includes(kw));
};

const Reserve = ({ preview = true, previewCount = 2, onMore = () => {}, items = null }) => {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    // store의 상세화된 데이터 사용 (hydrate 되어 data 필드 포함)
    const storeItems = useReserveStore((s) => s.itemsDetailed);
    const data = Array.isArray(items) ? items : storeItems || [];

    // 탭 변경 시 페이지 초기화
    useEffect(() => setPage(1), [activeTab]);

    const filtered = useMemo(() => {
        const f = tabToFilter(activeTab);
        if (!f.type) return data.slice();

        if (Array.isArray(f.type)) {
            // package or tour
            return data.filter((d) =>
                f.type.includes(((d.type || '') + '').toString().toLowerCase())
            );
        }

        if (f.type === 'hotel' && typeof f.domestic === 'boolean') {
            return data.filter((d) => {
                if (((d.type || '') + '').toString().toLowerCase() !== 'hotel') return false;
                // product data의 location로 국내/해외 판별 (우선 product snapshot, 없으면 merged data)
                const loc = d.data?.location ?? d.data?.address ?? d.data?.place ?? '';
                const domestic = isDomesticLocation(loc);
                return f.domestic ? domestic : !domestic;
            });
        }

        // simple type match
        return data.filter(
            (d) => ((d.type || '') + '').toString().toLowerCase() === String(f.type).toLowerCase()
        );
    }, [data, activeTab]);

    const total = filtered.length;
    const previewItems = filtered.slice(0, previewCount);
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    return (
        <section id="reserve">
            <div className="mypage-title-wrap">
                <h2 className="mypage-title">예약내역</h2>

                {preview ? (
                    <p
                        className="more"
                        role="button"
                        tabIndex={0}
                        onClick={onMore}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onMore();
                            }
                        }}
                    >
                        더보기
                        <em>
                            <IoIosArrowForward />
                        </em>
                    </p>
                ) : null}
            </div>

            <div className="tab-button-wrap2" aria-hidden={false}>
                {TABS.map((label) => (
                    <TabButton
                        key={label}
                        label={label}
                        isActive={activeTab === label}
                        onClick={() => setActiveTab(label)}
                    />
                ))}
            </div>

            <div className="reserve-table-wrap">
                <table className="reserve-table">
                    <colgroup>
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">예약일</th>
                            <th scope="col">예약코드</th>
                            <th scope="col">상품명 / 정보</th>
                            <th scope="col">결제 금액</th>
                            <th scope="col">인원</th>
                            <th scope="col">여행기간</th>
                            <th scope="col">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preview ? (
                            previewItems && previewItems.length > 0 ? (
                                previewItems.map((r) => (
                                    <ReserveItem key={r.uid || r.reservationId} data={r} />
                                ))
                            ) : (
                                <>
                                    <ReserveItem />
                                    <ReserveItem />
                                </>
                            )
                        ) : pageItems.length > 0 ? (
                            pageItems.map((r) => (
                                <ReserveItem key={r.uid || r.reservationId} data={r} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="empty">
                                    예약 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {!preview && total > pageSize && (
                <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} />
            )}
        </section>
    );
};

export default Reserve;

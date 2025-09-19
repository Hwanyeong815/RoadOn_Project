// src/components/myPage/wishList.jsx
import { useEffect, useMemo, useState } from 'react';
import { usePagination } from '../../../store/paginationStore';
import HotelBox from '../../hotels/hotelsSearch/HotelBox';
import AirportBox from '../../airport/airportSearch/AirportBox';
import TourBox from '../../tour/TourBox';
import './style.scss';
import { IoIosArrowForward } from 'react-icons/io';
import TabButton from '../../ui/tabButton/TabButton';
import Pagination from '../../ui/pagination/Pagination';
import useWishStore from '../../../store/wishStore';

const TABS = ['전체', '국내 숙소', '해외 숙소', '체험·투어 입장권', '항공'];

const KOREAN_REGIONS = [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주',
];

const isDomesticHotel = (item) => {
    const loc = (item?.data?.location || '').toString();
    if (!loc) return false;
    return KOREAN_REGIONS.some((kw) => loc.includes(kw));
};

const WishList = ({ preview = true, onMore = () => {}, previewCount = 2 }) => {
    // store 구독 (items를 주 소스로 사용)
    const itemsFromStore = useWishStore((s) => s.items) ?? [];
    const itemsDetailed = useWishStore((s) => s.itemsDetailed) ?? [];

    // store의 원본 items를 기반으로, itemsDetailed가 있다면 상세데이터를 매칭해서 병합
    const detailedMap = useMemo(() => {
        const m = new Map();
        (itemsDetailed || []).forEach((it) => {
            const uid = it.uid || `${it.type}-${it.id}`;
            m.set(uid, it);
        });
        return m;
    }, [itemsDetailed]);

    const rawItems = useMemo(() => {
        // itemsFromStore가 있으면(reactive) 이를 기준으로 상세데이터 병합
        if (Array.isArray(itemsFromStore) && itemsFromStore.length > 0) {
            return itemsFromStore.map((it) => {
                const uid = it.uid || `${it.type}-${it.id}`;
                const det = detailedMap.get(uid);
                // 우선순위: detailed data의 data 필드 유지, 아니면 store에 있던 data
                return {
                    uid,
                    type: (it.type || '').toString().toLowerCase(),
                    id: it.id,
                    data: det?.data ?? it.data ?? (det ? det.data : null),
                    // 만약 detailed엔 추가 필드가 필요하면 합쳐서 반환할 수도 있습니다.
                    ...(det ? { _detailed: det } : {}),
                };
            });
        }

        // store에 항목이 없으면(초기상태 등) detailed를 보여주거나 빈 배열
        if (Array.isArray(itemsDetailed) && itemsDetailed.length > 0) {
            return itemsDetailed.map((it) => ({
                uid: it.uid || `${it.type}-${it.id}`,
                type: (it.type || '').toString().toLowerCase(),
                id: it.id,
                data: it.data ?? null,
            }));
        }

        return [];
    }, [itemsFromStore, itemsDetailed, detailedMap]);

    const [activeTab, setActiveTab] = useState(TABS[0]);
    const { page, pageSize, setPage } = usePagination('wishlist', 5);

    const currentPage = Number(page) || 1;
    const currentPageSize = Number(pageSize) || 5;

    useEffect(() => {
        setPage(1);
    }, [activeTab, setPage]);

    const filtered = useMemo(() => {
        if (activeTab === '전체') return rawItems;
        if (activeTab === '국내 숙소')
            return rawItems.filter((it) => it.type === 'hotel' && isDomesticHotel(it));
        if (activeTab === '해외 숙소')
            return rawItems.filter((it) => it.type === 'hotel' && !isDomesticHotel(it));
        if (activeTab === '체험·투어 입장권')
            return rawItems.filter((it) => it.type === 'package' || it.type === 'tour');
        if (activeTab === '항공') return rawItems.filter((it) => it.type === 'flight');
        return rawItems;
    }, [rawItems, activeTab]);

    const total = filtered.length;

    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(total / currentPageSize));
        if (Number(page) > maxPage) setPage(1);
    }, [total, currentPageSize, page, setPage]);

    const previewList = useMemo(() => filtered.slice(0, previewCount), [filtered, previewCount]);

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * currentPageSize;
        return filtered.slice(start, start + currentPageSize);
    }, [filtered, currentPage, currentPageSize]);

    const renderItem = (it) => {
        // Box 내부에서 WishButton을 렌더하고 제어하도록 props 전달
        if (it.type === 'hotel')
            return <HotelBox key={it.uid} hotelId={it.id} inWishList data={it.data} />;
        if (it.type === 'flight' || it.type === 'air' || it.type === 'airport')
            return <AirportBox key={it.uid} airportId={it.id} inWishList data={it.data} />;
        if (it.type === 'package' || it.type === 'tour')
            return <TourBox key={it.uid} packageId={it.id} inWishList data={it.data} />;
        return (
            <div key={it.uid} className="wish-unknown">
                <strong>알 수 없는 항목</strong> - {it.type} / {String(it.id)}
            </div>
        );
    };

    if (preview) {
        return (
            <section id="wish-list">
                <div className="mypage-title-wrap">
                    <h2 className="mypage-title">찜 목록</h2>
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
                </div>

                <article className="wish-list-main-wrap">
                    <div className="list-box">
                        {previewList.length > 0 ? (
                            previewList.map((it) => renderItem(it))
                        ) : (
                            <p className="empty">찜한 항목이 없습니다.</p>
                        )}
                    </div>
                </article>
            </section>
        );
    }

    return (
        <section id="wish-list">
            <div className="mypage-title-wrap">
                <h2 className="mypage-title">
                    찜 목록
                    <div
                        className="tab-button-wrap2"
                        style={{ display: 'inline-block', marginLeft: 12 }}
                    />
                </h2>
            </div>

            <div className="tab-button-wrap" aria-hidden={false}>
                {TABS.map((label) => (
                    <TabButton
                        key={label}
                        label={label}
                        isActive={activeTab === label}
                        onClick={() => setActiveTab(label)}
                    />
                ))}
            </div>

            <article className="wish-list-main-wrap">
                <div className="list-box">
                    {pageItems.length > 0 ? (
                        pageItems.map((it) => renderItem(it))
                    ) : (
                        <p className="empty">조건에 맞는 찜 항목이 없습니다.</p>
                    )}
                </div>
            </article>

            <Pagination
                page={currentPage}
                total={total}
                pageSize={currentPageSize}
                onPageChange={setPage}
            />
        </section>
    );
};

export default WishList;

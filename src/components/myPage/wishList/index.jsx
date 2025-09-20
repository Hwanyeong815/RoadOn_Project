// src/components/myPage/wishList.jsx
import { useEffect, useMemo, useState } from 'react';
import { usePagination } from '../../../store/paginationStore';
import HotelBox from '../../hotels/hotelsSearch/HotelBox';
import TourBox from '../../tour/TourBox';
import './style.scss';
import { IoIosArrowForward } from 'react-icons/io';
import TabButton from '../../ui/tabButton/TabButton';
import Pagination from '../../ui/pagination/Pagination';
import useWishStore from '../../../store/wishStore';

const TABS = ['전체', '국내 숙소', '해외 숙소', '체험·투어 입장권'];

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
    const itemsFromStore = useWishStore((s) => s.items) ?? [];
    const itemsDetailed = useWishStore((s) => s.itemsDetailed) ?? [];

    const detailedMap = useMemo(() => {
        const m = new Map();
        (itemsDetailed || []).forEach((it) => {
            const uid = it.uid || `${it.type}-${it.id}`;
            m.set(uid, it);
        });
        return m;
    }, [itemsDetailed]);

    const rawItems = useMemo(() => {
        if (Array.isArray(itemsFromStore) && itemsFromStore.length > 0) {
            return itemsFromStore.map((it) => {
                const uid = it.uid || `${it.type}-${it.id}`;
                const det = detailedMap.get(uid);
                return {
                    uid,
                    type: (it.type || '').toString().toLowerCase(),
                    id: it.id,
                    data: det?.data ?? it.data ?? (det ? det.data : null),
                    ...(det ? { _detailed: det } : {}),
                };
            });
        }
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
        if (it.type === 'hotel')
            return <HotelBox key={it.uid} hotelId={it.id} inWishList data={it.data} />;
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

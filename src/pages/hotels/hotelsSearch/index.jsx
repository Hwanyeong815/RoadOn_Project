import { useEffect, useMemo } from 'react';
import Filter from '../../../components/hotels/hotelsSearch/Filter';
import useHotelStore from '../../../store/hotelStore';
import HotelBox from '../../../components/hotels/hotelsSearch/HotelBox';
import SearchBar from '../../../components/ui/SearchBar/SearchBar';
import Pagination from '../../../components/ui/pagination/Pagination';
import { usePagination } from '../../../store/paginationStore';

function hotelsSearch() {
    const getFilteredHotels = useHotelStore((state) => state.getFilteredHotels);
    const filters = useHotelStore((state) => state.filters);
    const searchParams = useHotelStore((state) => state.searchParams);

    const hotels = getFilteredHotels();
    const total = hotels.length;

    // 네임스페이스 'hotelsearch', 페이지당 5개, 총 개수 전달 → showPagination 계산
    const { page, pageSize, setPage, showPagination } = usePagination('hotelsearch', 5, total);

    // 필터/검색 변경 시 1페이지로 리셋
    useEffect(() => {
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, searchParams]);

    // 현재 페이지 아이템
    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return hotels.slice(start, start + pageSize);
    }, [hotels, page, pageSize]);

    return (
        <main className="hotel hotel-search">
            <div className="search-bar-wrap">
                <SearchBar className="white" />
            </div>
            <div className="inner">
                <div className="hotel-filter">
                    <Filter />
                </div>
                <div className="list-wrap">
                    <div className="list-top">
                        <p>
                            {searchParams.location
                                ? `‘${searchParams.location}’ 검색 결과 `
                                : '총 '}
                            {total}개 숙소
                        </p>
                        <div className="sort"></div>
                    </div>

                    <div className="list-box">
                        {pageItems.length > 0 ? (
                            pageItems.map((hotel) => <HotelBox key={hotel.id} hotelId={hotel.id} />)
                        ) : (
                            <p>조건에 맞는 숙소가 없습니다.</p>
                        )}
                    </div>

                    {/* 결과가 5개 이하면 자동으로 숨김 */}
                    {showPagination && (
                        <Pagination
                            page={page}
                            total={total} // 총 아이템 수
                            pageSize={pageSize} // 페이지당 개수
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}

export default hotelsSearch;

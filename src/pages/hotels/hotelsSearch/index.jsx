// hotelsSearch.jsx

import Filter from '../../../components/hotels/hotelsSearch/Filter';
import useHotelStore from '../../../store/hotelStore';
import HotelBox from '../../../components/hotels/hotelsSearch/HotelBox';
import SearchBarWhite from '../../../components/home/visual/search/SearchBarWhite';

function hotelsSearch() {
    // `useHotelStore`를 사용하여 필터 상태와 getFilteredHotels 함수를 모두 가져옵니다.
    const getFilteredHotels = useHotelStore((state) => state.getFilteredHotels);
    const filters = useHotelStore((state) => state.filters); // filters 상태를 구독하여 변경을 감지합니다.

    // 필터 상태가 변경될 때마다 getFilteredHotels 함수를 호출하여
    // 필터링된 호텔 리스트를 변수에 할당합니다.
    const hotels = getFilteredHotels();

    return (
        <main className="hotel">
            <SearchBarWhite />
            <div className="inner">
                <div className='hotel-filter'>
                    <Filter />
                </div>
                <div className="list-wrap">
                    <div className="list-top">
                        <p>총 {hotels.length}개 숙소</p>
                        <div className="sort"></div>
                    </div>
                    <div className="list-box">
                        {hotels.length > 0 ? (
                            hotels.map((hotel) => <HotelBox key={hotel.id} hotelId={hotel.id} />)
                        ) : (
                            <p>조건에 맞는 숙소가 없습니다.</p>
                        )}
                    </div>
                    {/* <Pagination page={5} /> */}
                </div>
            </div>
        </main>
    );
}

export default hotelsSearch;

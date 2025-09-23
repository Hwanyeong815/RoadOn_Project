import { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import AirportSearchBar from '../../../ui/AirportSearchBar/AirportSearchBar';
// import SearchBar from '../../../ui/SearchBar/SearchBar';
import SearchBari from '../../../home/visual/search/SearchBar';

const HotelsMainCon1 = () => {
    return (
        <section className="ht-main-con1 airport-main-con airport-main-con1">
            {/* <div className="visual-bg-ht"></div> */}
            <div className="visual-bg visual-bg-ht"></div>
            <div className="inner">
                <h2 className="search-title">날짜를 선택해 예약하세요</h2>
                {/* <SearchBar/> */}
                <SearchBari className="hotels-search" />
            </div>
        </section>
    );
};

export default HotelsMainCon1;

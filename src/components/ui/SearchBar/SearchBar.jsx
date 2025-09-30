// src/components/ui/searchBar/index.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaUser, FaCalendarAlt } from 'react-icons/fa';
import './style.scss';
import useHotelStore from '../../../store/hotelStore';

const locations = [
    '서울',
    '제주',
    '부산',
    '경주',
    '강원',
    '전주',
    '대전',
    '여수',
    '수원',
    '방콕',
    '괌',
    '싱가포르',
    '나트랑',
    '다낭',
    '오사카',
    '후쿠오카',
    '코타키나발루',
];

const SearchBar = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const setSearchParams = useHotelStore((state) => state.setSearchParams);
    const searchParams = useHotelStore((state) => state.searchParams);
    const triggerUpdate = useHotelStore((state) => state.triggerUpdate);

    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // zustand의 searchParams에서 초기값 가져오기
    const [selectedLocation, setSelectedLocation] = useState(searchParams.location || '');
    const [dates, setDates] = useState(() => {
        // zustand에 저장된 날짜가 있으면 사용, 없으면 오늘/내일
        if (searchParams.startDate && searchParams.endDate) {
            return [new Date(searchParams.startDate), new Date(searchParams.endDate)];
        }
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return [today, tomorrow];
    });
    const [people, setPeople] = useState(searchParams.people || 1);

    const today = new Date();

    const peopleDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);

    // searchParams가 변경되면 로컬 state 업데이트
    useEffect(() => {
        setSelectedLocation(searchParams.location || '');
        if (searchParams.startDate && searchParams.endDate) {
            setDates([new Date(searchParams.startDate), new Date(searchParams.endDate)]);
        }
        setPeople(searchParams.people || 1);
    }, [searchParams]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (peopleDropdownRef.current && !peopleDropdownRef.current.contains(event.target)) {
                if (openDropdown === 'people') setOpenDropdown(null);
            }
            if (
                locationDropdownRef.current &&
                !locationDropdownRef.current.contains(event.target)
            ) {
                if (openDropdown === 'location') setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setSearchTerm('');
        setTimeout(() => setOpenDropdown(null), 10);
    };

    const handleDecreasePeople = (e) => {
        e.stopPropagation();
        setPeople((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncreasePeople = (e) => {
        e.stopPropagation();
        setPeople((prev) => prev + 1);
    };

    const handleSearch = () => {
        const searchData = {
            location: selectedLocation,
            startDate: dates[0],
            endDate: dates[1],
            people,
        };
        setSearchParams(searchData);

        // 현재 페이지가 /hotels/search인 경우
        if (location.pathname === '/hotels/search') {
            // 강제 업데이트 트리거
            triggerUpdate();
        } else {
            // 다른 페이지에서는 /hotels/search로 이동
            navigate('/hotels/search');
        }
    };

    return (
        <div className={`search-bar ${className}`.trim()}>
            {/* 여행지 검색 부분 */}
            <div
                className="search-item search-location"
                onClick={() => setOpenDropdown('location')}
                ref={locationDropdownRef}
            >
                <FaSearch className="icon" />
                <div className="location-display">
                    {selectedLocation ? (
                        <span className="selected-location-o">{selectedLocation}</span>
                    ) : (
                        <span className="placeholder">여행지를 검색해보세요</span>
                    )}
                </div>
                {openDropdown === 'location' && (
                    <div
                        className="dropdown location-dropdown"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="text"
                            placeholder="여행지 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            autoFocus
                        />
                        <ul className="location-list">
                            {locations
                                .filter((loc) => loc.includes(searchTerm))
                                .map((loc) => (
                                    <li
                                        key={loc}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSelectLocation(loc);
                                        }}
                                        style={{
                                            padding: '10px',
                                            cursor: 'pointer',
                                            margin: '2px 0',
                                            textAlign: 'left',
                                            textIndent: '10px',
                                        }}
                                    >
                                        {loc}
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 날짜 선택 부분 */}
            <div className="search-item search-date">
                <FaCalendarAlt className="icon" />
                <DatePicker
                    className="date-picker"
                    selectsRange
                    startDate={dates[0]}
                    endDate={dates[1]}
                    onChange={(update) => setDates(update)}
                    locale={ko}
                    dateFormat="MM.dd (eee)"
                    placeholderText="가는날 - 오는날"
                    shouldCloseOnSelect
                    minDate={today}
                />
            </div>

            {/* 인원 선택 부분 */}
            <div
                className="search-item search-party"
                onClick={() => setOpenDropdown('people')}
                ref={peopleDropdownRef}
            >
                <FaUser className="icon" />
                <span>인원 {people}</span>
                {openDropdown === 'people' && (
                    <div className="dropdown people-dropdown" onClick={(e) => e.stopPropagation()}>
                        <div className="people-control">
                            <button className="people-btn" onClick={handleDecreasePeople}>
                                -
                            </button>
                            <span>{people}</span>
                            <button className="people-btn" onClick={handleIncreasePeople}>
                                +
                            </button>
                        </div>
                        <button className="confirm-btn" onClick={() => setOpenDropdown(null)}>
                            선택완료
                        </button>
                    </div>
                )}
            </div>

            <button className="search-btn" onClick={handleSearch}>
                검색
            </button>
        </div>
    );
};

export default SearchBar;

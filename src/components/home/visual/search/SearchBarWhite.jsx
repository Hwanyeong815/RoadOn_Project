import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaUser, FaCalendarAlt } from 'react-icons/fa';
import useHotelStore from '../../../../store/hotelStore'; // ✅ useHotelStore import
import './style.scss';

const locations = [
  '방콕', '괌', '싱가포르', '나트랑', '다낭', '오사카', '후쿠오카', '코타키나발루',
  '전주', '경주', '제주', '서울', '부산', '강원', '대전', '여수', '수원'
];

const SearchBarWhite = () => {
    const navigate = useNavigate();
    // ✅ store에서 setSearchParams와 searchParams를 모두 가져옵니다.
    const setSearchParams = useHotelStore((state) => state.setSearchParams);
    const searchParams = useHotelStore((state) => state.searchParams);
    
    // ✅ store의 searchParams로 초기 상태 설정
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(searchParams.location || '');
    const [dates, setDates] = useState([searchParams.startDate, searchParams.endDate]);
    const [people, setPeople] = useState(searchParams.people || 1);

    const peopleDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (peopleDropdownRef.current && !peopleDropdownRef.current.contains(event.target)) {
                if (openDropdown === 'people') {
                    setOpenDropdown(null);
                }
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
                if (openDropdown === 'location') {
                    setOpenDropdown(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setSearchTerm('');
        setTimeout(() => {
            setOpenDropdown(null);
        }, 10);
    };

    const handleDecreasePeople = (e) => {
        e.stopPropagation();
        setPeople(prev => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncreasePeople = (e) => {
        e.stopPropagation();
        setPeople(prev => prev + 1);
    };

    const handleSearch = () => {
        const searchData = {
            location: selectedLocation,
            startDate: dates[0],
            endDate: dates[1],
            people: people,
        };
        
        // store에 검색 파라미터 저장
        setSearchParams(searchData);
        
        // /hotels/search로 이동
        navigate('/hotels/search');
    };

    return (
        <div className="search-bar">
            {/* 여행지 검색 부분 */}
            <div 
                className="search-item search-location"
                onClick={() => setOpenDropdown('location')}
                ref={locationDropdownRef}
            >
                <FaSearch className="icon" />
                <div className="location-display">
                    {selectedLocation ? (
                        <span className="selected-location">{selectedLocation}</span>
                    ) : (
                        <span className="placeholder">여행지를 검색해보세요</span>
                    )}
                </div>
                {openDropdown === 'location' && (
                    <div className="dropdown location-dropdown" onClick={(e) => e.stopPropagation()}>
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
                                .filter(loc => loc.includes(searchTerm))
                                .map(loc => (
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
                                            textIndent: '10px'
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
                    selected={dates[0]} // 날짜 선택 상태 업데이트
                    startDate={dates[0]}
                    endDate={dates[1]}
                    onChange={(update) => {
                      setDates(update);
                      setOpenDropdown(null);
                    }}
                    selectsRange
                    locale={ko}
                    dateFormat="MM.dd (eee)"
                    placeholderText="가는날 - 오는날"
                    shouldCloseOnSelect={false}
                    onCalendarClose={() => setOpenDropdown(null)}
                    onClickOutside={() => setOpenDropdown(null)}
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
                            <button className="people-btn" onClick={handleDecreasePeople}>-</button>
                            <span>{people}</span>
                            <button className="people-btn" onClick={handleIncreasePeople}>+</button>
                        </div>
                        <button className="confirm-btn" onClick={() => setOpenDropdown(null)}>선택완료</button>
                    </div>
                )}
            </div>

            <button className="search-btn" onClick={handleSearch}>검색</button>
        </div>
    );
};

export default SearchBarWhite;
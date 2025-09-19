import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';
import { FiX, FiCalendar, FiPlus, FiSearch } from 'react-icons/fi';
import { MdOutlinePersonOutline } from 'react-icons/md';
import useAirportStore from '../../../store/airportStore';

const AirportSearchBarList = () => {
    const filters = useAirportStore((s) => s.filters);
    const setFilter = useAirportStore((s) => s.setFilter);

    const [mode, setMode] = useState('roundtrip');
    const [people, setPeople] = useState(1);
    const [seat, setSeat] = useState('일반석');
    const [roundDates, setRoundDates] = useState([null, null]);
    const [onewayDate, setOnewayDate] = useState(null);
    const [segments, setSegments] = useState([{ from: '', to: '', date: null }]);

    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fromLocations = ['김포', '인천', '제주'];
    const toLocations = [
        '방콕',
        '괌',
        '싱가포르',
        '나트랑',
        '다낭',
        '오사카',
        '후쿠오카',
        '코타키나발루',
    ];

    useEffect(() => {
        setMode(filters.mode || 'roundtrip');
        setPeople(filters.people || 1);
        setSeat(filters.seat || '일반석');

        if (filters.mode === 'roundtrip') {
            setRoundDates(filters.dates || [null, null]);
        } else if (filters.mode === 'oneway') {
            setOnewayDate(filters.dates?.[0] || null);
        }

        if (filters.mode === 'multicity') {
            setSegments(
                filters.segments.length > 0 ? filters.segments : [{ from: '', to: '', date: null }]
            );
        } else {
            setSegments(
                filters.segments.length > 0
                    ? [filters.segments[0]]
                    : [{ from: '', to: '', date: null }]
            );
        }
    }, [filters]);

    const increasePeople = () => setPeople((p) => p + 1);
    const decreasePeople = () => setPeople((p) => (p > 1 ? p - 1 : 1));

    const handleAddSegment = () => {
        if (segments.length < 3) {
            setSegments([...segments, { from: '', to: '', date: null }]);
        }
    };

    const handleRemoveSegment = (index) => {
        if (segments.length > 1) {
            setSegments(segments.filter((_, i) => i !== index));
        }
    };

    const handleSelectLocation = (index, field, value) => {
        const next = [...segments];
        next[index][field] = value;
        setSegments(next);
        setSearchTerm('');
        setOpenDropdown(null);
    };

    const handleSearch = () => {
        if (mode === 'roundtrip') {
            setFilter({
                mode,
                segments: [
                    { from: segments[0].from, to: segments[0].to, date: roundDates[0] },
                    { from: segments[0].to, to: segments[0].from, date: roundDates[1] },
                ],
                dates: roundDates,
                people,
                seat,
            });
        } else if (mode === 'oneway') {
            setFilter({
                mode,
                segments: [{ from: segments[0].from, to: segments[0].to, date: onewayDate }],
                dates: [onewayDate, null],
                people,
                seat,
            });
        } else if (mode === 'multicity') {
            setFilter({
                mode,
                segments,
                dates: segments.map((s) => s.date),
                people,
                seat,
            });
        }
    };

    const renderLocationDropdown = (index, field, dropdownKey) => {
        const locations = field === 'from' ? fromLocations : toLocations;
        return (
            openDropdown === dropdownKey && (
                <div
                    className="dropdown location-dropdown"
                    onClick={(e) => e.stopPropagation()}
                    onMouseLeave={() => setOpenDropdown(null)}
                >
                    <input
                        type="text"
                        placeholder="도시 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <ul>
                        {locations
                            .filter((loc) => loc.includes(searchTerm))
                            .map((loc) => (
                                <li
                                    key={loc}
                                    onClick={() => handleSelectLocation(index, field, loc)}
                                >
                                    {loc}
                                </li>
                            ))}
                    </ul>
                </div>
            )
        );
    };

    const renderPeopleSeatDropdown = () =>
        openDropdown === 'peopleSeat' && (
            <div
                className="dropdown people-seat-dropdown"
                onClick={(e) => e.stopPropagation()}
                onMouseLeave={() => setOpenDropdown(null)}
            >
                <div className="people-control">
                    <span>인원 (소아/유아 포함)</span>
                    <button className="people-btn" onClick={decreasePeople}>
                        -
                    </button>
                    <span>{people}</span>
                    <button className="people-btn" onClick={increasePeople}>
                        +
                    </button>
                </div>
                <div className="seat-control">
                    {['일반석', '프리미엄 일반석', '비즈니스석', '일등석'].map((s) => (
                        <span key={s} onClick={() => setSeat(s)}>
                            {s}
                        </span>
                    ))}
                </div>
                <button className="confirm-btn" onClick={() => setOpenDropdown(null)}>
                    선택완료
                </button>
            </div>
        );

    return (
        <div className="airport-searchbarlist">
            <div className="search-box">
                <p>검색결과</p>

                <div className="search-tabs">
                    <button
                        className={mode === 'roundtrip' ? 'active' : ''}
                        onClick={() => setMode('roundtrip')}
                    >
                        왕복
                    </button>
                    <button
                        className={mode === 'oneway' ? 'active' : ''}
                        onClick={() => setMode('oneway')}
                    >
                        편도
                    </button>
                    <button
                        className={mode === 'multicity' ? 'active' : ''}
                        onClick={() => setMode('multicity')}
                    >
                        다구간
                    </button>
                </div>

                {/* 왕복 */}
                {mode === 'roundtrip' && (
                    <div className="search-form">
                        <div className="form-item date">
                            <FiCalendar className="calendar icon" />
                            <DatePicker
                                selectsRange
                                startDate={roundDates[0]}
                                endDate={roundDates[1]}
                                onChange={(update) => setRoundDates(update)}
                                locale={ko}
                                dateFormat="MM.dd (eee)"
                                placeholderText="가는날 - 오는날"
                                shouldCloseOnSelect={true}
                            />
                        </div>
                        <div className="form-item start" onClick={() => setOpenDropdown('from')}>
                            <FiSearch className="search icon" />
                            {segments[0].from || '출발지'}
                            {renderLocationDropdown(0, 'from', 'from')}
                        </div>
                        <div className="form-item end" onClick={() => setOpenDropdown('to')}>
                            <FiSearch className="search icon" />
                            {segments[0].to || '도착지'}
                            {renderLocationDropdown(0, 'to', 'to')}
                        </div>
                        <div className="form-item" onClick={() => setOpenDropdown('peopleSeat')}>
                            <MdOutlinePersonOutline className="people icon" />
                            인원 {people} · {seat}
                            {renderPeopleSeatDropdown()}
                        </div>
                        <button className="search-btn" onClick={handleSearch}>
                            검색
                        </button>
                    </div>
                )}

                {/* 편도 */}
                {mode === 'oneway' && (
                    <div className="search-form">
                        <div className="form-item date">
                            <FiCalendar className="calendar icon" />
                            <DatePicker
                                selected={onewayDate}
                                onChange={(date) => setOnewayDate(date)}
                                locale={ko}
                                dateFormat="MM.dd (eee)"
                                placeholderText="가는날"
                                shouldCloseOnSelect={true}
                            />
                        </div>
                        <div className="form-item start" onClick={() => setOpenDropdown('from')}>
                            <FiSearch className="search icon" />
                            {segments[0].from || '출발지'}
                            {renderLocationDropdown(0, 'from', 'from')}
                        </div>
                        <div className="form-item end" onClick={() => setOpenDropdown('to')}>
                            <FiSearch className="search icon" />
                            {segments[0].to || '도착지'}
                            {renderLocationDropdown(0, 'to', 'to')}
                        </div>
                        <div
                            className="form-item people"
                            onClick={() => setOpenDropdown('peopleSeat')}
                        >
                            <MdOutlinePersonOutline className="people icon" />
                            성인 {people}명 · {seat}
                            {renderPeopleSeatDropdown()}
                        </div>
                        <button className="search-btn" onClick={handleSearch}>
                            검색
                        </button>
                    </div>
                )}

                {/* 다구간 */}
                {mode === 'multicity' && (
                    <div className="search-form multicity">
                        {segments.map((seg, i) => (
                            <div className="multi-row" key={i}>
                                <div className="form-item date">
                                    <FiCalendar className="calendar icon" />
                                    <DatePicker
                                        selected={seg.date}
                                        onChange={(date) => {
                                            const next = [...segments];
                                            next[i].date = date;
                                            setSegments(next);
                                        }}
                                        locale={ko}
                                        dateFormat="MM.dd (eee)"
                                        placeholderText="가는날"
                                        shouldCloseOnSelect={true}
                                    />
                                </div>
                                <div
                                    className="form-item start"
                                    onClick={() => setOpenDropdown(`segment-${i}-from`)}
                                >
                                    <FiSearch className="search icon" />
                                    {seg.from || '출발지'}
                                    {renderLocationDropdown(i, 'from', `segment-${i}-from`)}
                                </div>
                                <div
                                    className="form-item end"
                                    onClick={() => setOpenDropdown(`segment-${i}-to`)}
                                >
                                    <FiSearch className="search icon" />
                                    {seg.to || '도착지'}
                                    {renderLocationDropdown(i, 'to', `segment-${i}-to`)}
                                </div>

                                {segments.length > 1 && (
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemoveSegment(i)}
                                    >
                                        <FiX className="icon" />
                                    </button>
                                )}

                                {i === segments.length - 1 && (
                                    <>
                                        {segments.length < 3 && (
                                            <button className="add-btn" onClick={handleAddSegment}>
                                                <FiPlus className="plus icon" /> 구간추가
                                            </button>
                                        )}
                                        <div
                                            className="form-item people"
                                            onClick={() => setOpenDropdown('peopleSeat')}
                                        >
                                            <MdOutlinePersonOutline className="people icon" />
                                            성인 {people}명 · {seat}
                                            {renderPeopleSeatDropdown()}
                                        </div>
                                        <button className="search-btn" onClick={handleSearch}>
                                            검색
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AirportSearchBarList;

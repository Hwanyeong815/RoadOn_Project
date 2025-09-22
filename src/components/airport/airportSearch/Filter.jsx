import './style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import useAirportStore from '../../../store/airportStore';
import { GrRefresh } from 'react-icons/gr';

const Filter = () => {
    const setFilter = useAirportStore((s) => s.setFilter);
    const resetFilter = useAirportStore((s) => s.resetFilter);
    const setPriceRange = useAirportStore((s) => s.setPriceRange);

    const filters = useAirportStore((s) => s.filters);
    const absMin = useAirportStore((s) => s.priceMin);
    const absMax = useAirportStore((s) => s.priceMax);
    const STEP = useAirportStore((s) => s.STEP);

    const [minPrice, maxPrice] = filters.priceRange;

    // 최저 가격 핸들
    const onMinChange = (e) => {
        const v = Number(e.target.value);
        const safeMin = Math.min(v, maxPrice - STEP);
        if (safeMin !== minPrice) setPriceRange(safeMin, maxPrice);
    };

    // 최고 가격 핸들
    const onMaxChange = (e) => {
        const v = Number(e.target.value);
        const safeMax = Math.max(v, minPrice + STEP);
        if (safeMax !== maxPrice) setPriceRange(minPrice, safeMax);
    };

    // 툴팁 위치(선택 구간 중앙)
    const posPct = (((minPrice + maxPrice) / 2 - absMin) / (absMax - absMin)) * 100;

    const events = [
        {
            id: 1,
            desc: '해외 데이터 절약 와이파이 & ESIM 4% 할인',
            img: '/images/airport/event_img1.png',
        },
        {
            id: 2,
            desc: '로드온 고객 여행자 보험 10% 즉시할인',
            img: '/images/airport/event_img2.png',
        },
        {
            id: 3,
            desc: '카드사 혜택 해외 항공권을 가볍게',
            img: '/images/airport/event_img3.png',
        },
    ];

    return (
        <div className="filter-wrap">
            {/* 이벤트 슬라이드 */}
            <div className="event-modal">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    autoplay={{ delay: 3000 }}
                    loop
                >
                    {events.map((ev) => (
                        <SwiperSlide key={ev.id}>
                            <div className="event-card">
                                <div className="text-box">
                                    <img src={ev.img} alt={ev.desc} />
                                    <p className="desc">{ev.desc}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="filter">
                {/* 경유 */}
                <div className="filtering type">
                    <div className="type-title">
                        <p>경유</p>
                        <div className="redo" onClick={resetFilter}>
                            <div className="refresh-icon">
                                <GrRefresh />
                            </div>
                            <span>초기화</span>
                        </div>
                    </div>
                    <ul>
                        <li>
                            <input
                                type="checkbox"
                                id="direct"
                                checked={filters.direct === true}
                                onChange={(e) =>
                                    setFilter({ direct: e.target.checked ? true : null })
                                }
                            />
                            <label htmlFor="direct">
                                <strong>직항</strong>
                            </label>
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                id="transfer"
                                checked={filters.direct === false}
                                onChange={(e) =>
                                    setFilter({ direct: e.target.checked ? false : null })
                                }
                            />
                            <label htmlFor="transfer">
                                <strong>경유</strong>
                            </label>
                        </li>
                    </ul>
                </div>

                {/* 항공사 */}
                <div className="filtering star">
                    <p>항공사</p>
                    <ul>
                        {['전체', '대한항공', '에어서울', '진에어', '제주항공', '티웨이항공'].map(
                            (airline) => {
                                const selectedAirlines = filters.airline || [];
                                const isAll = airline === '전체';
                                const isActive = isAll
                                    ? selectedAirlines.length === 0
                                    : selectedAirlines.includes(airline);

                                const handleClick = () => {
                                    if (isAll) {
                                        // '전체' 선택 시 -> 선택 항공사 초기화
                                        setFilter({ airline: [] });
                                    } else {
                                        // 항공사 선택/해제 토글
                                        const alreadySelected = selectedAirlines.includes(airline);
                                        const updatedAirlines = alreadySelected
                                            ? selectedAirlines.filter((a) => a !== airline)
                                            : [...selectedAirlines, airline];
                                        setFilter({ airline: updatedAirlines });
                                    }
                                };

                                return (
                                    <li key={airline} style={{border: 'none'}}>
                                        <button
                                            className={isActive ? 'active' : ''}
                                            onClick={handleClick}
                                        >
                                            {airline}
                                        </button>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>

                {/* 가격 */}
                <div className="filtering price">
                    <p>가격</p>

                    <div className="price-slider">
                        <div className="ranges">
                            {/* 회색 기본 바 (가장 아래) */}
                            <div className="base-track" />

                            {/* 왼쪽(최저) */}
                            <input
                                type="range"
                                min={absMin}
                                max={Math.max(absMin, maxPrice - STEP)}
                                step={STEP}
                                value={minPrice}
                                onChange={onMinChange}
                            />

                            {/* 오른쪽(최고) */}
                            <input
                                type="range"
                                min={Math.min(absMax, minPrice + STEP)}
                                max={absMax}
                                step={STEP}
                                value={maxPrice}
                                onChange={onMaxChange}
                            />

                            {/* 선택 구간 주황 하이라이트 */}
                            <div
                                className="track-fill"
                                style={{
                                    left: `${((minPrice - absMin) / (absMax - absMin)) * 100}%`,
                                    right: `${
                                        (1 - (maxPrice - absMin) / (absMax - absMin)) * 100
                                    }%`,
                                }}
                            />

                            {/* 툴팁 */}
                            <div className="price-tooltip" style={{ left: `${posPct}%` }}>
                                {minPrice.toLocaleString('ko-KR')}원 ~{' '}
                                {maxPrice.toLocaleString('ko-KR')}원
                            </div>
                        </div>
                        <div className="desc">
                            <div>
                                출발일자 기준 최저 금액{' '}
                                <strong>{minPrice.toLocaleString('ko-KR')}</strong>원 부터
                            </div>
                            <div>
                                출발일자 기준 최고 금액{' '}
                                <strong>{maxPrice.toLocaleString('ko-KR')}</strong>원 까지
                            </div>
                        </div>
                    </div>
                </div>

                {/* 무료 수화물 */}
                <div className="filtering discount">
                    <p>무료 수화물</p>
                    <ul>
                        <li>
                            <input
                                type="checkbox"
                                id="baggage"
                                checked={filters.baggage === '포함'}
                                onChange={(e) =>
                                    setFilter({ baggage: e.target.checked ? '포함' : null })
                                }
                            />
                            <label htmlFor="baggage">
                                <strong>포함</strong>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Filter;

import React, { useState, useEffect } from 'react';
import useHotelStore from '../../../store/hotelStore';
import MapModal from './MapModal';

// `vw()`와 SCSS 변수를 직접 CSS로 변환했습니다.
// SCSS 변수 `$mint`는 `#34d393`로, `$greyscale-400`은 `#d1d5db`로 변환했습니다.
const priceSliderStyles = `
.price-slider {
    .ranges {
        position: relative;
        height: 30px;
        margin: 0 6px 10px;

        .base-track {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            height: 4px;
            background: #EBEBEB; /* $greyscale-400 */
            border-radius: 6px;
            z-index: 5;
            pointer-events: none;
        }

        input[type='range'] {
            position: absolute;
            left: 0;
            right: 0;
            top: 10px;
            transform: translateY(-50%);
            height: 18px;
            margin: 0;
            background: none;
            pointer-events: none;
            -webkit-appearance: none;
            z-index: 30;
        }

        input[type='range']:nth-of-type(2) {
            z-index: 40;
        }

        input[type='range']::-webkit-slider-runnable-track {
            height: 6px;
            background: transparent;
            border-radius: 6px;
            pointer-events: none;
        }

        input[type='range']::-moz-range-track {
            height: 6px;
            background: transparent;
            border-radius: 6px;
            pointer-events: none;
        }

        input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #42BDCC; /* $mint */
            border: 0;
            box-shadow: 0 0 0 2px #fff; /* $white */
            cursor: pointer;
            pointer-events: auto;
            margin-top: 0;
            position: relative;
        }

        input[type='range']::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #42BDCC; /* $mint */
            border: 0;
            cursor: pointer;
            pointer-events: auto;
            margin: 0;
            position: relative;
        }

        .track-fill {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 4px;
            background: #42BDCC; /* $mint */
            border-radius: 6px;
            z-index: 15;
            pointer-events: none;
        }

        .price-tooltip {
            position: absolute;
            bottom: 18px;
            transform: translateX(-50%);
            color: #374151;
            background-color: #fff;
            padding: 6px 10px;
            border-radius: 6px;
            white-space: nowrap;
            z-index: 50;
            pointer-events: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    }

    .desc {
        font-size: 14px;
        color: #6b7280;

        strong {
            color: #42BDCC;
            font-size: 16px;
            font-weight: 500;
        }
    }
}
`;

const Filter = () => {
    const { filters, updateFilters } = useHotelStore();

    // 슬라이더의 로컬 상태 관리
    const [minPrice, setMinPrice] = useState(filters.priceRange[0]);
    const [maxPrice, setMaxPrice] = useState(filters.priceRange[1]);
    const absMin = 0;
    const absMax = 1000000;
    const STEP = 10000;

    // 전역 상태가 변경될 때 슬라이더의 로컬 상태를 동기화
    useEffect(() => {
        setMinPrice(filters.priceRange[0]);
        setMaxPrice(filters.priceRange[1]);
    }, [filters.priceRange]);

    // 최저가 변경 핸들러
    const onMinChange = (e) => {
        const newMin = Math.min(Number(e.target.value), maxPrice - STEP);
        setMinPrice(newMin);
        updateFilters({ priceRange: [newMin, maxPrice] });
    };

    // 최고가 변경 핸들러
    const onMaxChange = (e) => {
        const newMax = Math.max(Number(e.target.value), minPrice + STEP);
        setMaxPrice(newMax);
        updateFilters({ priceRange: [minPrice, newMax] });
    };

    // 툴팁 위치 계산 (최소-최고 가격의 중간)
    const posPct =
        ((minPrice + (maxPrice - minPrice) / 2 - absMin) / (absMax - absMin)) * 100;

    // 필터 클릭 핸들러 함수
    const handleFilterClick = (filterType, value) => {
        // '전체' 버튼을 클릭했을 때의 로직
        if (value === '전체') {
            if (filters[filterType].includes('전체')) {
                // '전체'가 이미 선택되어 있으면, 모든 필터를 해제
                updateFilters({ [filterType]: [] });
            } else {
                // '전체'가 선택되어 있지 않으면, '전체'만 선택
                updateFilters({ [filterType]: [value] });
            }
        } else {
            // 다른 필터 항목을 클릭했을 때의 로직
            let newValues = [...filters[filterType]];

            // '전체'가 선택된 상태에서 다른 필터를 누르면 '전체'를 제거
            if (newValues.includes('전체')) {
                newValues = newValues.filter((v) => v !== '전체');
            }

            if (newValues.includes(value)) {
                newValues = newValues.filter((v) => v !== value);
            } else {
                newValues.push(value);
            }
            updateFilters({ [filterType]: newValues });
        }
    };

    // 할인 필터 클릭 핸들러
    const handleDiscountClick = () => {
        updateFilters({ discount: !filters.discount });
    };

    // 초기화 버튼 핸들러
    const handleReset = () => {
        updateFilters({
            type: [],
            star: [],
            service: [],
            discount: false,
            priceRange: [0, 1000000],
        });
    };

    return (
        <>
            <style>{priceSliderStyles}</style>
            <div className="filter-wrap">
                {/* 여기 onClick 걸기 - 상태관리로 클릭으로 t/f으로 관리*/}
                {/* <MapModal /> */}
                <div className="map-modal"></div>
                <div className="filter">
                    <div className="filtering type">
                        <div className="type-title">
                            <p>숙소 유형</p>
                            <div className="redo" onClick={handleReset}>
                                <img
                                    src="/images/hotels/search/uim_redo.svg"
                                    alt="초기화"
                                />
                                <span>초기화</span>
                            </div>
                        </div>
                        <ul>
                            {[
                                '전체',
                                '호텔·리조트',
                                '펜션',
                                '게스트하우스',
                                '빌라',
                                '한옥',
                                '캡슐호텔',
                                '기타',
                            ].map((type) => (
                                <li
                                    key={type}
                                    onClick={() => handleFilterClick('type', type)}
                                    className={filters.type.includes(type) ? 'active' : ''}
                                >
                                    <span
                                        className={filters.type.includes(type) ? 'checked' : ''}
                                    ></span>
                                    {type}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="filtering star">
                        <p>성급</p>
                        <ul className="round-btns">
                            {['전체', '5성급', '4성급', '3성급', '2성급', '1성급'].map((star) => (
                                <li
                                    key={star}
                                    onClick={() => handleFilterClick('star', star)}
                                    className={filters.star.includes(star) ? 'active' : ''}
                                >
                                    {star}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="filtering price">
                        <p>가격</p>
                        {/* price-slider 통합 */}
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
                                        right: `${(1 - (maxPrice - absMin) / (absMax - absMin)) * 100}%`,
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
                                    숙소 최저 금액
                                    <strong>{minPrice.toLocaleString('ko-KR')}</strong>원 부터
                                </div>
                                <div>
                                    숙소 최고 금액
                                    <strong>{maxPrice.toLocaleString('ko-KR')}</strong>원 까지
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="filtering service">
                        <p>시설/서비스</p>
                        <ul className="round-btns">
                            {[
                                '무료 와이파이',
                                '24시간 체크인',
                                '수화물 보관',
                                '수영장',
                                '주차',
                                '개별 바베큐',
                                '반려동물 동반',
                                '스파',
                                '레스토랑',
                                '조식 제공',
                            ].map((service) => (
                                <li
                                    key={service}
                                    onClick={() => handleFilterClick('service', service)}
                                    className={filters.service.includes(service) ? 'active' : ''}
                                >
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="filtering discount">
                        <p>할인</p>
                        <ul>
                            <li
                                onClick={handleDiscountClick}
                                className={filters.discount ? 'active' : ''}
                            >
                                <span className={filters.discount ? 'checked' : ''}></span>
                                <p className="event">Event</p>
                                <p className="sale">특가 할인</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Filter;

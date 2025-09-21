import useHotelStore from '../../../store/hotelStore';
import MapModal from './MapModal';

const Filter = () => {
    const { filters, updateFilters } = useHotelStore();

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
                                src="../../../../public/images/hotels/search/uim_redo.svg"
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
                    <ul className='round-btns'>
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
                    <div className="price-slider"></div>
                </div>
                <div className="filtering service">
                    <p>시설/서비스</p>
                    <ul className='round-btns'>
                        {[
                            '무료 와이파이',
                            '24시간 체크인',
                            '수화물 보관',
                            '수영장',
                            '주차',
                            '개별 바베큐',
                            '반려동물 동반',
                            '스파',
                            //'오션뷰',
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
    );
};

export default Filter;

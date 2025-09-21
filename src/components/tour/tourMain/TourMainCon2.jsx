// src/components/tour/TourMainCon2/index.jsx
import { useEffect, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useTourStore, { CATEGORY_LABELS } from '../../../store/tourStore';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const CategoryTabs = ({ active, onChange }) => (
    <div className="btns-wrap">
        {CATEGORY_LABELS.map((c) => (
            <button
                key={c}
                className={`button ${active === c ? 'g' : ''}`}
                onClick={() => onChange(c)}
                type="button"
            >
                {c}
            </button>
        ))}
    </div>
);

function useAutoRotateCategories(enabled = true, intervalMs = 10000) {
    const activeCategory = useTourStore((s) => s.activeCategory);
    const setCategory = useTourStore((s) => s.setCategory);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const idx = CATEGORY_LABELS.indexOf(activeCategory);
            const next = CATEGORY_LABELS[(idx + 1) % CATEGORY_LABELS.length];
            setCategory(next);
        }, intervalMs);
        return () => clearInterval(timerRef.current);
    }, [enabled, intervalMs, activeCategory, setCategory]);
}

export default function TourMainCon2({
    initialCategory = '예능',
    initialIndex = 0,
    initialTourId,
    autoRotateCategories = true,
    categoryIntervalMs = 8000,
    slideDelayMs = 3500,
}) {
    const swiperRef = useRef(null);
    const navigate = useNavigate();

    const activeCategory = useTourStore((s) => s.activeCategory);
    const activeIndex = useTourStore((s) => s.activeIndex);
    const tours = useTourStore((s) => s.tours);
    const excludedIds = useTourStore((s) => s.excludedIds);
    const setCategory = useTourStore((s) => s.setCategory);
    const setIndex = useTourStore((s) => s.setIndex);

    useAutoRotateCategories(autoRotateCategories, categoryIntervalMs);

    const slides = useMemo(() => {
        return tours.filter((t) => !excludedIds.has(t.id) && t.category === activeCategory);
    }, [tours, excludedIds, activeCategory]);

    useEffect(() => {
        if (!slides.length) {
            if (activeIndex !== 0) setIndex(0);
            return;
        }
        if (activeIndex >= slides.length) {
            setIndex(slides.length - 1);
            swiperRef.current?.swiper?.slideTo(slides.length - 1, 0);
        }
    }, [slides.length, activeIndex, setIndex]);

    useEffect(() => {
        setCategory(initialCategory);

        if (initialTourId != null) {
            const target = tours.find((t) => t.tourId === initialTourId && !excludedIds.has(t.id));
            if (target) {
                setTimeout(() => {
                    setCategory(target.category);
                    const arr = tours.filter(
                        (t) => !excludedIds.has(t.id) && t.category === target.category
                    );
                    const idx = arr.findIndex((t) => t.tourId === target.tourId);
                    const to = Math.max(0, idx);
                    setIndex(to);
                    swiperRef.current?.swiper?.slideTo(to, 0);
                }, 0);
                return;
            }
        }

        setTimeout(() => {
            const to = Math.max(0, Math.min(initialIndex, Math.max(0, slides.length - 1)));
            setIndex(to);
            swiperRef.current?.swiper?.slideTo(to, 0);
        }, 0);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSlideChange = (sw) => setIndex(sw.activeIndex);

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        requestAnimationFrame(() => {
            swiperRef.current?.swiper?.slideTo(0, 0);
            setIndex(0);
        });
    };

    // ====== 상세로 이동 helpers ======
    const goDetailByItem = (item) => {
        if (!item) return;
        navigate(`/tour/${item.slug ?? item.id}`);
    };

    const handleMoreClick = () => {
        const item = slides[activeIndex];
        goDetailByItem(item);
    };

    const handleSlideClick = (item) => {
        // 드래그 중에는 클릭 네비게이션 방지
        const sw = swiperRef.current?.swiper;
        if (sw && sw.allowClick === false) return;
        goDetailByItem(item);
    };
    // ================================

    const current = slides[activeIndex];
    const bgUrl = current?.backgroundImg || '';
    const enableLoop = slides.length > 1;

    return (
        <section
            className="tour-main-con tour-main-con2"
            style={{
                backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="inner">
                <div className="categorytabs-wrap">
                    <CategoryTabs active={activeCategory} onChange={handleCategoryChange} />
                    <div
                        className="more-btns"
                        role="button"
                        tabIndex={0}
                        onClick={handleMoreClick}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleMoreClick()}
                        style={{ cursor: 'pointer' }}
                    >
                        자세히보기
                        <em>
                            <IoIosArrowForward />
                        </em>
                    </div>
                </div>

                <Swiper
                    key={activeCategory}
                    ref={swiperRef}
                    className="main-section-wrap"
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={
                        enableLoop
                            ? {
                                  delay: slideDelayMs,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: true,
                              }
                            : false
                    }
                    loop={enableLoop}
                    onSlideChange={handleSlideChange}
                    speed={550}
                >
                    {slides.map((item) => (
                        <SwiperSlide key={item.id} onClick={() => handleSlideClick(item)}>
                            <article className="main-section-wrap" style={{ cursor: 'pointer' }}>
                                <section className="title-section">
                                    <div className="txt-box">
                                        <strong>{item.title}</strong>
                                        <h3>{item.subtitle}</h3>
                                        <p>“{item.description}”</p>
                                    </div>

                                    {/* ✅ 아이콘 5개 고정 */}
                                    <div className="icons-wrap">
                                        {item.duration && (
                                            <div className="icon-box">
                                                <b className="img-wrap">
                                                    <img
                                                        src="/images/icon/icon-calender.png"
                                                        alt="기간"
                                                    />
                                                </b>
                                                <p>{item.duration}</p>
                                            </div>
                                        )}
                                        {item.flight && (
                                            <div className="icon-box">
                                                <b className="img-wrap">
                                                    <img
                                                        src="/images/icon/airport.png"
                                                        alt="항공"
                                                    />
                                                </b>
                                                <p>{item.flight}</p>
                                            </div>
                                        )}
                                        {item.shopping && (
                                            <div className="icon-box">
                                                <b className="img-wrap">
                                                    <img
                                                        src="/images/icon/icon-suitcase.png"
                                                        alt="쇼핑"
                                                    />
                                                </b>
                                                <p>{item.shopping}</p>
                                            </div>
                                        )}
                                        {item.guide_fee && (
                                            <div className="icon-box">
                                                <b className="img-wrap">
                                                    <img
                                                        src="/images/icon/icon-dollar.png"
                                                        alt="가이드비"
                                                    />
                                                </b>
                                                <p>가이드 {item.guide_fee}</p>
                                            </div>
                                        )}
                                        {item.optional != null && (
                                            <div className="icon-box">
                                                <b className="img-wrap">
                                                    <img
                                                        src="/images/icon/icon-flag.png"
                                                        alt="선택관광"
                                                    />
                                                </b>
                                                <p>{item.optional ? '선택 관광' : '포함 일정'}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section className="img-section">
                                    <div className="img-wrap">
                                        <img src={item.posterImg} alt={item.slug || item.id} />
                                    </div>
                                </section>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

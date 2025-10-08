import { useState, useEffect, useRef } from 'react';
import './style.scss';
import { MdArrowForwardIos, MdArrowBackIos } from 'react-icons/md';

const slides = [
    { id: 0, image: './images/main/road1.png', alt: '리조트' },
    { id: 1, image: './images/main/road2.png', alt: '세인트존스 호텔' },
    { id: 2, image: './images/main/road3.png', alt: '고층 건물' },
];

const Content5 = () => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const intervalRef = useRef(null);
    const startX = useRef(0);
    const isDragging = useRef(false);

    // 위치 클래스 계산
    const getPositionClass = (index) => {
        const pos = (index - currentSlide + slides.length) % slides.length;
        if (pos === 1) return 'position-4'; // 오른쪽
        if (pos === slides.length - 1) return 'position-2'; // 왼쪽
        return pos === 0 ? 'position-3' : 'position-none'; // 중앙 or 숨김
    };

    // 슬라이드 이동
    const moveSlide = (dir) =>
        setCurrentSlide((prev) => (prev + dir + slides.length) % slides.length);

    // 자동 재생
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            moveSlide(1);
        }, 3000);
        return () => clearInterval(intervalRef.current);
    }, []);

    // 드래그 이벤트
    const handleDragStart = (e) => {
        isDragging.current = true;
        startX.current = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    };

    const handleDragEnd = (e) => {
        if (!isDragging.current) return;
        const endX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const diff = endX - startX.current;

        if (diff > 50) moveSlide(-1); // 오른쪽으로 드래그 → 이전
        else if (diff < -50) moveSlide(1); // 왼쪽으로 드래그 → 다음

        isDragging.current = false;
    };

    return (
        <div className="content5-container">
            <div className="roadon-pick-section">
                {/* 헤더 */}
                <div className="roadon-pick-header">
                    <h2 className="roadon-pick-title">
                        <p>
                            <span className="R">R</span>oad
                            <span className="O">O</span>n
                        </p>
                        <p>Pick</p>
                    </h2>
                    <p className="roadon-pick-description">
                        여행 전문가가 경험하고 선별한 숙소 큐레이션
                    </p>
                </div>

                {/* 슬라이더 */}
                <div
                    className="slider-container"
                    onMouseDown={handleDragStart}
                    onMouseUp={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchEnd={handleDragEnd}
                >
                    <button className="left-arrow" onClick={() => moveSlide(-1)}>
                        <MdArrowBackIos />
                    </button>

                    <div className="slider-content">
                        {slides.map((slide, index) => (
                            <div key={slide.id} className={`slide ${getPositionClass(index)}`}>
                                <div className="media">
                                    <img src={slide.image} alt={slide.alt} />
                                </div>

                                {getPositionClass(index) === 'position-3' && (
                                    <div className="card-overlay">
                                        <div className="top-info">
                                            <p className="location">강릉시 · 강릉 강문해변 앞</p>
                                            <h3 className="hotel-name">세인트존스 호텔</h3>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button className="right-arrow" onClick={() => moveSlide(1)}>
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Content5;

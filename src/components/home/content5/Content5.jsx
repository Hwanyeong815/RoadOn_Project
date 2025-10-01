import { useState } from 'react';
import './style.scss';

const slides = [
    { id: 0, image: './images/main/road1.png', alt: '리조트' },
    { id: 1, image: './images/main/road2.png', alt: '세인트존스 호텔' },
    { id: 2, image: './images/main/road3.png', alt: '고층 건물' },
];

const Content5 = () => {
    const [currentSlide, setCurrentSlide] = useState(1);

    const getPositionClass = (index) => {
        const pos = (index - currentSlide + slides.length) % slides.length;
        if (pos === 1) return 'position-4'; // 오른쪽
        if (pos === slides.length - 1) return 'position-2'; // 왼쪽
        return pos === 0 ? 'position-3' : 'position-none'; // 중앙 or 숨김
    };

    const moveSlide = (dir) =>
        setCurrentSlide((prev) => (prev + dir + slides.length) % slides.length);

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
                <div className="slider-container">
                    {/* 좌우 화살표 */}
                    <button className="left-arrow" onClick={() => moveSlide(-1)}>
                        <ArrowIcon dir="left" />
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
                                        <div className="category-tags">
                                            <svg viewBox="0 0 100 100" className="category-svg">
                                                <defs>
                                                    <path
                                                        id="circle"
                                                        d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"
                                                    />
                                                </defs>
                                                {/* 필요 시 textPath 추가 */}
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button className="right-arrow" onClick={() => moveSlide(1)}>
                        <ArrowIcon dir="right" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ArrowIcon = ({ dir }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            d={dir === 'left' ? 'M15 18L9 12L15 6' : 'M9 18L15 12L9 6'}
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default Content5;

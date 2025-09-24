import { useState, useEffect } from "react";
import "./style.scss";

const Content5 = () => {
  const [currentSlide, setCurrentSlide] = useState(1); // 중앙 카드가 기본
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    { id: 0, image: "./images/main/road1.png", alt: "리조트" },
    { id: 1, image: "./images/main/road2.png", alt: "세인트존스 호텔" },
    { id: 2, image: "./images/main/road3.png", alt: "고층 건물" },
  ];

  // 슬라이드 위치 계산
  const getSlidePosition = (index) => {
    const totalSlides = slides.length;
    const centerIndex = currentSlide;

    // 현재 슬라이드 기준으로 상대적 위치 계산
    let relativePosition = index - centerIndex;

    // 순환 처리
    if (relativePosition > totalSlides / 2) {
      relativePosition -= totalSlides;
    } else if (relativePosition < -totalSlides / 2) {
      relativePosition += totalSlides;
    }

    return relativePosition;
  };

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="content5-container">
      {/* RoadOn PICK 섹션 */}
      <div className="roadon-pick-section">
        {/* 헤더 영역 */}
        <div className="roadon-pick-header">
          <h2 className="roadon-pick-title">
            <span className="road-text">R</span>
            <span className="oad-text">oad</span>
            <span className="o-text">O</span>
            <span className="n-text">n</span>
            <span className="pick-text"> PICK</span>
          </h2>
          <p className="roadon-pick-description">
            여행 전문가가 경험하고 선별한 숙소 큐레이션
          </p>
        </div>

        {/* 메인 슬라이더 영역 */}
        <div className="slider-container">
          {/* 좌측 화살표 */}
          <div className="left-arrow" onClick={goToPrevious}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* 슬라이더 콘텐츠 */}
          <div className="slider-content">
            {slides.map((slide, index) => {
              const position = getSlidePosition(index);
              let positionClass = "";

              if (position === -1) positionClass = "position-2"; // 좌측
              else if (position === 0) positionClass = "position-3"; // 중앙
              else if (position === 1) positionClass = "position-4"; // 우측
              else positionClass = "position-none"; // 숨김

              return (
                <div key={slide.id} className={`slide ${positionClass}`}>
                  <div className="media">
                    <img src={slide.image} alt={slide.alt} />
                  </div>
                  <div className="card-sections">
                    {/* 중앙 카드일 때만 오버레이 표시 */}
                    {position === 0 && (
                      <div className="card-overlay">
                        {/* 상단 정보 */}
                        <div className="top-info">
                          <p className="location">강릉시 · 강릉 강문해변 앞</p>
                          <h3 className="hotel-name">세인트존스 호텔</h3>
                        </div>
                        {/* 하단 카테고리 */}
                        <div className="category-tags">
                          <svg
                            viewBox="0 0 100 100"
                            width="150"
                            height="150"
                            className="category-svg"
                          >
                            <defs>
                              <path
                                id="circle"
                                d="
                                  M 50, 50
                                  m -37, 0
                                  a 37,37 0 1,1 74,0
                                  a 37,37 0 1,1 -74,0"
                              />
                            </defs>
                            {/* <text font-size="20">
                              <textPath href="#circle" startOffset="0%">
                                <tspan fill={currentSlide === 0 ? "#42BDCC" : "#666"}>빌라</tspan>
                                <tspan fill="#666"> · </tspan>
                                <tspan fill={currentSlide === 1 ? "#42BDCC" : "#666"}>호텔</tspan>
                                <tspan fill="#666"> · </tspan>
                                <tspan fill={currentSlide === 2 ? "#42BDCC" : "#666"}>펜션</tspan>
                              </textPath>
                            </text> */}
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* 그라데이션 배경 */}
            <div className="slider-content-background"></div>
          </div>

          {/* 우측 화살표 */}
          <div className="right-arrow" onClick={goToNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content5;

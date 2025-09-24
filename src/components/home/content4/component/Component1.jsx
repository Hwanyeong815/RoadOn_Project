import { useEffect } from "react";
import { gsap } from "gsap";

const Component1 = () => {
  // 텍스트를 매우 길게 만들어서 끊어지지 않게 함
  const LINE =
    "OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND  OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND" +
    "OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND  OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND" +
    "OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND  OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND";

  useEffect(() => {
    // 한 줄만 사용해서 무한 루프
    const dur = 20; // 긴 텍스트에 맞춰 시간 증가

    gsap.fromTo(
      "#tp1",
      { attr: { startOffset: "0%" } },
      {
        attr: { startOffset: "-100%" },
        duration: dur,
        ease: "linear",
        repeat: -1,
      }
    );
  }, []);

  return (
    <div
      className="flow-container"
      style={{
        position: "absolute",
        top: "600px", // 더 아래로 이동
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10, // content4_top보다 높게 설정
        pointerEvents: "none",
      }}
    >
      <svg
        className="flow-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-1000 4100 3000 1500" // 높이를 1200에서 1500으로 늘리고 Y 위치를 조정
        aria-hidden
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          {/* 새로운 패스로 변경 - 띠가 완전히 보이도록 조정 */}
          <path
            id="flowPath"
            d="M-1000,4250s200-80,400-100S-200,4280,200,4600s500,350,800,300,600-400,1500-200"
            fill="none"
          />
        </defs>

        {/* 주황 띠 */}
        <use
          href="#flowPath"
          stroke="#FF7F50"
          strokeWidth="80"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="band"
        />

        {/* 마스크 없이 텍스트 직접 표시 */}
        <text
          className="band-text"
          style={{
            fontSize: "28px", // 글자 크기를 더 크게
            fontWeight: "700", // 글자 굵기도 더 굵게
            fill: "white",
            letterSpacing: "2px", // 글자 간격도 더 넓게
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* 한 줄만 사용 */}
          <textPath
            id="tp1"
            href="#flowPath"
            startOffset="0%"
            textAnchor="start"
            dominantBaseline="middle"
          >
            {LINE}
          </textPath>
        </text>

        {/* DEALS 이미지를 리본 중간쪽 오른쪽 끝에 배치 */}
        <image
          href="/images/main/DEALS.png"
          x="1000"
          y="4200"
          width="1200"
          height="480"
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {/* 상품카드들 - 리본 가운데 배치 */}
      <div
        className="product-cards"
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        {/* 싱가포르 상품카드 */}
        <div
          className="product-card"
          style={{
            position: "relative",
            width: "880px",
            height: "300px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* 배경 이미지 */}
          <img
            src="./images/main/ticket3.png"
            alt="싱가포르"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "20px",
            }}
          />

          {/* 텍스트 내용 */}
          <div
            style={{
              position: "absolute",
              left: "30px",
              top: "30px",
              width: "400px",
              color: "#333",
              fontSize: "16px",
              lineHeight: "1.4",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "30px 30px 20px 30px",
              borderRadius: "15px",
            }}
          >
            <div
              style={{
                textDecoration: "line-through",
                color: "#999",
                fontSize: "22px",
              }}
            >
              500,000원
            </div>
            <div
              style={{
                color: "#FF6B6B",
                fontWeight: "bold",
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              349,000원~
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "25px",
                marginBottom: "10px",
              }}
            >
              싱가포르 6일
            </div>
            <div
              style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}
            >
              인천,부산 | 5,6일 | 왕복항공권 | 4성급 | 여행자보험
            </div>
            <div style={{ fontSize: "14px", color: "#888" }}>
              #마리나베이샌즈 #게스트룸 #공항근처 1박 #자유여행
            </div>
          </div>
        </div>

        {/* 오사카 상품카드 */}
        <div
          className="product-card"
          style={{
            position: "relative",
            width: "880px",
            height: "300px",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* 배경 이미지 */}
          <img
            src="./images/main/ticket1.png"
            alt="오사카"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "20px",
            }}
          />

          {/* 텍스트 내용 */}
          <div
            style={{
              position: "absolute",
              left: "30px",
              top: "30px",
              width: "400px",
              color: "#333",
              fontSize: "16px",
              lineHeight: "1.4",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: "30px 30px 20px 30px",
              borderRadius: "15px",
            }}
          >
            <div
              style={{
                textDecoration: "line-through",
                color: "#999",
                fontSize: "22px",
              }}
            >
              349,000원
            </div>
            <div
              style={{
                color: "#FF6B6B",
                fontWeight: "bold",
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              279,000원~
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "25px",
                marginBottom: "10px",
              }}
            >
              오사카 4일
            </div>
            <div
              style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}
            >
              인천,부산 | 3,4일 | 왕복항공권 | 3성급 | 여행자보험
            </div>
            <div style={{ fontSize: "14px", color: "#888" }}>
              #오사카 후지야 호텔 #시내중심 비즈니스급 호텔 #자유여행
            </div>
          </div>
        </div>
      </div>

      {/* 더보기 버튼 */}
      <button
        className="more-button"
        style={{
          position: "absolute",
          top: "700px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#42BDCC",
          color: "white",
          width: "180px",
          height: "45px",
          borderRadius: "30px",
          fontSize: "18px",
          fontWeight: "400",
          cursor: "pointer",
          border: "none",
          zIndex: 30,
          pointerEvents: "auto",
        }}
      >
        더보기
      </button>
    </div>
  );
};

export default Component1;

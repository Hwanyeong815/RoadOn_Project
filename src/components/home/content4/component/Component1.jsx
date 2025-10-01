import { useEffect } from 'react';
import { gsap } from 'gsap';
import './style.scss';

const Component1 = () => {
    // 텍스트를 매우 길게 만들어서 끊어지지 않게 함
    const LINE =
        'OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND  OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND' +
        'OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND  OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND' +
        'OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND  OSAKA TOKYO NHA TRANG FUKUOKA DANANG GUAM SAPPORO BALI PHUKET MANILA THAILAND';

    useEffect(() => {
        // 한 줄만 사용해서 무한 루프
        const dur = 20; // 긴 텍스트에 맞춰 시간 증가

        gsap.fromTo(
            '#tp1',
            { attr: { startOffset: '0%' } },
            {
                attr: { startOffset: '-100%' },
                duration: dur,
                ease: 'linear',
                repeat: -1,
            }
        );
    }, []);

    return (
        <div className="flow-container">
            <svg
                className="flow-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-1000 4100 3000 1500" // 높이를 1200에서 1500으로 늘리고 Y 위치를 조정
                aria-hidden
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
                <text className="band-text">
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
            </svg>
            <div className="content4_bg">
                <img src="/images/main/DEALS.png" alt="deals" />
                <img src="/images/main/hotflightBG.png" alt="flight" />
            </div>

            {/* 상품카드들 - 리본 가운데 배치 */}
            <div className="product-cards">
                {/* 싱가포르 상품카드 */}
                <div className="product-card">
                    {/* 배경 이미지 */}
                    <div className="img-wrap">
                        <img className="img-web" src="./images/main/ticket3.png" alt="싱가포르" />
                    </div>

                    {/* 텍스트 내용 */}
                    <div className="product-card__panel">
                        <div className="price-origin">500,000원</div>
                        <div className="price-sale">349,000원~</div>
                        <div className="title">싱가포르 6일</div>
                        <div className="meta">
                            인천,부산 | 5,6일 | 왕복항공권 | 4성급 | 여행자보험
                        </div>
                        <div className="tags">
                            #마리나베이샌즈 #게스트룸 #공항근처 1박 #자유여행
                        </div>
                    </div>
                </div>

                {/* 오사카 상품카드 */}
                <div className="product-card">
                    {/* 배경 이미지 */}
                    <div className="img-wrap">
                        <img src="./images/main/ticket1.png" alt="오사카" />
                    </div>

                    {/* 텍스트 내용 */}
                    <div className="product-card__panel">
                        <div className="price-origin">349,000원</div>
                        <div className="price-sale">279,000원~</div>
                        <div className="title">오사카 4일</div>
                        <div className="meta">
                            인천,부산 | 3,4일 | 왕복항공권 | 3성급 | 여행자보험
                        </div>
                        <div className="tags">
                            #오사카 후지야 호텔 #시내중심 비즈니스급 호텔 #자유여행
                        </div>
                    </div>
                </div>
            </div>

            {/* 더보기 버튼 */}
            <div className="more-button-wrap">
                <button className="more-button button g">더보기</button>
            </div>
        </div>
    );
};

export default Component1;

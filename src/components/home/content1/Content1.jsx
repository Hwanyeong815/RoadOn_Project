import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import './style.scss';
import RightOrbit from './component/RightOrbit';

const DATA = {
    drama: {
        tag: '#드라마',
        left: '/images/main/con1/drama.png',
        right: {
            top: '/images/main/con1/drama-top.png',
            center: '/images/main/con1/drama-center.png',
            bottom: '/images/main/con1/drama-bottom.png',
        },
    },
    enter: {
        tag: '#예능',
        left: '/images/main/con1/enter.png',
        right: {
            top: '/images/main/con1/enter-top.png',
            center: '/images/main/con1/enter-center.png',
            bottom: '/images/main/con1/enter-bottom.png',
        },
    },
    movie: {
        tag: '#영화',
        left: '/images/main/con1/movie.png',
        right: {
            top: '/images/main/con1/movie-top.png',
            center: '/images/main/con1/movie-center.png',
            bottom: '/images/main/con1/movie-bottom.png',
        },
    },
    kpop: {
        tag: '#K-POP',
        left: '/images/main/con1/kpop.png',
        right: {
            top: '/images/main/con1/kpop-top.png',
            center: '/images/main/con1/kpop-center.png',
            bottom: '/images/main/con1/kpop-bottom.png',
        },
    },
};

const KEYS = ['drama', 'enter', 'movie', 'kpop'];

export default function Content1() {
    const [active, setActive] = useState(0);
    const swiperRef = useRef(null);

    const go = (i) => {
        setActive(i);
        // loop 기준으로 안전하게 점프
        swiperRef.current?.slideToLoop(i, 500);
    };

    // 호버 시 자동재생 컨트롤
    const handleMouseEnter = () => swiperRef.current?.autoplay?.stop();
    const handleMouseLeave = () => swiperRef.current?.autoplay?.start();

    const k = KEYS[active];

    return (
        <div
            className="content content1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            // 모바일 터치 중에도 멈추고 싶으면 아래 주석 해제
            // onTouchStart={handleMouseEnter}
            // onTouchEnd={handleMouseLeave}
        >
            {/* Header */}
            <div className="content1-head-txt">
                <div className="inner">
                    <div className="title">
                        <strong>
                            <span className="r">R</span>oad<span className="o">O</span>n
                        </strong>
                        에서 준비한 <span className="thic">테마 여행지</span>
                    </div>
                    <ul className="content1-head-txt-line">
                        {KEYS.map((key, i) => (
                            <li
                                key={key}
                                className={i === active ? 'on' : ''}
                                onClick={() => go(i)}
                                role="button"
                            >
                                {DATA[key].tag}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 👇 숨김 Swiper: autoplay로 active를 전환 (UI 비노출) */}
            <Swiper
                modules={[EffectFade, Autoplay]}
                onSwiper={(sw) => (swiperRef.current = sw)}
                onSlideChange={(sw) => setActive(sw.activeIndex)}
                slidesPerView={1}
                effect="fade"
                speed={500}
                loop
                autoplay={{
                    delay: 8000, // 전환 주기(ms)
                    disableOnInteraction: false, // 상호작용 후에도 계속
                }}
                style={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            >
                {KEYS.map((key) => (
                    <SwiperSlide key={key} />
                ))}
            </Swiper>

            {/* 본문: left만 (right는 절대배치로 분리) */}
            <div className="content1-body">
                <section className="left">
                    <div className="img-wrap">
                        <img src={DATA[k].left} alt={DATA[k].tag.replace('#', '')} />
                    </div>
                    {/* 필요 시 B 방식 모디파이어: button-reserve--${k} */}
                    <button className={`button g middle button-reserve button-reserve--${k}`}>
                        예약하기
                    </button>
                </section>
            </div>

            {/* RightOrbit: .content1 기준 absolute */}
            <RightOrbit images={DATA[k].right} offsetX="12vw" offsetY="0vw" animate={false} />
        </div>
    );
}

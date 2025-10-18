import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './style.scss';
import RightOrbit from './component/RightOrbit';

const DATA = {
    drama: {
        tag: '드라마',
        left: {
            desktop: '/images/main/con1/drama.png',
            mobile: '/images/main/con1/drama-mobile.png',
        },
        right: {
            top: '/images/main/con1/drama-top.png',
            center: '/images/main/con1/drama-center.png',
            bottom: '/images/main/con1/drama-bottom.png',
        },
    },
    enter: {
        tag: '예능',
        left: {
            desktop: '/images/main/con1/enter.png',
            mobile: '/images/main/con1/enter-mobile.png',
        },
        right: {
            top: '/images/main/con1/enter-top.png',
            center: '/images/main/con1/enter-center.png',
            bottom: '/images/main/con1/enter-bottom.png',
        },
    },
    movie: {
        tag: '영화',
        left: {
            desktop: '/images/main/con1/movie.png',
            mobile: '/images/main/con1/movie-mobile.png',
        },
        right: {
            top: '/images/main/con1/movie-top.png',
            center: '/images/main/con1/movie-center.png',
            bottom: '/images/main/con1/movie-bottom.png',
        },
    },
    kpop: {
        tag: 'K-POP',
        left: {
            desktop: '/images/main/con1/kpop.png',
            mobile: '/images/main/con1/kpop-mobile.png',
        },
        right: {
            top: '/images/main/con1/kpop-top.png',
            center: '/images/main/con1/kpop-center.png',
            bottom: '/images/main/con1/kpop-bottom.png',
        },
    },
};

const KEYS = ['drama', 'enter', 'movie', 'kpop'];

const Content1 = () => {
    const navigate = useNavigate();

    const handleReserveClick = () => {
        navigate('/tour');
        setTimeout(() => {
            const target = document.querySelector('.tour-main-con2');
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    const [active, setActive] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const swiperRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const go = (i) => {
        setActive(i);
        swiperRef.current?.slideToLoop(i, 500);
    };

    const handleMouseEnter = () => swiperRef.current?.autoplay?.stop();
    const handleMouseLeave = () => swiperRef.current?.autoplay?.start();

    const k = KEYS[active];
    const leftImage = isMobile ? DATA[k].left.mobile : DATA[k].left.desktop;

    return (
        <div
            className="content content1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
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

            <Swiper
                modules={[EffectFade, Autoplay]}
                onSwiper={(sw) => (swiperRef.current = sw)}
                onSlideChange={(sw) => setActive(sw.activeIndex)}
                slidesPerView={1}
                effect="fade"
                speed={500}
                loop
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
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

            <div className="content1-body">
                <section className="left">
                    <div className="img-wrap">
                        <img
                            className="img img-desktop"
                            src={DATA[k].left.desktop}
                            alt={DATA[k].tag}
                        />
                        <img
                            className="img img-mobile"
                            src={DATA[k].left.mobile}
                            alt={DATA[k].tag}
                        />
                    </div>
                    <button
                        className={`button g middle button-reserve button-reserve--${k}`}
                        onClick={handleReserveClick}
                    >
                        예약하기
                    </button>
                </section>
            </div>

            <RightOrbit images={DATA[k].right} offsetX="12vw" offsetY="0vw" animate={false} />
        </div>
    );
};

export default Content1;

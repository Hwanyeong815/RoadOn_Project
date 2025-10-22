// CouponEvent.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.scss';
import CouponButton from '../../ui/coupon/CouponButton';

gsap.registerPlugin(ScrollTrigger);

/* ===================== 튜닝 포인트 ===================== *
 * [가로 흘러가기]
 *  - MARQUEE_DURATION_SEC: 커질수록 "느려짐" (등속 이동)
 *  - MARQUEE_EASE: 'linear' 또는 'none'이면 완전 등속
 *
 * [상하 출렁임]
 *  - FLOAT_AMPLITUDE_PX: 진폭(모바일/데스크탑). 낮출수록 덜 출렁
 *  - FLOAT_FREQUENCY_HZ: 1초당 왕복 횟수(빈도). 낮출수록 덜 자주 출렁
 *  - FLOAT_EASE: 출렁 리듬
 * ====================================================== */
const MARQUEE_DURATION_SEC = 42; // ⏱ 이전 30 → 42 (더 느리게)
const MARQUEE_EASE = 'linear'; // 🧠 등속 이동

const FLOAT_AMPLITUDE_PX = {
    // 🫧 진폭 ↓ (덜 출렁)
    mobile: 16, // 이전 40 → 16
    desktop: 80, // 이전 160 → 80
};
const FLOAT_FREQUENCY_HZ = 0.35; // 🎚 빈도 ↓ (덜 자주 출렁: 왕복≈2.86초)
const FLOAT_EASE = 'sine.inOut'; // 🎵 자연스러운 리듬

// hover 시에도 계속 흐르게 유지
const PAUSE_ON_HOVER = false;

const coupons = [
    { id: 1, image: '/images/main/coupon1.png', alt: '2% 적립쿠폰' },
    { id: 2, image: '/images/main/coupon2.png', alt: '5% 할인쿠폰' },
    { id: 3, image: '/images/main/coupon3.png', alt: '20% 할인쿠폰' },
    { id: 4, image: '/images/main/coupon4.png', alt: '12% 할인쿠폰' },
    { id: 5, image: '/images/main/coupon5.png', alt: '3만원 적립쿠폰' },
    { id: 6, image: '/images/main/coupon6.png', alt: '20% 할인쿠폰' },
];

const CouponEvent = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const marqueeWrapperRef = useRef(null);
    const marqueeRef = useRef(null);

    const marqueeTweenRef = useRef(null);
    const floatTweensRef = useRef([]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const ctx = gsap.context(() => {
            // 타이틀 인 애니메이션
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: -30, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        once: true,
                    },
                }
            );

            // 🌀 끊김 없는 가로 마퀴 (기존 클래스 유지: .marquee-wrapper / .marquee)
            const setupMarquee = () => {
                const marquee = marqueeRef.current;
                if (!marquee) return;

                // 이전 트윈 정리
                marqueeTweenRef.current?.kill();

                // 리스트를 3배로 깔았다는 가정 → 1세트 길이
                const totalWidth = marquee.scrollWidth / 3;

                // 등속으로 totalWidth만큼 이동하고 wrap으로 자연 반복
                gsap.set(marquee, { x: 0 });
                marqueeTweenRef.current = gsap.to(marquee, {
                    x: -totalWidth,
                    duration: MARQUEE_DURATION_SEC, // ⏱ 느리게
                    ease: MARQUEE_EASE, // 🧠 등속 이동
                    repeat: -1,
                    modifiers: {
                        x: gsap.utils.unitize((x) => parseFloat(x) % -totalWidth),
                    },
                    force3D: true,
                });
            };

            // 🌊 상하 출렁 (덜 출렁이도록 조정)
            const setupFloating = () => {
                floatTweensRef.current.forEach((t) => t.kill());
                floatTweensRef.current = [];

                const prefersReduced = window.matchMedia?.(
                    '(prefers-reduced-motion: reduce)'
                ).matches;
                if (prefersReduced) return;

                const items = marqueeRef.current?.querySelectorAll('.coupon-item') ?? [];

                const halfCycleSec = 1 / Math.max(FLOAT_FREQUENCY_HZ, 0.0001) / 2;
                const isMobile = window.innerWidth < 768;
                const amplitude = isMobile ? FLOAT_AMPLITUDE_PX.mobile : FLOAT_AMPLITUDE_PX.desktop;

                items.forEach((item, i) => {
                    const t = gsap.to(item, {
                        y: amplitude, // 🫧 진폭 (감소)
                        duration: halfCycleSec, // 🎚 빈도 (감소)
                        repeat: -1,
                        yoyo: true,
                        ease: FLOAT_EASE,
                        delay: i * 0.08, // 약간만 위상 차
                        force3D: true,
                    });
                    floatTweensRef.current.push(t);
                });
            };

            setupMarquee();
            setupFloating();

            // hover 일시정지 제거(옵션)
            let onEnter, onLeave;
            const wrapper = marqueeWrapperRef.current;
            if (PAUSE_ON_HOVER && wrapper) {
                onEnter = () => {
                    marqueeTweenRef.current?.pause();
                    floatTweensRef.current.forEach((t) => t.pause());
                };
                onLeave = () => {
                    marqueeTweenRef.current?.resume();
                    floatTweensRef.current.forEach((t) => t.resume());
                };
                wrapper.addEventListener('mouseenter', onEnter);
                wrapper.addEventListener('mouseleave', onLeave);
            }

            // 리사이즈 대응
            let raf;
            const onResize = () => {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    setupMarquee();
                    setupFloating();
                    ScrollTrigger.refresh();
                });
            };
            window.addEventListener('resize', onResize);

            // cleanup
            return () => {
                if (PAUSE_ON_HOVER && wrapper) {
                    wrapper.removeEventListener('mouseenter', onEnter);
                    wrapper.removeEventListener('mouseleave', onLeave);
                }
                window.removeEventListener('resize', onResize);
                marqueeTweenRef.current?.kill();
                floatTweensRef.current.forEach((t) => t.kill());
                floatTweensRef.current = [];
                ScrollTrigger.getAll().forEach((st) => st.kill());
            };
        }, containerRef);

        return () => ctx?.revert?.();
    }, []);

    // 끊김 방지를 위한 3배 복제 (기존 구조 유지)
    const list = [...coupons, ...coupons, ...coupons];

    return (
        <div className="coupon-event-container" ref={containerRef}>
            <div className="inner">
                <div className="coupon-header" ref={titleRef}>
                    <h2 className="head">
                        SPECIAL <span>EVENT</span>
                    </h2>
                    <p className="subhead">뭘 좋아할지 몰라 다 준비했어요!</p>
                    <div className="coupon_down">
                        <CouponButton />
                    </div>
                </div>

                <div className="couponbg">
                    <img src="/images/main/couponbg.png" alt="couponbg" />
                </div>
            </div>

            <div className="marquee-wrapper" ref={marqueeWrapperRef}>
                <div className="marquee" ref={marqueeRef} style={{ willChange: 'transform' }}>
                    {list.map((coupon, idx) => (
                        <div className="coupon-item" key={`${coupon.id}-${idx}`}>
                            <img
                                src={coupon.image}
                                alt={coupon.alt}
                                className="coupon-image"
                                draggable={false}
                                onError={(e) => {
                                    e.currentTarget.src = '';
                                }} // 스켈레톤 트리거
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CouponEvent;

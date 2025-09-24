// TourMainCon1.jsx
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import TourCon1Item from './tourCon/TourCon1Item';

const arrTour = [
    { id: 1, img: '/images/tour/main/con1_01.png', alt: 'con1' },
    { id: 2, img: '/images/tour/main/con1_02.png', alt: 'con2' },
    { id: 3, img: '/images/tour/main/con1_03.png', alt: 'con3' },
    { id: 4, img: '/images/tour/main/con1_04.png', alt: 'con4' },
    { id: 5, img: '/images/tour/main/con1_05.png', alt: 'con5' },
    { id: 6, img: '/images/tour/main/con1_06.png', alt: 'con6' },
    { id: 7, img: '/images/tour/main/con1_07.png', alt: 'con7' },
    { id: 8, img: '/images/tour/main/con1_08.png', alt: 'con8' },
];

const W = 290;
const BASE_GAP = 16;
const MAX_SCALE = 1.25;

const scaleByDistance = (d) => Math.max(0.88, MAX_SCALE - 0.15 * Math.abs(d));
const over = (s) => ((s - 1) * W) / 2;

const TourMainCon1 = ({
    titleInitPx = 80,
    titleInitColor = '#fff',
    subInitPx = 60, // ← 서브타이틀 "시작 크기" 여기서 조절
    subInitColor = '#fff',
    hold = 0.35,
    speed = 0.9,

    // 타이밍 컨트롤
    titlePreHoldSec = 0.3, // 처음 크게 정지
    titleSoloHoldSec = 0, // 이후 정지(기본 0)
    subDelayAfterTitle = 0.1, // 타이틀 축소 시작 후 0.1s에 서브 시작
    slideAppearAfterSec = 0.1, // 타이틀 축소 시작 후 0.1s에 슬라이드/헤더 시작
    headerDurationSec = 0.8,
}) => {
    const [hoverIndex, setHoverIndex] = useState(null);

    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const titleStrongRef = useRef(null); // span은 유지하지만 두께 트윈은 제거됨
    const subRef = useRef(null);
    const slideRef = useRef(null);

    const scales = useMemo(() => {
        if (hoverIndex == null) return arrTour.map(() => 1);
        return arrTour.map((_, i) => scaleByDistance(i - hoverIndex));
    }, [hoverIndex]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const headerEl = document.querySelector('.site-header');
            const titleEl = titleRef.current;
            const subEl = subRef.current;
            const slideEl = slideRef.current;

            // 최종 스타일 읽기
            const titleCS = getComputedStyle(titleEl);
            const titleFinalColor = titleCS.color;
            const titleFinalPx = parseFloat(titleCS.fontSize) || 50;

            const subCS = getComputedStyle(subEl);
            const subFinalColor = subCS.color;
            const subFinalPx = parseFloat(subCS.fontSize) || 24;

            // px → scale
            const titleInitScale = Math.max(0.1, titleInitPx / titleFinalPx);
            const subInitScale = Math.max(0.1, subInitPx / subFinalPx);

            // 초기 상태 세팅
            if (headerEl)
                gsap.set(headerEl, { autoAlpha: 0, y: -24, willChange: 'transform,opacity' });

            // 타이틀: 처음부터 "큼 + 보임" 상태로 고정(정지용)
            gsap.set(titleEl, {
                scale: titleInitScale,
                color: titleInitColor,
                autoAlpha: 1,
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity',
            });

            gsap.set(subEl, {
                scale: subInitScale,
                color: subInitColor,
                autoAlpha: 0,
                y: 8,
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity',
            });
            gsap.set(slideEl, { autoAlpha: 0, y: 24, willChange: 'transform, opacity' });

            // ===== 타임라인 =====
            const TITLE_DUR = 1.2;
            const SUB_DUR = 1.3;
            const SLIDE_DUR = 0.7;

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } }).timeScale(speed);

            // (0) 큰 타이틀 "정지"
            tl.to({}, { duration: titlePreHoldSec, ease: 'none' }, 0);

            // 기준 라벨: 타이틀 축소 시작 시점(정지 직후)
            tl.addLabel('titleStart');

            // (1) 타이틀 축소 & 컬러 전환
            tl.to(titleEl, { scale: 1, color: titleFinalColor, duration: TITLE_DUR }, 'titleStart');

            // (1.5) 선택: 이후 정지(기본 0초)
            if (titleSoloHoldSec > 0) tl.to({}, { duration: titleSoloHoldSec }, '>');

            // (2) 서브: 타이틀 시작 subDelayAfterTitle 뒤에 겹쳐서 시작
            tl.to(
                subEl,
                { autoAlpha: 1, y: 0, scale: 1, color: subFinalColor, duration: SUB_DUR },
                `titleStart+=${subDelayAfterTitle}`
            );

            // (3) 슬라이드 & 헤더: 동일 타이밍에 겹쳐 시작
            tl.addLabel('slideStart', `titleStart+=${slideAppearAfterSec}`);
            tl.to(slideEl, { autoAlpha: 1, y: 0, duration: SLIDE_DUR }, 'slideStart').from(
                slideEl.querySelectorAll('.img-wrap') || [],
                {
                    y: 30,
                    autoAlpha: 0,
                    duration: 0.5,
                    stagger: 0.07,
                },
                '<'
            );

            if (headerEl) {
                tl.to(
                    headerEl,
                    { autoAlpha: 1, y: 0, duration: headerDurationSec, ease: 'power2.out' },
                    'slideStart'
                );
            }

            // (4) 약간 대기
            tl.to({}, { duration: hold }, '>');

            // 정리
            tl.add(() => {
                const clear = { clearProps: 'will-change' };
                if (headerEl) gsap.set(headerEl, clear);
                gsap.set([titleEl, subEl, slideEl], clear);
            });
        }, rootRef);

        return () => ctx.revert();
    }, [
        titleInitPx,
        titleInitColor,
        subInitPx, // 서브 시작 크기 의존
        subInitColor,
        hold,
        speed,
        titlePreHoldSec,
        titleSoloHoldSec,
        subDelayAfterTitle,
        slideAppearAfterSec,
        headerDurationSec,
    ]);

    return (
        <section className="tour-main-con tour-main-con1" ref={rootRef}>
            <div className="head-txt-box">
                <h2 ref={titleRef}>
                    <span ref={titleStrongRef}>SCENE TOUR</span> <br />
                    From Screen to Scene
                </h2>
                <p ref={subRef}>화면 속 순간을 여행의 장면으로</p>
            </div>

            <ul
                className="body-slide"
                ref={slideRef}
                onMouseLeave={() => setHoverIndex(null)}
                style={{ gap: 0 }}
            >
                {arrTour.map((t, i) => {
                    const s = scales[i];
                    const liftY = (s - 1) * 40;
                    const ml = i === 0 ? 0 : BASE_GAP + over(scales[i - 1]) + over(s);
                    const z = hoverIndex == null ? 1 : 100 - Math.abs(i - hoverIndex);
                    const opacity =
                        hoverIndex == null ? 1 : Math.max(0.5, 1 - 0.1 * Math.abs(i - hoverIndex));
                    return (
                        <TourCon1Item
                            key={t.id}
                            item={t}
                            onEnter={() => setHoverIndex(i)}
                            style={{
                                marginLeft: ml,
                                transform: `translateY(${-liftY}px) scale(${s})`,
                                zIndex: z,
                                opacity,
                                transition:
                                    'transform .35s cubic-bezier(.2,.7,.2,1), margin-left .35s, opacity .25s',
                            }}
                        />
                    );
                })}
            </ul>
        </section>
    );
};

export default TourMainCon1;

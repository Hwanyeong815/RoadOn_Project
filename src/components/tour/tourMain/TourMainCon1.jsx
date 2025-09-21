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

const W = 290,
    BASE_GAP = 16,
    MAX_SCALE = 1.25;
const scaleByDistance = (d) => Math.max(0.88, MAX_SCALE - 0.15 * Math.abs(d));
const over = (s) => ((s - 1) * W) / 2;

export default function TourMainCon1({
    titleInitPx = 150,
    titleInitColor = '#ffb703',
    subInitPx = 72,
    subInitColor = '#ffffff',
    hold = 0.35,
    speed = 0.9,
    titleInitWeight = 700, // (사용 안함) 초기 두께 트윈 제거됨
    titleFinalWeight = null, // 최종 두께(없으면 CSS값 사용)

    // 타이밍 컨트롤
    titleSoloHoldSec = 0.8, // 제목만 잠시 머무는 시간
    subDelayAfterTitle = 0.1, // 제목+대기 후 서브 텍스트 지연
    slideAppearAfterSec = 0.25, // 서브 뒤 슬라이드 지연
    headerDurationSec = 0.9, // 헤더 등장 속도(슬라이드와 동시)
}) {
    const [hoverIndex, setHoverIndex] = useState(null);

    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const titleStrongRef = useRef(null); // 첫 줄(span)
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
            const titleStrongEl = titleStrongRef.current;

            // 최종 스타일
            const titleCS = getComputedStyle(titleEl);
            const titleFinalColor = titleCS.color;
            const titleFinalPx = parseFloat(titleCS.fontSize) || 50;

            const strongCS = titleStrongEl ? getComputedStyle(titleStrongEl) : titleCS;
            const titleFinalW =
                titleFinalWeight ??
                (parseInt(strongCS.fontWeight, 10) || parseInt(titleCS.fontWeight, 10) || 700);

            const subCS = getComputedStyle(subRef.current);
            const subFinalColor = subCS.color;
            const subFinalPx = parseFloat(subCS.fontSize) || 24;

            // px → scale
            const titleInitScale = Math.max(0.1, titleInitPx / titleFinalPx);
            const subInitScale = Math.max(0.1, subInitPx / subFinalPx);

            // 초기 상태
            if (headerEl)
                gsap.set(headerEl, { autoAlpha: 0, y: -24, willChange: 'transform, opacity' });

            // 타이틀: 두께를 애니메이션 전 '최종값'으로 고정 (가변 폰트 & 일반 모두)
            gsap.set(titleEl, {
                scale: titleInitScale,
                color: titleInitColor,
                autoAlpha: 0,
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity',
            });
            if (titleStrongEl) {
                gsap.set(titleStrongEl, {
                    fontWeight: titleFinalW, // ✅ 최종 두께로 고정
                    fontVariationSettings: `"wght" ${titleFinalW}`, // ✅ 가변 폰트도 고정
                });
            }

            gsap.set(subRef.current, {
                scale: subInitScale,
                color: subInitColor,
                autoAlpha: 0,
                y: 8,
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity',
            });
            gsap.set(slideRef.current, { autoAlpha: 0, y: 24, willChange: 'transform, opacity' });

            // ===== 타임라인 =====
            const TITLE_DUR = 1.2;
            const SUB_DUR = 1.05;
            const SLIDE_DUR = 0.7;

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } }).timeScale(speed);

            // (1) 타이틀 등장 (두께 트윈 없음)
            tl.to(
                titleEl,
                { autoAlpha: 1, scale: 1, color: titleFinalColor, duration: TITLE_DUR },
                0
            );

            // (1.5) 타이틀만 잠깐 유지
            tl.to({}, { duration: titleSoloHoldSec }, '>');

            // (2) 서브: 타이틀+대기 이후
            tl.to(
                subRef.current,
                { autoAlpha: 1, y: 0, scale: 1, color: subFinalColor, duration: SUB_DUR },
                `>${subDelayAfterTitle}`
            );

            // (3) 슬라이드 & 헤더 동시
            tl.addLabel('slideStart', `>${slideAppearAfterSec}`);

            tl.to(slideRef.current, { autoAlpha: 1, y: 0, duration: SLIDE_DUR }, 'slideStart').from(
                slideRef.current.querySelectorAll('.img-wrap'),
                { y: 30, autoAlpha: 0, duration: 0.5, stagger: 0.07 },
                '<'
            );

            if (headerEl) {
                tl.to(
                    headerEl,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: headerDurationSec,
                        ease: 'power2.out',
                    },
                    'slideStart'
                );
            }

            // (4) 약간 대기
            tl.to({}, { duration: hold }, '>');

            // 정리
            tl.add(() => {
                const clear = { clearProps: 'will-change' };
                if (headerEl) gsap.set(headerEl, clear);
                gsap.set([titleEl, subRef.current, slideRef.current], clear);
                if (titleStrongEl) gsap.set(titleStrongEl, { clearProps: 'fontVariationSettings' });
            });
        }, rootRef);

        return () => ctx.revert();
    }, [
        titleInitPx,
        titleInitColor,
        subInitPx,
        subInitColor,
        hold,
        speed,
        titleFinalWeight, // 최종 두께만 의존
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
}

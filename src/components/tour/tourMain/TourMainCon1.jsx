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

// 카드 레이아웃 계산(기존)
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
    titleInitWeight = 700, // ✅ h2 초기 굵기
    titleFinalWeight = null, // ✅ h2 최종 굵기(null이면 CSS의 최종값 읽어서 사용)
}) {
    const [hoverIndex, setHoverIndex] = useState(null);

    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const subRef = useRef(null);
    const slideRef = useRef(null);

    const scales = useMemo(() => {
        if (hoverIndex == null) return arrTour.map(() => 1);
        return arrTour.map((_, i) => scaleByDistance(i - hoverIndex));
    }, [hoverIndex]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const headerEl = document.querySelector('.site-header');

            // 최종 스타일 읽기
            const titleCS = getComputedStyle(titleRef.current);
            const titleFinalColor = titleCS.color;
            const titleFinalPx = parseFloat(titleCS.fontSize) || 50;
            const titleFinalW = titleFinalWeight ?? (parseInt(titleCS.fontWeight, 10) || 700);

            const subCS = getComputedStyle(subRef.current);
            const subFinalColor = subCS.color;
            const subFinalPx = parseFloat(subCS.fontSize) || 24;

            // px → scale 환산
            const titleInitScale = Math.max(0.1, titleInitPx / titleFinalPx);
            const subInitScale = Math.max(0.1, subInitPx / subFinalPx);

            // 초기 상태
            if (headerEl)
                gsap.set(headerEl, { autoAlpha: 0, y: -24, willChange: 'transform, opacity' });
            gsap.set(titleRef.current, {
                scale: titleInitScale,
                color: titleInitColor,
                autoAlpha: 0,
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity',
                fontWeight: titleInitWeight, // ✅ 초기 굵기 설정
                fontVariationSettings: `"wght" ${titleInitWeight}`, // ✅ 가변폰트면 부드럽게
            });
            gsap.set(subRef.current, {
                scale: subInitScale,
                color: subInitColor,
                autoAlpha: 0,
                y: 8,
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity',
            });
            gsap.set(slideRef.current, { autoAlpha: 0, y: 24, willChange: 'transform, opacity' });

            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } }).timeScale(speed);

            // 헤더
            if (headerEl) tl.to(headerEl, { autoAlpha: 1, y: 0, duration: 0.8 }, 0);

            // h2: 크게 → 최종 (색 + 굵기)
            tl.to(
                titleRef.current,
                { autoAlpha: 1, scale: 1, color: titleFinalColor, duration: 1.2 },
                0.1
            );

            // ✅ h2 굵기 부드럽게 (가변 폰트 wght 트윈)
            {
                const w = { val: titleInitWeight };
                const setVar = gsap.quickSetter(titleRef.current, 'fontVariationSettings');
                tl.to(
                    w,
                    {
                        val: titleFinalW,
                        duration: 1.2,
                        onUpdate: () => setVar(`"wght" ${w.val}`),
                    },
                    0.1
                )
                    // 폴백: 가변 폰트가 아니면 최종에 font-weight만 확정
                    .set(titleRef.current, { fontWeight: titleFinalW }, '>-0.01');
            }

            // p: 거의 동시에(살짝 늦게) 크게 → 최종
            tl.to(
                subRef.current,
                { autoAlpha: 1, y: 0, scale: 1, color: subFinalColor, duration: 1.05 },
                0.22
            );

            // 홀드
            tl.to({}, { duration: hold });

            // 슬라이드
            tl.to(slideRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, 0).from(
                slideRef.current.querySelectorAll('.img-wrap'),
                { y: 30, autoAlpha: 0, duration: 0.5, stagger: 0.07 },
                '<'
            );

            // will-change 정리
            tl.add(() => {
                const clear = { clearProps: 'will-change' };
                if (headerEl) gsap.set(headerEl, clear);
                gsap.set([titleRef.current, subRef.current, slideRef.current], clear);
                // 가변폰트 설정도 정리(필요 시 유지하려면 지우지 마세요)
                gsap.set(titleRef.current, { clearProps: 'fontVariationSettings' });
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
        titleInitWeight,
        titleFinalWeight,
    ]);

    return (
        <section className="tour-main-con tour-main-con1" ref={rootRef}>
            <div className="head-txt-box">
                <h2 ref={titleRef}>
                    <span>씬투어 </span>, <br /> OTT 속 그 장면을 여행으로
                </h2>
                <p ref={subRef}>화면 속 순간을 현실 여행으로 이어드립니다.</p>
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

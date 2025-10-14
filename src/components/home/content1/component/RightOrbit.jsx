import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ORBIT_PATH_D =
    'M1377 689.5C1377 309.804 1069.2 2 689.5 2C309.804 2 2 309.804 2 689.5C2 1069.2 309.804 1377 689.5 1377V1379C308.7 1379 0 1070.3 0 689.5C0 308.7 308.7 0 689.5 0C1070.3 0 1379 308.7 1379 689.5C1379 1070.3 1070.3 1379 689.5 1379V1377C1069.2 1377 1377 1069.2 1377 689.5Z';

const RightOrbit = ({
    images, // { top, center, bottom }
    animate = false, // 경로 따라 회전 애니메이션(기본 off)
    cycleMode = 'scroll', // 'time' | 'scroll'
    intervalMs = 1800, // ⬅ time 모드 텀: 짧게 (원하면 조정)
    crossfadeMs = 0.12, // ⬅ 페이드 시간: 아주 짧게
    triggerSelector = '.content1',
    start = 'top center',
    end = 'bottom center',
}) => {
    const rightRef = useRef(null);
    const stageRef = useRef(null);

    const imgTopRef = useRef(null);
    const imgCenterRef = useRef(null);
    const imgBottomRef = useRef(null);

    useEffect(() => {
        const right = rightRef.current;
        const stage = stageRef.current;
        if (!right || !stage) return;

        // path & scale
        stage.style.setProperty('--orbit-path', `path("${ORBIT_PATH_D}")`);
        const BASE = 1379;
        const resize = () => {
            const w = right.clientWidth || BASE;
            stage.style.setProperty('--scale', String(w / BASE));
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(right);

        // 순환: src만 교체 + 짧은 페이드
        const order = ['top', 'center', 'bottom'];
        const srcObj = { ...images };
        let shift = 0;
        let lastIdx = -1;

        const getSrcForSlot = (slotIdx, s) => {
            const key = order[(slotIdx - s + 300) % 3];
            return srcObj[key];
        };

        const swapWithFastFade = (imgEl, newSrc) => {
            if (!imgEl) return;
            if (imgEl.getAttribute('src') === newSrc) return;
            gsap.to(imgEl, {
                opacity: 0,
                duration: crossfadeMs,
                onComplete: () => {
                    imgEl.setAttribute('src', newSrc);
                    gsap.to(imgEl, { opacity: 1, duration: crossfadeMs });
                },
            });
        };

        const applyRotation = () => {
            swapWithFastFade(imgTopRef.current, getSrcForSlot(0, shift));
            swapWithFastFade(imgCenterRef.current, getSrcForSlot(1, shift));
            swapWithFastFade(imgBottomRef.current, getSrcForSlot(2, shift));
        };

        // 초기 반영
        applyRotation();

        let intervalId = null;
        let st = null;

        if (cycleMode === 'time') {
            intervalId = setInterval(() => {
                shift = (shift + 1) % 3;
                applyRotation();
            }, Math.max(600, intervalMs)); // 하한선 600ms
        } else {
            st = ScrollTrigger.create({
                trigger: triggerSelector,
                start,
                end,
                scrub: true,
                onUpdate: (self) => {
                    const idx = Math.min(2, Math.floor(self.progress * 3));
                    if (idx !== lastIdx) {
                        lastIdx = idx;
                        shift = idx;
                        applyRotation();
                    }
                },
            });
        }

        return () => {
            ro.disconnect();
            if (intervalId) clearInterval(intervalId);
            if (st) st.kill();
        };
    }, [images, animate, cycleMode, intervalMs, crossfadeMs, triggerSelector, start, end]);

    return (
        <section className="right" ref={rightRef}>
            <div className="right-shape-stage" ref={stageRef}>
                <div className={`right-shape top ${animate ? 'is-anim' : ''}`}>
                    <div className="img-wrap">
                        <img ref={imgTopRef} src={images.top} alt="" />
                    </div>
                </div>
                <div className={`right-shape center ${animate ? 'is-anim' : ''}`}>
                    <div className="img-wrap">
                        <img ref={imgCenterRef} src={images.center} alt="" />
                    </div>
                </div>
                <div className={`right-shape bottom ${animate ? 'is-anim' : ''}`}>
                    <div className="img-wrap">
                        <img ref={imgBottomRef} src={images.bottom} alt="" />
                    </div>
                </div>

                <svg className="circle-line" viewBox="0 0 1379 1379" aria-hidden="true">
                    <path d={ORBIT_PATH_D} />
                </svg>
            </div>
        </section>
    );
};

export default RightOrbit;

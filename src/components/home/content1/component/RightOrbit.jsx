// RightOrbit.jsx (scroll 모드: swap만, 페이드 제거)
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import './style.scss';

const ORBIT_PATH_D =
    'M1377 689.5C1377 309.804 1069.2 2 689.5 2C309.804 2 2 309.804 2 689.5C2 1069.2 309.804 1377 689.5 1377V1379C308.7 1379 0 1070.3 0 689.5C0 308.7 308.7 0 689.5 0C1070.3 0 1379 308.7 1379 689.5C1379 1070.3 1070.3 1379 689.5 1379V1377C1069.2 1377 1377 1069.2 1377 689.5Z';

const SLOT_DIST = { top: '12%', center: '48%', bottom: '85%' };
const ORDER = ['top', 'center', 'bottom'];

const RightOrbit = ({
    images, // { top, center, bottom }
    animate = false,
    moveEase = 'power3.inOut',
    swapAt = 0.5, // 이동 구간 중 어느 지점에서 src 교체할지(0~1)
    triggerSelector = '.content1',
    start = 'top center',
    end = 'bottom center',
}) => {
    const rightRef = useRef(null);
    const stageRef = useRef(null);
    const elTopRef = useRef(null);
    const elCenterRef = useRef(null);
    const elBottomRef = useRef(null);
    const imgTopRef = useRef(null);
    const imgCenterRef = useRef(null);
    const imgBottomRef = useRef(null);

    useEffect(() => {
        Object.values(images || {}).forEach((src) => {
            const im = new Image();
            im.src = src;
        });
    }, [images]);

    useEffect(() => {
        const right = rightRef.current;
        const stage = stageRef.current;
        const blobs = [elTopRef.current, elCenterRef.current, elBottomRef.current];
        const imgs = [imgTopRef.current, imgCenterRef.current, imgBottomRef.current];
        if (!right || !stage || blobs.some((b) => !b) || imgs.some((i) => !i)) return;

        // 경로 CSS 변수 주입
        stage.style.setProperty('--orbit-path', `path("${ORBIT_PATH_D}")`);
        const BASE = 1379;
        const applyScale = () => {
            const w = right.clientWidth || BASE;
            stage.style.setProperty('--scale', String(w / BASE));
        };
        applyScale();
        const ro = new ResizeObserver(applyScale);
        ro.observe(right);

        const setSlotClass = (el, slot) => {
            el.classList.remove(
                'as-top',
                'as-center',
                'as-bottom',
                'at-top',
                'at-center',
                'at-bottom',
                'moving-to-top',
                'moving-to-center',
                'moving-to-bottom'
            );
            el.classList.add(`as-${slot}`, `at-${slot}`);
        };

        // 초기 상태 스냅
        ORDER.forEach((slot, i) => {
            setSlotClass(blobs[i], slot);
            blobs[i].style.offsetDistance = SLOT_DIST[slot];
            imgs[i].setAttribute('src', images[slot]);
            imgs[i].style.opacity = 1;
        });

        // 스크러빙 타임라인(두 구간: 0→1, 1→2)
        const tl = gsap.timeline({ paused: true });

        const addMove = (shift) => {
            const targetSlots = blobs.map((_, i) => ORDER[(i + shift) % 3]);

            // 동시에 이동
            tl.to(
                [blobs[0], blobs[1], blobs[2]],
                {
                    offsetDistance(i) {
                        return SLOT_DIST[targetSlots[i]];
                    },
                    duration: 1,
                    ease: moveEase,
                },
                tl.duration()
            );

            // 스왑 타임(즉시 교체) — ★ 페이드 없음 (스크럽 중 투명 상태 머무는 문제 방지)
            const segStart = tl.duration() - 1;
            const swapTime = segStart + Math.max(0, Math.min(1, swapAt)) * 1;

            tl.add(() => {
                imgs.forEach((imgEl, i) => {
                    const slot = targetSlots[i];
                    const src = slot === 'center' ? images.center : images[slot];
                    if (imgEl.getAttribute('src') !== src) imgEl.setAttribute('src', src);
                });
            }, swapTime);

            // 도착 후 스냅 클래스
            tl.add(() => {
                blobs.forEach((el, i) => setSlotClass(el, targetSlots[i]));
            }, segStart + 1);
        };

        addMove(1); // top→center
        addMove(2); // center→bottom

        const st = ScrollTrigger.create({
            trigger: triggerSelector,
            start,
            end,
            scrub: true,
            animation: tl,
        });

        return () => {
            ro.disconnect();
            st.kill();
            tl.kill();
        };
    }, [images, moveEase, swapAt, triggerSelector, start, end]);

    return (
        <section className="right" ref={rightRef}>
            <div className="right-shape-stage" ref={stageRef}>
                <div className={`right-shape top ${animate ? 'is-anim' : ''}`} ref={elTopRef}>
                    <div className="img-wrap">
                        <img ref={imgTopRef} alt="" />
                    </div>
                </div>
                <div className={`right-shape center ${animate ? 'is-anim' : ''}`} ref={elCenterRef}>
                    <div className="img-wrap">
                        <img ref={imgCenterRef} alt="" />
                    </div>
                </div>
                <div className={`right-shape bottom ${animate ? 'is-anim' : ''}`} ref={elBottomRef}>
                    <div className="img-wrap">
                        <img ref={imgBottomRef} alt="" />
                    </div>
                </div>

                {/* 라인은 고정 (트윈 금지) */}
                <svg className="circle-line" viewBox="0 0 1379 1379" aria-hidden="true">
                    <path d={ORBIT_PATH_D} />
                </svg>
            </div>
        </section>
    );
};

export default RightOrbit;

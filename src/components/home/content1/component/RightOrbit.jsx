// RightOrbit.jsx (복붙용)
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ORBIT_PATH_D =
    'M1377 689.5C1377 309.804 1069.2 2 689.5 2C309.804 2 2 309.804 2 689.5C2 1069.2 309.804 1377 689.5 1377V1379C308.7 1379 0 1070.3 0 689.5C0 308.7 308.7 0 689.5 0C1070.3 0 1379 308.7 1379 689.5C1379 1070.3 1070.3 1379 689.5 1379V1377C1069.2 1377 1377 1069.2 1377 689.5Z';

// 경로상 위치 퍼센트
const SLOT_DIST = { top: '12%', center: '48%', bottom: '85%' };
// 슬롯 이름(인덱싱용)
const ORDER = ['top', 'center', 'bottom'];

const RightOrbit = ({
    images, // { top, center, bottom }
    animate = false, // 경로 따라 회전(기본 off)
    cycleMode = 'scroll', // 'time' | 'scroll'
    intervalMs = 2600, // time 모드 주기
    crossfadeMs = 0.12, // 이미지 페이드 시간(짧게)
    moveMs = 1.0, // 이동 트윈 시간
    moveEase = 'power3.inOut',
    swapAt = 0.5, // 이동 진행 비율에서 교체(0~1)
    triggerSelector = '.content1',
    start = 'top center',
    end = 'bottom center',
}) => {
    const rightRef = useRef(null);
    const stageRef = useRef(null);

    const imgTopRef = useRef(null);
    const imgCenterRef = useRef(null);
    const imgBottomRef = useRef(null);

    const elTopRef = useRef(null);
    const elCenterRef = useRef(null);
    const elBottomRef = useRef(null);

    // 최초 로드 시 이미지 프리로드 (깜빡임 완화)
    useEffect(() => {
        Object.values(images || {}).forEach((src) => {
            const im = new Image();
            im.src = src;
        });
    }, [images]);

    useEffect(() => {
        const right = rightRef.current;
        const stage = stageRef.current;
        const elTop = elTopRef.current;
        const elCenter = elCenterRef.current;
        const elBottom = elBottomRef.current;

        if (!right || !stage || !elTop || !elCenter || !elBottom) return;

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

        const blobs = [elTop, elCenter, elBottom];
        const imgs = [imgTopRef.current, imgCenterRef.current, imgBottomRef.current];

        const setSlotClass = (el, slot) => {
            el.classList.remove(
                'as-top',
                'as-center',
                'as-bottom',
                'at-top',
                'at-center',
                'at-bottom'
            );
            el.classList.add(`as-${slot}`, `at-${slot}`); // 크기/라운드 스냅 + 상태표시
        };
        const setMovingClass = (el, target) => {
            el.classList.remove('moving-to-top', 'moving-to-center', 'moving-to-bottom');
            el.classList.add(`moving-to-${target}`);
        };
        const clearMovingClass = (el) => {
            el.classList.remove('moving-to-top', 'moving-to-center', 'moving-to-bottom');
        };

        // 초기 셋업: 각 슬롯 위치/클래스 + 초기 이미지
        ORDER.forEach((slot, i) => {
            setSlotClass(blobs[i], slot);
            blobs[i].style.offsetDistance = SLOT_DIST[slot];
            imgs[i].setAttribute('src', images[slot]);
            imgs[i].style.opacity = 1;
        });

        let shift = 0;
        let lastIdx = -1;

        // 이동 + 교체를 한 타임라인에서 동기화
        const applyRotation = () => {
            const tl = gsap.timeline({ defaults: { ease: moveEase } });

            // 1) 이동 시작 표시 (클래스)
            blobs.forEach((el, i) => setMovingClass(el, ORDER[(i + shift) % 3]));

            // 2) 이동 트윈(동시 시작)
            tl.to(
                blobs[0],
                { offsetDistance: SLOT_DIST[ORDER[(0 + shift) % 3]], duration: moveMs },
                0
            );
            tl.to(
                blobs[1],
                { offsetDistance: SLOT_DIST[ORDER[(1 + shift) % 3]], duration: moveMs },
                0
            );
            tl.to(
                blobs[2],
                { offsetDistance: SLOT_DIST[ORDER[(2 + shift) % 3]], duration: moveMs },
                0
            );

            // 2.5) 중간 시점에서 3장 동시에 교체(짧은 페이드)
            const swapOffset = Math.max(0, Math.min(1, swapAt)) * moveMs;
            tl.add('swap', `+=${swapOffset}`)
                .to(imgs, { opacity: 0, duration: crossfadeMs }, 'swap')
                .add(() => {
                    imgs[0].setAttribute('src', images[ORDER[(0 - shift + 300) % 3]]);
                    imgs[1].setAttribute('src', images[ORDER[(1 - shift + 300) % 3]]);
                    imgs[2].setAttribute('src', images[ORDER[(2 - shift + 300) % 3]]);
                }, 'swap+=0')
                .to(imgs, { opacity: 1, duration: crossfadeMs }, 'swap+=0');

            // 3) 도착 후 스냅 클래스 부여 (크기/라운드 변경은 스냅으로)
            tl.add(() => {
                blobs.forEach((el, i) => {
                    clearMovingClass(el);
                    setSlotClass(el, ORDER[(i + shift) % 3]);
                });
            });
        };

        // 트리거: time or scroll
        let st = null;
        let intervalId = null;

        if (cycleMode === 'time') {
            intervalId = setInterval(() => {
                shift = (shift + 1) % 3;
                applyRotation();
            }, Math.max(800, intervalMs));
        } else {
            st = ScrollTrigger.create({
                trigger: triggerSelector,
                start,
                end,
                scrub: true,
                onUpdate: (self) => {
                    const idx = Math.min(2, Math.floor(self.progress * 3)); // 0,1,2
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
            if (st) st.kill();
            if (intervalId) clearInterval(intervalId);
        };
    }, [
        images,
        animate,
        cycleMode,
        intervalMs,
        crossfadeMs,
        moveMs,
        moveEase,
        swapAt,
        triggerSelector,
        start,
        end,
    ]);

    return (
        <section className="right" ref={rightRef}>
            <div className="right-shape-stage" ref={stageRef}>
                {/* blob 3개 (경로를 따라 배치) */}
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

                {/* 궤적 선 (stroke 쓰려면 fill="none" 추가) */}
                <svg className="circle-line" viewBox="0 0 1379 1379" aria-hidden="true">
                    <path d={ORBIT_PATH_D} />
                </svg>
            </div>
        </section>
    );
};

export default RightOrbit;

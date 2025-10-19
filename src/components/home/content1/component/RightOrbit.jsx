// RightOrbit.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
import './style.scss';

const ORBIT_PATH_D =
    'M1377 689.5C1377 309.804 1069.2 2 689.5 2C309.804 2 2 309.804 2 689.5C2 1069.2 309.804 1377 689.5 1377V1379C308.7 1379 0 1070.3 0 689.5C0 308.7 308.7 0 689.5 0C1070.3 0 1379 308.7 1379 689.5C1379 1070.3 1070.3 1379 689.5 1379V1377C1069.2 1377 1377 1069.2 1377 689.5Z';

const RightOrbit = ({
    images,
    moveEase = 'power4.inOut', // [TUNED] 더 느긋한 이징
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

    // 이미지 프리로드
    useEffect(() => {
        Object.values(images || {}).forEach((src) => {
            if (!src) return;
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

        const BASE = 1379;

        // CSS 슬롯값 읽기
        const readSlots = () => {
            const cs = getComputedStyle(right);
            return {
                top: cs.getPropertyValue('--slot-top')?.trim() || '12%',
                center: cs.getPropertyValue('--slot-center')?.trim() || '48%',
                bottom: cs.getPropertyValue('--slot-bottom')?.trim() || '85%',
            };
        };

        // path & scale 초기 설정
        stage.style.setProperty('--orbit-path', `path("${ORBIT_PATH_D}")`);
        stage.style.setProperty('--angle', '0deg'); // 회전 각 초기화
        let SLOT_DIST = readSlots();

        const applyScale = () => {
            const w = right.clientWidth || BASE;
            stage.style.setProperty('--scale', String(w / BASE));
            SLOT_DIST = readSlots(); // 리사이즈/미디어쿼리 전환 반영
        };
        applyScale();
        const ro = new ResizeObserver(applyScale);
        ro.observe(right);

        // 상태 클래스 스냅
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

        // 구도 시퀀스
        const SEQ_START = ['top', 'center', 'bottom']; // 시작
        const SEQ_MID = ['center', 'bottom', 'top']; // 1회 이동 후
        const SEQ_END = ['bottom', 'top', 'center']; // 2회 이동 후

        // ✨ 부드러운 이미지 스왑(크로스 페이드)
        const smoothSwap = (imgEl, newSrc, fade = 0.55) => {
            // [TUNED] 페이드 시간 ↑
            if (!newSrc || imgEl.getAttribute('src') === newSrc) return;
            const overlay = document.createElement('img');
            overlay.src = newSrc;
            overlay.alt = '';
            Object.assign(overlay.style, {
                position: 'absolute',
                inset: '0',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: 'inherit',
                opacity: '0',
                willChange: 'opacity',
            });
            const parent = imgEl.parentElement;
            parent.appendChild(overlay);
            gsap.to(overlay, { opacity: 1, duration: fade, ease: 'power2.out' });
            gsap.to(imgEl, {
                opacity: 0,
                duration: fade,
                ease: 'power2.out',
                onComplete: () => {
                    imgEl.setAttribute('src', newSrc);
                    imgEl.style.opacity = '1';
                    parent.removeChild(overlay);
                },
            });
        };

        // 특정 구도로 즉시 스냅(위치/클래스/이미지)
        const snapToOrder = (order) => {
            blobs.forEach((el, i) => {
                setSlotClass(el, order[i]);
                el.style.offsetDistance = SLOT_DIST[order[i]];
            });
            imgs.forEach((imgEl, i) => {
                const slot = order[i];
                const src = slot === 'center' ? images.center : images[slot];
                if (src && imgEl.getAttribute('src') !== src) imgEl.setAttribute('src', src);
            });
        };

        // 초기 배치
        snapToOrder(SEQ_START);

        // 모바일: 정지(정렬만) — 애니메이션/회전 스킵
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            ro.disconnect();
            return;
        }

        // ===== 데스크톱: "대부분 center 유지" + 스왑 크로스페이드 =====
        const tl = gsap.timeline({ paused: true });

        // [TUNED] 한층 더 느긋하게: 이동 ↓(0.05), 홀드 ↑(0.5)  → 총합 ≈ 1
        const HOLD_RATIO = 0.5;
        const MOVE_RATIO = 0.05;
        const D0 = HOLD_RATIO,
            M0 = MOVE_RATIO,
            D1 = HOLD_RATIO,
            M1 = MOVE_RATIO;

        // [TUNED] 스왑 지점도 약간 앞당겨 충격 완화
        const SWAP_POINT = 0.8;

        // 세그먼트별 1회 실행 플래그 (역스크롤 시 리셋)
        let seg1Swapped = false;
        let seg2Swapped = false;

        // 1) SEQ_START 유지
        tl.to({}, { duration: D0 });

        // 2) SEQ_START → SEQ_MID 이동
        tl.to([blobs[0], blobs[1], blobs[2]], {
            offsetDistance(i) {
                return SLOT_DIST[SEQ_MID[i]];
            },
            duration: M0,
            ease: moveEase,
            onUpdateParams: ['{self}'],
            onUpdate(self) {
                if (!seg1Swapped && self.progress >= SWAP_POINT) {
                    imgs.forEach((imgEl, i) => {
                        const slot = SEQ_MID[i];
                        const src = slot === 'center' ? images.center : images[slot];
                        smoothSwap(imgEl, src, 0.55); // [TUNED] 페이드 길게
                    });
                    seg1Swapped = true;
                }
            },
            onReverseComplete: () => {
                seg1Swapped = false;
            },
            onComplete: () => {
                snapToOrder(SEQ_MID);
            },
        });

        // 3) SEQ_MID 유지
        tl.to({}, { duration: D1 });

        // 4) SEQ_MID → SEQ_END 이동
        tl.to([blobs[0], blobs[1], blobs[2]], {
            offsetDistance(i) {
                return SLOT_DIST[SEQ_END[i]];
            },
            duration: M1,
            ease: moveEase,
            onUpdateParams: ['{self}'],
            onUpdate(self) {
                if (!seg2Swapped && self.progress >= SWAP_POINT) {
                    imgs.forEach((imgEl, i) => {
                        const slot = SEQ_END[i];
                        const src = slot === 'center' ? images.center : images[slot];
                        smoothSwap(imgEl, src, 0.55); // [TUNED]
                    });
                    seg2Swapped = true;
                }
            },
            onReverseComplete: () => {
                seg2Swapped = false;
            },
            onComplete: () => {
                snapToOrder(SEQ_END);
            },
        });

        // ===== ScrollTrigger: 스크롤 연동 회전 + 스무딩 =====
        const TURNS = 0.75; // [TUNED] 한 구간에서 0.75바퀴 → 회전 속도 ↓
        const st = ScrollTrigger.create({
            trigger: triggerSelector,
            start,
            end,
            scrub: 1.1, // [TUNED] 스무딩↑ → 훨씬 느긋한 반응
            animation: tl,
            // markers: true,
            onUpdate: (self) => {
                const p = self.progress; // 0~1
                stage.style.setProperty('--angle', `${p * 360 * TURNS}deg`);
            },
            onRefresh: () => {
                SLOT_DIST = readSlots();
                snapToOrder(SEQ_START);
                stage.style.setProperty('--angle', '0deg');
                seg1Swapped = false;
                seg2Swapped = false;
            },
        });

        return () => {
            ro.disconnect();
            st.kill();
            tl.kill();
        };
    }, [images, moveEase, triggerSelector, start, end]);

    return (
        <section className="right" ref={rightRef}>
            <div className="right-shape-stage" ref={stageRef}>
                <div className="right-shape" data-slot="top" ref={elTopRef}>
                    <div className="img-wrap">
                        <img ref={imgTopRef} alt="" />
                    </div>
                </div>
                <div className="right-shape" data-slot="center" ref={elCenterRef}>
                    <div className="img-wrap">
                        <img ref={imgCenterRef} alt="" />
                    </div>
                </div>
                <div className="right-shape" data-slot="bottom" ref={elBottomRef}>
                    <div className="img-wrap">
                        <img ref={imgBottomRef} alt="" />
                    </div>
                </div>

                {/* 라인은 BASE 좌표에 고정(회전/스케일은 stage가 담당) */}
                <svg
                    className="circle-line"
                    viewBox="0 0 1379 1379"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path d={ORBIT_PATH_D} vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </section>
    );
};

export default RightOrbit;

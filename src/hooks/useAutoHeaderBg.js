import { useEffect, useRef } from 'react';

/* 유틸: 색 문자열을 {r,g,b,a}로 반환 (hex, #fff, rgb(), rgba()) */
const parseColor = (s = '') => {
    if (!s) return null;
    const str = s.trim().toLowerCase();
    // hex #rrggbb or #rgb
    const hexMatch = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const h = hexMatch[1];
        if (h.length === 3) {
            const r = parseInt(h[0] + h[0], 16);
            const g = parseInt(h[1] + h[1], 16);
            const b = parseInt(h[2] + h[2], 16);
            return { r, g, b, a: 1 };
        } else {
            const r = parseInt(h.slice(0, 2), 16);
            const g = parseInt(h.slice(2, 4), 16);
            const b = parseInt(h.slice(4, 6), 16);
            return { r, g, b, a: 1 };
        }
    }
    // rgb/rgba
    const rgbMatch = str.match(/rgba?\(\s*([0-9]+),\s*([0-9]+),\s*([0-9]+)(?:,\s*([0-9.]+))?\s*\)/);
    if (rgbMatch) {
        return {
            r: +rgbMatch[1],
            g: +rgbMatch[2],
            b: +rgbMatch[3],
            a: rgbMatch[4] ? +rgbMatch[4] : 1,
        };
    }
    return null;
};

/* perceived luminance (0-255 scale) */
const luminance = ({ r, g, b }) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/* 투명한지 확인 */
const isTransparent = (s) => !s || s === 'transparent' || /rgba\(.+,\s*0\)$/.test(s);

/* 요소에서 의미있는 backgroundColor 찾기 (부모로 올라감) */
const getEffectiveBackgroundColor = (el) => {
    let cur = el;
    while (cur && cur !== document.documentElement) {
        const style = getComputedStyle(cur);
        const bg = style.backgroundColor;
        if (!isTransparent(bg))
            return {
                color: bg,
                hasBgImage: style.backgroundImage && style.backgroundImage !== 'none',
            };
        cur = cur.parentElement;
    }
    const bodyStyle = getComputedStyle(document.body);
    return {
        color: bodyStyle.backgroundColor,
        hasBgImage: bodyStyle.backgroundImage && bodyStyle.backgroundImage !== 'none',
    };
};

/**
 * 자동 감지 훅
 * - headerRef: header ref
 * - opts: { sampleCount: 3, offsetY: 2, luminanceThreshold: 245, requiredWhiteCount: 2 }
 */
const useAutoHeaderBgAuto = (headerRef, opts = {}) => {
    const {
        sampleCount = 3,
        offsetY = 2,
        luminanceThreshold = 245, // perceived luminance threshold (0-255)
        requiredWhiteCount = 2, // sampleCount 중 이 개수 이상이면 white 판정
        observeMutations = true,
    } = opts;

    const rafRef = useRef(null);
    const moRef = useRef(null);

    useEffect(() => {
        const header = headerRef?.current;
        if (!header) return;
        let headerHeight = header.offsetHeight || 0;

        const getSampleXs = (rect) => {
            // sampleCount 1 => center, 3 => left/center/right
            if (sampleCount === 1) return [Math.round(rect.left + rect.width / 2)];
            const leftX = Math.round(rect.left + 8);
            const rightX = Math.round(rect.right - 8);
            const centerX = Math.round(rect.left + rect.width / 2);
            if (sampleCount === 2) return [leftX, rightX];
            // default 3
            return [leftX, centerX, rightX];
        };

        const check = () => {
            if (!header) return;
            const rect = header.getBoundingClientRect();
            const xs = getSampleXs(rect);
            const y = Math.round(rect.bottom + offsetY);

            if (y < 0 || y > window.innerHeight) {
                header.classList.remove('bg-on');
                header.style.removeProperty('--header-bg');
                return;
            }

            let whiteCount = 0;

            xs.forEach((x) => {
                if (x < 0 || x > window.innerWidth) return;
                const el = document.elementFromPoint(x, y);
                if (!el) return;
                // 명시적 override가 섹션에 있으면 우선 처리
                const dataBg = el.closest('[data-bg]')?.dataset?.bg;
                if (dataBg) {
                    const norm = ('' + dataBg).trim().toLowerCase();
                    if (norm === 'white' || norm === '#fff' || norm === '#ffffff') whiteCount++;
                    return;
                }

                const { color, hasBgImage } = getEffectiveBackgroundColor(el);
                const parsed = parseColor(color);
                if (parsed) {
                    const L = luminance(parsed);
                    // 흰색에 가깝고 불투명(또는 알파>0.9)
                    if (L >= luminanceThreshold && parsed.a > 0.85) whiteCount++;
                    return;
                }
                // bg를 못 읽었거나 bg-image가 존재하면 보수적으로 white로 안 판단
                if (hasBgImage) {
                    // 이미지인데 element가 <img>이면서 same-origin이면 canvas로 픽셀 샘플링 시도해볼 수 있음.
                    // 여기선 안전모드: 이미지가 있으면 white로 간주하지 않음.
                    return;
                }
            });

            const isWhite = whiteCount >= requiredWhiteCount;
            if (isWhite) {
                header.classList.add('bg-on');
                header.style.setProperty('--header-bg', '#ffffff');
            } else {
                header.classList.remove('bg-on');
                header.style.removeProperty('--header-bg');
            }
        };

        const scheduleCheck = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(check);
        };

        // 초기 체크
        scheduleCheck();

        window.addEventListener('scroll', scheduleCheck, { passive: true });
        window.addEventListener('resize', scheduleCheck);

        // header 높이 변동 시 체크 로직 재계산 (rootMargin 개념 대신 바로 픽셀 샘플)
        let ro;
        if (window.ResizeObserver) {
            ro = new ResizeObserver(() => {
                const newH = header.offsetHeight || 0;
                if (newH !== headerHeight) {
                    headerHeight = newH;
                    scheduleCheck();
                }
            });
            ro.observe(header);
        }

        // DOM 변경(컨텐츠 변경) 감지 — 필요하면 활성화
        if (observeMutations && window.MutationObserver) {
            moRef.current = new MutationObserver(() => scheduleCheck());
            moRef.current.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
            });
        }

        // cleanup
        return () => {
            window.removeEventListener('scroll', scheduleCheck);
            window.removeEventListener('resize', scheduleCheck);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (ro) ro.disconnect();
            if (moRef.current) moRef.current.disconnect();
            header.style.removeProperty('--header-bg');
            header.classList.remove('bg-on');
        };
    }, [headerRef, sampleCount, offsetY, luminanceThreshold, requiredWhiteCount, observeMutations]);
};

export default useAutoHeaderBgAuto;

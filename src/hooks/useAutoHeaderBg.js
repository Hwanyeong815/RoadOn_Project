// src/hooks/useAutoHeaderBg.js
import { useLayoutEffect, useEffect, useRef } from 'react';

// helpers
const parseRgb = (s = '') => {
    const m = ('' + s).match(/rgba?\(\s*([0-9]+),\s*([0-9]+),\s*([0-9]+)(?:,\s*([0-9.]+))?\s*\)/);
    if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 };
    const hex = ('' + s).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
        const h = hex[1];
        if (h.length === 3)
            return {
                r: parseInt(h[0] + h[0], 16),
                g: parseInt(h[1] + h[1], 16),
                b: parseInt(h[2] + h[2], 16),
                a: 1,
            };
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
            a: 1,
        };
    }
    return null;
};

const luminance = ({ r, g, b }) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const isTransparent = (s = '') => !s || s === 'transparent' || /rgba\(.+, ?0\)/.test(s);

const getEffectiveBg = (el) => {
    let cur = el;
    while (cur && cur !== document.documentElement) {
        const cs = getComputedStyle(cur);
        const bg = cs.backgroundColor;
        if (!isTransparent(bg))
            return { color: bg, hasBgImage: cs.backgroundImage && cs.backgroundImage !== 'none' };
        cur = cur.parentElement;
    }
    const cs = getComputedStyle(document.body);
    return {
        color: cs.backgroundColor,
        hasBgImage: cs.backgroundImage && cs.backgroundImage !== 'none',
    };
};

const useAutoHeaderBg = (headerRef, opts = {}) => {
    const {
        offsetY = 2,
        stabilizeMs = 250, // ⬅️ 150 → 250으로 변경 (깜빡임 완화)
        L_ON = 250,
        L_OFF = 235,
        minScrollForOn = 0,
        deps = [],
    } = opts;

    const rafRef = useRef(null);
    const pendingTimerRef = useRef(null);
    const lastAppliedRef = useRef(null);

    const applyState = (header, isWhite, color = '#ffffff') => {
        if (!header) return;
        if (lastAppliedRef.current === isWhite) return;
        lastAppliedRef.current = isWhite;
        if (isWhite) {
            header.classList.add('bg-on');
            header.style.setProperty('--header-bg', color);
            header.style.setProperty('--header-fg', '#111111');
        } else {
            header.classList.remove('bg-on');
            header.style.removeProperty('--header-bg');
            header.style.removeProperty('--header-fg');
        }
    };

    const checkPointIsWhite = (x, y, Lthreshold) => {
        if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) return false;
        const el = document.elementFromPoint(x, y);
        if (!el) return false;

        const ov = el.closest('[data-bg]')?.dataset?.bg;
        if (ov) {
            const s = ('' + ov).trim().toLowerCase();
            return s === 'white' || s === '#fff' || s === '#ffffff';
        }
        if (el === document.body || el === document.documentElement) return false;

        const { color, hasBgImage } = getEffectiveBg(el);
        const p = parseRgb(color);
        if (!p || hasBgImage || p.a <= 0.85) return false;
        return luminance(p) >= Lthreshold;
    };

    const manualCheck = (header, isCurrentlyOn) => {
        if (!header) return false;

        // 스크롤이 충분히 내려가기 전에는 항상 OFF
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (!isCurrentlyOn && y < minScrollForOn) return false;
        if (isCurrentlyOn && y < minScrollForOn) return false;

        const rect = header.getBoundingClientRect();
        const xs = [
            Math.round(rect.left + 8),
            Math.round(rect.left + rect.width / 2),
            Math.round(rect.right - 8),
        ];
        const y1 = Math.round(rect.bottom + offsetY);
        const y2 = y1 + 12;
        const Lth = isCurrentlyOn ? L_OFF : L_ON;

        let cnt = 0;
        [y1, y2].forEach((Y) =>
            xs.forEach((X) => {
                if (checkPointIsWhite(X, Y, Lth)) cnt++;
            })
        );

        return isCurrentlyOn ? cnt >= 2 : cnt >= 2;
    };

    const scheduleCheck = (header) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const result = manualCheck(header, !!lastAppliedRef.current);
            if (result === lastAppliedRef.current) {
                if (pendingTimerRef.current) {
                    clearTimeout(pendingTimerRef.current);
                    pendingTimerRef.current = null;
                }
                return;
            }
            if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
            pendingTimerRef.current = setTimeout(() => {
                const confirm = manualCheck(header, !!lastAppliedRef.current);
                applyState(header, confirm);
                pendingTimerRef.current = null;
            }, stabilizeMs);
        });
    };

    useLayoutEffect(() => {
        const header = headerRef?.current;
        if (!header) return;
        const first = manualCheck(header, !!lastAppliedRef.current);
        applyState(header, first);
        scheduleCheck(header);
        const t1 = setTimeout(() => scheduleCheck(header), 60);
        const t2 = setTimeout(() => scheduleCheck(header), 200);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headerRef]);

    useEffect(() => {
        const header = headerRef?.current;
        if (!header) return;

        const onScrollResize = () => scheduleCheck(header);
        window.addEventListener('scroll', onScrollResize, { passive: true });
        window.addEventListener('resize', onScrollResize);
        const onPageShow = () => scheduleCheck(header);
        window.addEventListener('pageshow', onPageShow);
        if (document.fonts && document.fonts.ready)
            document.fonts.ready.then(() => scheduleCheck(header));

        scheduleCheck(header);

        return () => {
            window.removeEventListener('scroll', onScrollResize);
            window.removeEventListener('resize', onScrollResize);
            window.removeEventListener('pageshow', onPageShow);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [headerRef, offsetY, stabilizeMs, L_ON, L_OFF, minScrollForOn, ...deps]);
};

export default useAutoHeaderBg;

// src/components/tour/TourMain/index.jsx
import './style.scss';
import { useEffect } from 'react';
import TourMainCon1 from './TourMainCon1';
import TourMainCon2 from './TourMainCon2';
import TourMainCon3 from './TourMainCon3';

const TourMain = () => {
    useEffect(() => {
        const html = document.documentElement;
        html.classList.add('snap-y');

        const headerEl = document.querySelector('.site-header');
        const getHeaderH = () => Math.max(0, headerEl?.offsetHeight || 100);
        const setHeaderVar = () => html.style.setProperty('--header-h', `${getHeaderH()}px`);

        // 섹션 목록
        const getSections = () => Array.from(document.querySelectorAll('#TourMain .tour-main-con'));

        // 스크롤 멈춤 감지 후, 가장 가까운 섹션으로 부드럽게 스냅
        let t = null;
        let locking = false;
        const onScroll = () => {
            if (locking) return;
            if (t) clearTimeout(t);
            t = setTimeout(() => {
                if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

                const h = getHeaderH();
                const y = window.scrollY;
                const secs = getSections();
                if (!secs.length) return;

                const nearest = secs
                    .map((el) => {
                        const top = Math.round(window.scrollY + el.getBoundingClientRect().top - h);
                        return { el, top, d: Math.abs(top - y) };
                    })
                    .reduce((a, b) => (a.d < b.d ? a : b));

                // 너무 가까우면(덜컥거림 방지) 보정 생략
                if (nearest.d < 24) return;

                locking = true;
                window.scrollTo({ top: nearest.top, behavior: 'smooth' });
                // 대략적인 스크롤 완료 시간 후 락 해제
                setTimeout(() => (locking = false), 600);
            }, 140);
        };

        setHeaderVar();
        window.addEventListener('resize', setHeaderVar);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            html.classList.remove('snap-y');
            html.style.removeProperty('--header-h');
            window.removeEventListener('resize', setHeaderVar);
            window.removeEventListener('scroll', onScroll);
            if (t) clearTimeout(t);
        };
    }, []);

    return (
        <main id="TourMain">
            <TourMainCon1
                titleInitPx={250}
                titleInitColor="#ffb703"
                subInitPx={110}
                subInitColor="#ffffff"
                hold={1.4}
                speed={0.5}
            />
            <TourMainCon2 />
            <TourMainCon3 />
        </main>
    );
};

export default TourMain;

// src/pages/tour/TourMain/index.jsx
import './style.scss';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TourMainCon1 from './TourMainCon1';
import TourMainCon2 from './TourMainCon2';
import TourMainCon3 from './TourMainCon3';

const TourMain = () => {
    const { state, hash } = useLocation();

    useEffect(() => {
        const targetId = state?.scrollTo || (hash ? hash.replace('#', '') : null);
        if (!targetId) return;

        const t = setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);

        return () => clearTimeout(t);
    }, [state, hash]);

    const initialCategory = state?.initialCategory || '드라마';

    return (
        <main id="TourMain">
            <TourMainCon1 />
            <TourMainCon2 initialCategory={initialCategory} />
            <TourMainCon3 />
        </main>
    );
};

export default TourMain;

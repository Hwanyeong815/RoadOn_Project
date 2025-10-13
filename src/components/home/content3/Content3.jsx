import hothotelData from '../../../api/hothotelData';
import './style.scss';
import React, { useRef, useEffect } from 'react';

const Content3 = () => {
    const carouselRef = useRef(null);
    const cursorRefs = useRef([]);

    const progress = useRef(50);
    const startX = useRef(0);
    const active = useRef(0);
    const isDown = useRef(false);

    const speedWheel = 0.02;
    const speedDrag = -0.1;

    const getZindex = (array, index) =>
        array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

    const displayItems = (item, index, activeIndex, items) => {
        const zIndex = getZindex([...items], activeIndex)[index];
        item.style.setProperty('--zIndex', zIndex);
        item.style.setProperty('--active', (index - activeIndex) / items.length);
    };

    const animate = () => {
        const items = carouselRef.current?.querySelectorAll('.carousel-item');
        if (!items) return;

        progress.current = Math.max(0, Math.min(progress.current, 100));
        active.current = Math.floor((progress.current / 100) * (items.length - 1));
        items.forEach((item, index) => displayItems(item, index, active.current, items));
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        const items = carousel?.querySelectorAll('.carousel-item');
        if (!items || !carousel) return;

        animate();

        items.forEach((item, i) => {
            item.addEventListener('click', () => {
                progress.current = (i / items.length) * 100 + 10;
                animate();
            });
        });

        const handleWheel = (e) => {
            e.preventDefault();
            progress.current += e.deltaY * speedWheel;
            animate();
        };

        const handleMouseMove = (e) => {
            if (e.type === 'mousemove') {
                cursorRefs.current.forEach(($cursor) => {
                    if ($cursor)
                        $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                });
            }
            if (!isDown.current) return;
            const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
            progress.current += (x - startX.current) * speedDrag;
            startX.current = x;
            animate();
        };

        const handleMouseDown = (e) => {
            isDown.current = true;
            startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        };

        const handleMouseUp = () => (isDown.current = false);

        carousel.addEventListener('wheel', handleWheel, { passive: false });
        carousel.addEventListener('mousedown', handleMouseDown);
        carousel.addEventListener('mousemove', handleMouseMove);
        carousel.addEventListener('mouseup', handleMouseUp);
        carousel.addEventListener('touchstart', handleMouseDown);
        carousel.addEventListener('touchmove', handleMouseMove);
        carousel.addEventListener('touchend', handleMouseUp);

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            carousel.removeEventListener('wheel', handleWheel);
            carousel.removeEventListener('mousedown', handleMouseDown);
            carousel.removeEventListener('mousemove', handleMouseMove);
            carousel.removeEventListener('mouseup', handleMouseUp);
            carousel.removeEventListener('touchstart', handleMouseDown);
            carousel.removeEventListener('touchmove', handleMouseMove);
            carousel.removeEventListener('touchend', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="content3 content3-web">
            <div className="hot_hotels">HOT 인기 숙소</div>

            <div className="carousel" ref={carouselRef}>
                {hothotelData.map((d, i) => (
                    <div key={i} className="carousel-item">
                        <div className="carousel-box">
                            <div className="title">
                                <strong>{d.star}</strong>
                                <h3>{d.name}</h3>
                                <p>{d.about}</p>
                            </div>
                            <img src={d.image} alt={d.name} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="contet3bg">
                <img src="/images/main/content3_bg.png" alt="content3_bg" />
                <video autoPlay muted loop playsInline>
                    <source src="/videos/main/hotStay.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="cursor" ref={(el) => (cursorRefs.current[0] = el)}></div>
            <div className="cursor cursor2" ref={(el) => (cursorRefs.current[1] = el)}></div>
        </div>
    );
};

export default Content3;

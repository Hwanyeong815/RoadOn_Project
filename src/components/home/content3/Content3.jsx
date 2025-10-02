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

    const data = [
        {
            id: 101,
            star: '5성급',
            name: '한국판 라스베이거스 \n 인스파이어 리조트',
            about: '엔터테인먼트 리조트의 새로운 기준',
            image: './images/main/stay1.png',
        },
        {
            id: 102,
            star: '특1급',
            name: '한 송이의 포도 \n 제주 핀크스 포도호텔',
            about: '예술철학이 녹아든 공간에서의 경험',
            image: './images/main/stay2.png',
        },
        {
            id: 103,
            star: '풀빌라',
            name: '편백나무 향이 가득한 \n 양평 다가섬 풀빌라&펜션',
            about: '일상의 균형과 치유의 공간',
            image: './images/main/stay3.png',
        },
        {
            id: 104,
            star: '펜션',
            name: '유니크 디자인 스테이 \n 강릉 kn하우스',
            about: '차분한 매력과 모던한 아름다움',
            image: './images/main/stay4.png',
        },
        {
            id: 105,
            star: '펜션',
            name: '내추럴 힐링타운 \n 가평 오버더마운틴',
            about: '편안하게 누리는 프라이빗 빌라',
            image: './images/main/stay5.png',
        },
        {
            id: 106,
            star: '펜션',
            name: '유니크 디자인 스테이 \n 강릉 kn하우스',
            about: '차분한 매력과 모던한 아름다움',
            image: './images/main/stay6.png',
        },
    ];

    return (
        <div className="content3 content3-web">
            <div className="hot_hotels">HOT 인기 숙소</div>
            <div className="contet3bg">
                <img src="/images/main/content3_bg.png" alt="content3_bg" />
                <video autoPlay muted loop playsInline>
                    <source src="/videos/main/hotStay.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="carousel" ref={carouselRef}>
                {data.map((d, i) => (
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

            <div className="cursor" ref={(el) => (cursorRefs.current[0] = el)}></div>
            <div className="cursor cursor2" ref={(el) => (cursorRefs.current[1] = el)}></div>
        </div>
    );
};

export default Content3;

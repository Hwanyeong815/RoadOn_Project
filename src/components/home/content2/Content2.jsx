import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './style.scss';
import CouponButton from '../../ui/coupon/CouponButton';
gsap.registerPlugin(ScrollTrigger);

const coupons = [
    { id: 1, image: '/images/main/coupon1.png', alt: '2% 적립쿠폰' },
    { id: 2, image: '/images/main/coupon2.png', alt: '5% 할인쿠폰' },
    { id: 3, image: '/images/main/coupon3.png', alt: '20% 할인쿠폰' },
    { id: 4, image: '/images/main/coupon4.png', alt: '12% 할인쿠폰' },
    { id: 5, image: '/images/main/coupon5.png', alt: '3만원 적립쿠폰' },
    { id: 6, image: '/images/main/coupon6.png', alt: '20% 할인쿠폰' },
];

const CouponEvent = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const marqueeRef = useRef(null);

    useEffect(() => {
        // 타이틀 애니메이션
        gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: -30, scale: 0.8 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                },
            }
        );

        // 마퀴 애니메이션
        const marquee = marqueeRef.current;
        const totalWidth = marquee.scrollWidth / 2;

        const marqueeTween = gsap.to(marquee, {
            x: -totalWidth,
            duration: 30,
            ease: 'sine.inOut',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x) => parseFloat(x) % -totalWidth),
            },
        });

        // 쿠폰 출렁 애니메이션 모아두기
        const couponTweens = [];

        gsap.utils.toArray('.coupon-item').forEach((item, i) => {
            const tween = gsap.to(item, {
                y: 200, // 더 크게 출렁
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.1,
            });
            couponTweens.push(tween);
        });

        // hover 이벤트는 wrapper에 걸어서 전체 멈춤
        const wrapper = document.querySelector('.marquee-wrapper');
        const handleEnter = () => {
            marqueeTween.pause();
            couponTweens.forEach((t) => t.pause());
        };
        const handleLeave = () => {
            marqueeTween.resume();
            couponTweens.forEach((t) => t.resume());
        };

        wrapper.addEventListener('mouseenter', handleEnter);
        wrapper.addEventListener('mouseleave', handleLeave);

        return () => {
            gsap.killTweensOf(marquee);
            wrapper.removeEventListener('mouseenter', handleEnter);
            wrapper.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    return (
        <div className="coupon-event-container" ref={containerRef}>
            <div className="inner">
                <div className="coupon-header" ref={titleRef}>
                    <h2 className="head">
                        SPECIAL <span>EVENT</span>
                    </h2>
                    <p className="subhead">뭘 좋아할지 몰라 다 준비했어요!</p>
                    <div className="coupon_down">
                        <CouponButton />
                    </div>
                </div>
                <div className="couponbg">
                    <img src="./images/main/couponbg.png" alt="couponbg" />
                </div>
            </div>
            <div className="marquee-wrapper">
                <div className="marquee" ref={marqueeRef}>
                    {[...coupons, ...coupons, ...coupons].map((coupon, idx) => (
                        <div className="coupon-item" key={idx}>
                            <img
                                src={coupon.image}
                                alt={coupon.alt}
                                className="coupon-image"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CouponEvent;

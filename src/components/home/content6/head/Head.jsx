import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import './style.scss';

gsap.registerPlugin(ScrollTrigger);

const Head = () => {
    const headerRef = useRef(null);
    const titleRef = useRef(null);
    const subheadRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const run = async () => {
                if (document?.fonts?.ready) {
                    try {
                        await document.fonts.ready;
                    } catch (_) {}
                }

                // 2) SplitType (안전 가드)
                let titleSplit, subSplit;
                try {
                    titleSplit = new SplitType(titleRef.current, { types: 'lines' });
                    subSplit = new SplitType(subheadRef.current, { types: 'lines' });
                } catch (e) {
                    console.warn('SplitType 실패 → 폴백으로 전체 엘리먼트만 애니메이션', e);
                }

                const titleLines = titleSplit?.lines?.length
                    ? titleSplit.lines
                    : [titleRef.current];
                const subLines = subSplit?.lines?.length ? subSplit.lines : [subheadRef.current];

                // 3) 초기 상태
                gsap.set(titleLines, {
                    yPercent: 100,
                    opacity: 0,
                    willChange: 'transform,opacity',
                });
                gsap.set(subLines, {
                    yPercent: 50,
                    opacity: 0,
                    willChange: 'transform,opacity',
                });
                gsap.set('.hr-line', {
                    scaleX: 0,
                    transformOrigin: 'left center',
                    willChange: 'transform',
                });

                // 4) 스크롤 트리거 (한 번만 재생)
                gsap.timeline({
                    defaults: { ease: 'power2.out' },
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 70%',
                        end: 'bottom 40%',
                        once: true,
                        // markers: true, // 디버그 필요하면 켜기
                    },
                })
                    .to(titleLines, {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.2,
                    })
                    .to(subLines, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.4')
                    .to('.hr-line', { scaleX: 1, duration: 0.8 }, '-=0.3');
            };

            run();
        }, headerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="inner" ref={headerRef}>
            <div className="con-header-wrap">
                <h3 className="con-header-title" ref={titleRef}>
                    <strong className="con-header-row">
                        <span className="head-txt orange">BEST</span>
                        <span className="head-txt">TRAVEL</span>
                    </strong>
                    <strong className="con-header-row">
                        <span className="head-txt" ref={subheadRef}>
                            DESTINATIONS
                        </span>
                    </strong>
                </h3>

                <p>스크롤을 내려 다음 여행을 찾아보세요.</p>
            </div>
        </section>
    );
};

export default Head;

import "./style.scss";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const Component = ({ tag, img, desc, img2 }) => {
  const imgRefs = useRef([]);
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    // 기존 ScrollTrigger 정리
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    imgRefs.current.forEach((el, i) => {
      if (!el) return;

      // 이미지 초기 위치 설정
      gsap.set(el, {
        opacity: 1,
        scale: 1,
      });

      // 원형 경로 애니메이션
      gsap.to(el, {
        duration: 1,
        ease: "none",
        motionPath: {
          path: "#circular-path",
          align: "#circular-path",
          alignOrigin: [0.5, 0.5],
          start: i / img2.length, // 각 이미지를 원형 경로상에 균등 배치
          end: 1 + i / img2.length + 0.05,
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1.5, // 부드러운 스크롤 동기화
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [img2]);

  return (
    <div className="circle-component" ref={containerRef}>
      <div className="left">
        <img className="background" src={img} alt={tag} />
      </div>

      <div className="right">
        {/* 원형 경로를 위한 SVG - 화면 중앙에 고정 */}
        <svg
          ref={svgRef}
          className="motion-path-svg"
          viewBox="0 0 500 500"
          style={{
            width: "700px",
            height: "700px",
          }}
        >
          <path
            id="circular-path"
            d="
      M 689.5,0
      A 689.5,689.5 0 1,1 689.5,1379
      A 689.5,689.5 0 1,1 689.5,0
    "
            stroke="#ddd"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <path
          id="circular-path"
          d="
      M 689.5,0
      A 689.5,689.5 0 1,1 689.5,1379
      A 689.5,689.5 0 1,1 689.5,0
    "
          stroke="#ddd"
          strokeWidth="2"
          fill="none"
        />

        {/* 원형으로 움직이는 이미지들 */}
        {img2.map((src, idx) => (
          <img
            key={idx}
            ref={(el) => (imgRefs.current[idx] = el)}
            src={src}
            alt={`floating-${idx}`}
            className="floating-img"
            style={{
              width: "600px",
              height: "auto",
              borderRadius: "50%",
              objectFit: "cover",

              opacity: 0,
              zIndex: 20,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Component;

import "./style.scss";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

const Component = ({ tag, img, desc, img2 }) => {
  const imgRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    imgRefs.current.forEach((el, i) => {
      if (!el) return;

      gsap.to(el, {
        duration: 5, // 애니메이션 기준 길이
        ease: "none",
        motionPath: {
          path: "#path",
          align: "#path",
          alignOrigin: [0.5, 0.5],
          start: i / imgRefs.current.length,
          end: 1 + i / imgRefs.current.length,
        },
        scrollTrigger: {
          trigger: containerRef.current, // 이 컴포넌트 기준
          start: "top center", // 화면 중앙쯤에서 시작
          end: "bottom center", // 끝날 위치
          scrub: true, // 스크롤과 동기화
        },
      });
    });
  }, [img2]);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="circle-component">
      <div className="left">
        <img className="background" src={img} alt={tag} />
      </div>
      <div className="right">
        <svg
          width="1352"
          height="1079"
          viewBox="0 0 1079 1079"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="profile-svg"
        >
          <path
            id="path"
            d="M 1016,0 A 593.5,593.5 0 1,1 1016,1079 A 593.5,593.5 0 1,1 1016,0 Z"
            stroke="#DDDDDD"
            fill="none"
          ></path>
        </svg>
        {img2.map((src, idx) => (
          <img
            key={idx}
            ref={(el) => (imgRefs.current[idx] = el)}
            src={src}
            alt={`circle-${idx}`}
            className="circle-img"
          />
        ))}
        {/* <img src={img2} alt="circle1" /> */}
      </div>
    </div>
  );
};

export default Component;

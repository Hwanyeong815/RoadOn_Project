import { useEffect, useRef } from "react";
import "./style.scss";
import { gsap } from "gsap";
import SearchBar from "./search/SearchBar";

const HomeVisual = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    const q = gsap.utils.selector(el);

    gsap.from(q("h1, p"), {
      opacity: 1,
      y: 50,
      duration: 1,
      stagger: 0.3, // 요소마다 순서대로
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="mainvisual">
      {/* 배경 */}
      <video autoPlay muted loop playsInline>
        <source src="/videos/main/hotStay.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>
      {/* 오버레이 */}
      <div className="overlay"></div>
      <div className="text" ref={textRef}>
        <h1>Cinematic Scene TOUR</h1>
        <p>
          클릭 한 번으로 즐기는 <span>영화 같은 여행</span>
        </p>
        <SearchBar />
      </div>
    </div>
  );
};

export default HomeVisual;

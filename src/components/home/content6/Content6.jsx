import React, { useEffect, useRef } from "react";
import "./style.scss";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const Content6 = () => {
  const headerRef = useRef(null);
  const subheadRef = useRef(null);
  const hrRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);

    const tl = gsap.timeline();

    // SplitText 한 번만
    const split = new SplitText(headerRef.current, {
      type: "lines",
      linesClass: "heading-line-wrapper",
    });

    
    tl.from(split.lines, {
      duration: 1,
      y: 200,
      autoAlpha: 0, 
      stagger: 0.25,
      delay: 0.5,
      ease: "power4.out",
    });

    tl.from(
      subheadRef.current,
      {
        duration: 0.5,
        opacity: 0,
        x: -20,
      },
      "-=0.5"
    );

    if (hrRef.current) {
      tl.from(
        hrRef.current,
        {
          duration: 2,
          scale: 0,
          ease: "expo.inOut",
        },
        "-=1.1"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div data-scroll-container>
      <div className="header" data-scroll-section>
        <h1 ref={headerRef}>
          BEST
          <span className="grayhead">
            TRAVEL <br />
            DESTINATIONS
          </span>
        </h1>
        <p ref={subheadRef} className="subhead">
          스크롤을 내려 다음 여행을 찾아보세요.
        </p>
        <hr ref={hrRef} />
      </div>
    </div>
  );
};

export default Content6;

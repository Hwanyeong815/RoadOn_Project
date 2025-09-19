import "./style.scss";
import React, { useRef, useEffect } from "react";

const Carousel = () => {
  const carouselRef = useRef(null);
  const cursorRefs = useRef([]);

  // 상태 변수 대신 useRef로 값 관리 (리렌더 최소화)
  const progress = useRef(50);
  const startX = useRef(0);
  const active = useRef(0);
  const isDown = useRef(false);

  const speedWheel = 0.02;
  const speedDrag = -0.1;

  // Z-index 계산
  const getZindex = (array, index) =>
    array.map((_, i) =>
      index === i ? array.length : array.length - Math.abs(index - i)
    );

  // 각 아이템 스타일 적용
  const displayItems = (item, index, activeIndex, items) => {
    const zIndex = getZindex([...items], activeIndex)[index];
    item.style.setProperty("--zIndex", zIndex);
    item.style.setProperty("--active", (index - activeIndex) / items.length);
  };

  // 애니메이션
  const animate = () => {
    const items = carouselRef.current?.querySelectorAll(".carousel-item");
    if (!items) return;

    progress.current = Math.max(0, Math.min(progress.current, 100));
    active.current = Math.floor((progress.current / 100) * (items.length - 1));

    items.forEach((item, index) =>
      displayItems(item, index, active.current, items)
    );
  };

  useEffect(() => {
    const items = carouselRef.current?.querySelectorAll(".carousel-item");
    if (!items) return;

    animate();

    // 아이템 클릭
    items.forEach((item, i) => {
      item.addEventListener("click", () => {
        progress.current = (i / items.length) * 100 + 10;
        animate();
      });
    });

    //휠 이벤트
    const handleWheel = (e) => {
      const wheelProgress = e.deltaY * speedWheel;
      progress.current = progress.current + wheelProgress;
      animate();
    };
    // const handleWheel = (e) => {
    //   e.preventDefault(); // body 스크롤 막기
    //   const wheelProgress = e.deltaY * speedWheel;
    //   progress.current += wheelProgress;
    //   animate();
    // };
    // 마우스/터치 move
    const handleMouseMove = (e) => {
      if (e.type === "mousemove") {
        cursorRefs.current.forEach(($cursor) => {
          if ($cursor) {
            $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
          }
        });
      }
      if (!isDown.current) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const mouseProgress = (x - startX.current) * speedDrag;
      progress.current = progress.current + mouseProgress;
      startX.current = x;
      animate();
    };

    const handleMouseDown = (e) => {
      isDown.current = true;
      startX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const handleMouseUp = () => {
      isDown.current = false;
    };

    // 이벤트 등록
    document.addEventListener("wheel", handleWheel);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);

    // cleanup
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, []);
  const data = [
    { id: 1, title: "Paris", num: "01", img: "./images/main/stay1.png" },
    { id: 2, title: "Warsaw", num: "02", img: "./images/main/stay2.png" },
    { id: 3, title: "Venice", num: "03", img: "./images/main/stay3.png" },
    { id: 4, title: "Munich", num: "04", img: "./images/main/stay4.png" },
    { id: 5, title: "Oslo", num: "05", img: "./images/main/stay5.png" },
    { id: 6, title: "Seoul", num: "06", img: "./images/main/stay6.png" },
    { id: 7, title: "Prague", num: "07", img: "./images/main/stay7.png" },
    { id: 8, title: "New York", num: "08", img: "./images/main/stay8.png" },
    { id: 9, title: "Tokyo", num: "09", img: "./images/main/stay9.png" },
    { id: 10, title: "London", num: "10", img: "./images/main/stay10.png" },
  ];
  return (
    <div className="content3">
      <div className="hot_hotels">HOT 인기 숙소</div>
      <div className="contet3bg">
        <img src="/images/main/content3_bg.png" alt="content3_bg" />{" "}
        {/* 배경 */}
        <video autoPlay muted loop playsInline>
          <source src="/videos/main/visual_bg.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
      </div>

      <div className="carousel" ref={carouselRef}>
        {data.map((d) => (
          <div key={d.id} className="carousel-item">
            <div className="carousel-box">
              <div className="title">{d.title}</div>
              <div className="num">{d.num}</div>
              <img src={d.img} alt={d.title} />
            </div>
          </div>
        ))}
      </div>

      <svg style={{ display: "none" }}>
        <symbol id="ico-instagram" viewBox="0 0 35 35">
          <circle
            opacity=".2"
            cx="17.5"
            cy="17.5"
            r="17"
            stroke="var(--fill)"
            fill="none"
          ></circle>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.944 20.476c.028-.457.042-1.282.042-2.476s-.014-2.019-.042-2.476c-.056-1.09-.378-1.93-.965-2.517s-1.422-.91-2.503-.965C21.018 12.014 20.194 12 19 12s-2.019.014-2.476.042c-1.081.047-1.92.368-2.517.965s-.918 1.436-.965 2.518C13.014 15.98 13 16.805 13 18c0 1.194.014 2.019.042 2.476.047 1.09.368 1.93.965 2.517s1.436.91 2.518.965c.466.028 1.29.042 2.475.042 1.184 0 2.01-.014 2.476-.042 1.072-.047 1.906-.368 2.503-.965.597-.597.918-1.436.965-2.517ZM19 13.075h-1.427c-.186 0-.438.01-.755.029a11.61 11.61 0 0 0-.797.07c-.215.028-.401.08-.56.154-.26.102-.489.251-.685.447-.196.196-.35.425-.461.685-.056.15-.103.336-.14.56a7.843 7.843 0 0 0-.084.811 7.113 7.113 0 0 0-.014.741c.01.178.01.453 0 .826-.01.373-.01.573 0 .601.01.028.01.228 0 .601s-.01.648 0 .826c.01.177.014.424.014.74 0 .318.028.588.084.812l.14.56c.112.26.265.489.461.685.196.196.425.345.685.447.15.056.336.108.56.154.224.047.49.07.797.07.308 0 .56.01.755.028.196.019.471.019.826 0 .354-.019.554-.019.601 0 .047.019.242.019.587 0s.62-.019.826 0c.205.019.456.01.755-.028.298-.037.569-.06.811-.07.242-.01.424-.06.546-.154.26-.102.494-.251.699-.447a1.75 1.75 0 0 0 .447-.686c.056-.149.103-.335.14-.559.038-.224.066-.494.084-.811.019-.317.023-.564.014-.741a11.82 11.82 0 0 1 0-.826c.01-.373.01-.573 0-.601-.01-.028-.01-.228 0-.601s.01-.648 0-.826c-.01-.177-.014-.424-.014-.74 0-.318-.028-.588-.084-.812l-.14-.56a1.956 1.956 0 0 0-1.147-1.133 3.979 3.979 0 0 0-.545-.153 3.915 3.915 0 0 0-.811-.07c-.326 0-.578-.01-.755-.028a5.916 5.916 0 0 0-.826 0c-.372.019-.568.019-.587 0Zm3.706 2.225c.14-.14.21-.308.21-.504a.57.57 0 0 0-.21-.503.767.767 0 0 0-.517-.21.718.718 0 0 0-.504.21.622.622 0 0 0-.21.503c.01.196.08.364.21.504s.299.21.504.21c.205 0 .377-.07.517-.21ZM22.063 18c0 .849-.298 1.576-.895 2.182a2.882 2.882 0 0 1-2.168.895 3.075 3.075 0 0 1-2.182-.895c-.606-.588-.904-1.315-.895-2.182.01-.867.308-1.594.895-2.182.588-.587 1.315-.886 2.182-.895.867-.01 1.59.29 2.168.895.578.606.876 1.333.895 2.182Zm-1.077 0a1.95 1.95 0 0 0-.573-1.413A1.897 1.897 0 0 0 19 16c-.56 0-1.03.196-1.413.587A2.001 2.001 0 0 0 17 18c-.01.55.186 1.021.587 1.413.401.391.872.587 1.413.587.54 0 1.012-.196 1.413-.587.4-.392.592-.863.573-1.413Z"
            transform="translate(-1.5 -0.5)"
            fill="var(--fill)"
          ></path>
        </symbol>

        <symbol id="ico-linkedin" viewBox="0 0 35 35">
          <circle
            opacity=".2"
            cx="17.5"
            cy="17.5"
            r="17"
            stroke="var(--fill)"
            fill="none"
          ></circle>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.3025 14.0835C15.3025 14.3845 15.1934 14.6403 14.9752 14.851C14.757 15.0617 14.4786 15.167 14.14 15.167C13.8014 15.167 13.5267 15.0617 13.316 14.851C13.1053 14.6403 13 14.3807 13 14.0722C13 13.7637 13.1053 13.5079 13.316 13.3047C13.5267 13.1016 13.8051 13 14.1512 13C14.4974 13 14.772 13.1016 14.9752 13.3047C15.1783 13.5079 15.2874 13.7675 15.3025 14.0835ZM13.0677 23V16.0248H15.2348V23H13.0677ZM16.4763 16.0248C16.5064 16.8676 16.5214 17.6125 16.5214 18.2596V23H18.7111V18.9819C18.7111 18.7111 18.7336 18.5305 18.7788 18.4402C18.9895 17.8984 19.3582 17.6275 19.8849 17.6275C20.6223 17.6275 20.991 18.1317 20.991 19.14V23H23.158V18.8691C23.158 17.8758 22.9285 17.1272 22.4695 16.623C22.0105 16.1189 21.4048 15.8668 20.6524 15.8668C19.6742 15.8668 18.9594 16.243 18.5079 16.9955H18.4628L18.3499 16.0248H16.4763Z"
            transform="translate(0 -1)"
            fill="var(--fill)"
          ></path>
        </symbol>
      </svg>

      {/* Cursor */}
      <div className="cursor"></div>
      <div className="cursor cursor2"></div>
    </div>
  );
};

export default Carousel;

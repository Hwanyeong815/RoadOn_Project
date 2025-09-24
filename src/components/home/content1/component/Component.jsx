import { Navigate } from "react-router-dom";
import "./style.scss";
import React from "react";

const Component = ({ tag, img, desc, img2 }) => {
  return (
    <div className="circle-component">
      <div className="left">
        <img className="background" src={img} alt={tag} />
        <button className="re-button"><Navigate to=""/> 예약하기</button>
      </div>

      <div className="right">
        {img2.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`image-${idx}`}
            className="display-img"
          />
        ))}
      </div>
    </div>
  );
};

export default Component;

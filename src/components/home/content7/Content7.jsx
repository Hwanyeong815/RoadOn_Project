import React from "react";
import "./style.scss";

const Content7 = () => {
  return (
    <div className="bottom-text-container">
      {/* 첫 번째 텍스트 줄 - 오른쪽으로 흐름 */}
      <div className="text-row text-row-1">
        <div className="text-content">
          <img src="./images/main/flow1.png" alt="도시 목록 1" />
          <img src="./images/main/flow1.png" alt="도시 목록 1" />
          <img src="./images/main/flow1.png" alt="도시 목록 1" />
        </div>
      </div>

      {/* 두 번째 텍스트 줄 - 왼쪽으로 흐름 */}
      <div className="text-row text-row-2">
        <div className="text-content">
          <img src="./images/main/flow2.png" alt="도시 목록 2" />
          <img src="./images/main/flow2.png" alt="도시 목록 2" />
          <img src="./images/main/flow2.png" alt="도시 목록 2" />
        </div>
      </div>
    </div>
  );
};

export default Content7;

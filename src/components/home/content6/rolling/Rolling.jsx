import "./style.scss";
import { images } from "./rollingImg.js";

const Rolling = () => {
  // 무한 스크롤을 위해 이미지 배열을 3번 복제
  const tripleImages = [...images, ...images, ...images];

  // 이미지를 3개 그룹으로 나누기
  const groupSize = Math.ceil(images.length / 3);
  const group1 = images.slice(0, groupSize);
  const group2 = images.slice(groupSize, groupSize * 2);
  const group3 = images.slice(groupSize * 2);

  // 각 그룹을 3번 복제
  const tripleGroup1 = [...group1, ...group1, ...group1];
  const tripleGroup2 = [...group2, ...group2, ...group2];
  const tripleGroup3 = [...group3, ...group3, ...group3];

  return (
    <div className="rolling-section">
      <div className="rolling-columns">
        {/* 첫 번째 열 - 위로 롤링 */}
        <div className="rolling-column">
          <div className="rolling-track rolling-up">
            {tripleGroup1.map((image, index) => (
              <div key={`col1-${index}`} className="rolling-item">
                <img
                  src={image.src}
                  alt={`City ${image.id}`}
                  className="rolling-image"
                />
                <div className="rolling-overlay"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 두 번째 열 - 아래로 롤링 */}
        <div className="rolling-column">
          <div className="rolling-track rolling-down">
            {tripleGroup2.map((image, index) => (
              <div key={`col2-${index}`} className="rolling-item">
                <img
                  src={image.src}
                  alt={`City ${image.id}`}
                  className="rolling-image"
                />
                <div className="rolling-overlay"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 세 번째 열 - 위로 롤링 */}
        <div className="rolling-column">
          <div className="rolling-track rolling-up">
            {tripleGroup3.map((image, index) => (
              <div key={`col3-${index}`} className="rolling-item">
                <img
                  src={image.src}
                  alt={`City ${image.id}`}
                  className="rolling-image"
                />
                <div className="rolling-overlay"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rolling;

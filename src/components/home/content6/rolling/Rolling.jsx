import './style.scss';

const Rolling = () => {
    // ✅ 절대 경로로 변경 (public/images/main/)
    const images = [
        { id: 1, src: '/images/main/city1.png' },
        { id: 2, src: '/images/main/city2.png' },
        { id: 3, src: '/images/main/city3.png' },
        { id: 4, src: '/images/main/city4.png' },
        { id: 5, src: '/images/main/city5.png' },
        { id: 6, src: '/images/main/city6.png' },
        { id: 7, src: '/images/main/city7.png' },
        { id: 8, src: '/images/main/city8.png' },
        { id: 9, src: '/images/main/city9.png' },
        { id: 10, src: '/images/main/city10.png' },
        { id: 11, src: '/images/main/city11.png' },
        { id: 12, src: '/images/main/city12.png' },
        { id: 13, src: '/images/main/city13.png' },
        { id: 14, src: '/images/main/city14.png' },
        { id: 15, src: '/images/main/city15.png' },
        { id: 16, src: '/images/main/city16.png' },
        { id: 17, src: '/images/main/city17.png' },
        { id: 18, src: '/images/main/city18.png' },
        { id: 19, src: '/images/main/city19.png' },
        { id: 20, src: '/images/main/city20.png' },
        { id: 21, src: '/images/main/city21.png' },
    ];

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
        <section className="rolling-section-wrap">
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
        </section>
    );
};

export default Rolling;

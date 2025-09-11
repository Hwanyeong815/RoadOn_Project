const arr = [
    {
        id: 1,
        img: '/images/tour/main/con3_1.png',
        title: '《 갯마을 차차차》 \n 포항 구룡포·청진항 촬영지 여행',
        des: '드라마 감성 100%, 홍반장과 혜진이의 바다 마을을 걷다',
        info: '2박 3일 · 전용 가이드 동행',
        price: '350,000원 (1인 기준)',
    },
    {
        id: 2,
        img: '/images/tour/main/con3_1.png',
        title: '《 갯마을 차차차》  \n 포항 구룡포·청진항 촬영지 여행',
        des: '드라마 감성 100%, 홍반장과 혜진이의 바다 마을을 걷다',
        info: '2박 3일 · 전용 가이드 동행',
        price: '350,000원 (1인 기준)',
    },
    {
        id: 3,
        img: '/images/tour/main/con3_1.png',
        title: '《 갯마을 차차차》  \n 포항 구룡포·청진항 촬영지 여행',
        des: '드라마 감성 100%, 홍반장과 혜진이의 바다 마을을 걷다',
        info: '2박 3일 · 전용 가이드 동행',
        price: '350,000원 (1인 기준)',
    },
    {
        id: 4,
        img: '/images/tour/main/con3_1.png',
        title: '《 갯마을 차차차》  \n 포항 구룡포·청진항 촬영지 여행',
        des: '드라마 감성 100%, 홍반장과 혜진이의 바다 마을을 걷다',
        info: '2박 3일 · 전용 가이드 동행',
        price: '350,000원 (1인 기준)',
    },
];

const TourMainCon3 = () => {
    return (
        <section className="tour-main-con tour-main-con3">
            <div className="inner">
                <div className="head">
                    <h2>인기 여행지의 패키지 둘러보기</h2>
                </div>
                <ul className="package-wrap">
                    {arr.map((pack) => (
                        <li key={pack.id}>
                            <div className="img-wrap">
                                <img src={pack.img} alt={pack.title} />
                            </div>
                            <div className="txt-wrap">
                                <h2 className="title">{pack.title}</h2>
                                <strong className="des">{pack.des}</strong>
                                <p className="info">{pack.info}</p>
                                <em className="price">{pack.price}</em>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default TourMainCon3;

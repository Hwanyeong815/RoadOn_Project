import './style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Content3Mobile = () => {
    const data = [
        {
            id: 101,
            star: '5성급',
            name: '한국판 라스베이거스 \n 인스파이어 리조트',
            about: '엔터테인먼트 리조트의 새로운 기준',
            image: './images/main/stay1.png',
        },
        {
            id: 102,
            star: '특1급',
            name: '한 송이의 포도 \n 제주 핀크스 포도호텔',
            about: '예술철학이 녹아든 공간에서의 경험',
            image: './images/main/stay2.png',
        },
        {
            id: 103,
            star: '풀빌라',
            name: '편백나무 향이 가득한 \n 양평 다가섬 풀빌라&펜션',
            about: '일상의 균형과 치유의 공간',
            image: './images/main/stay3.png',
        },
        {
            id: 104,
            star: '펜션',
            name: '유니크 디자인 스테이 \n 강릉 kn하우스',
            about: '차분한 매력과 모던한 아름다움',
            image: './images/main/stay4.png',
        },
        {
            id: 105,
            star: '펜션',
            name: '내추럴 힐링타운 \n 가평 오버더마운틴',
            about: '편안하게 누리는 프라이빗 빌라',
            image: './images/main/stay5.png',
        },
        {
            id: 106,
            star: '펜션',
            name: '유니크 디자인 스테이 \n 강릉 kn하우스',
            about: '차분한 매력과 모던한 아름다움',
            image: './images/main/stay6.png',
        },
    ];

    return (
        <div className="content3 content3-mobile">
            <div className="hot_hotels">HOT 인기 숙소</div>

            <Swiper
                modules={[Pagination]}
                spaceBetween={16} // 카드 사이 간격
                slidesPerView={2} // 한 화면에 2개씩
                pagination={{ clickable: true }}
            >
                {data.map((d) => (
                    <SwiperSlide key={d.id}>
                        <div className="carousel-box">
                            <div className="title">
                                <strong>{d.star}</strong>
                                <h3>{d.name}</h3>
                                <p>{d.about}</p>
                            </div>
                            <img src={d.image} alt={d.name} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Content3Mobile;

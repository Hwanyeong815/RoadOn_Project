import './style.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules'; // ✅ Autoplay 추가
import hothotelData from '../../../api/hothotelData';

const Content3Mobile = () => {
    return (
        <div className="content3 content3-mobile">
            <div className="hot_hotels">
                <span>HOT 인기 숙소</span>
            </div>
            <div className="inner">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={2}
                    autoplay={{
                        delay: 3000, // 3초마다 자동 넘김
                        disableOnInteraction: false, // 유저가 터치해도 자동재생 유지
                    }}
                    pagination={false} // ✅ 페이지네이션 아예 끄기
                    loop={true} // 무한 루프
                >
                    {hothotelData.map((d) => (
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
            <div className="contet3bg">
                <img src="/images/main/content3_bg_mobile.png" alt="content3_bg" />
                <video autoPlay muted loop playsInline>
                    <source src="/videos/main/hotStay.mp4" type="video/mp4" />
                </video>
            </div>
        </div>
    );
};

export default Content3Mobile;

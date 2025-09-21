import { useState } from 'react';
import './style.scss';
import GalleryModal from '../../../hotels/hotelsDetail/GalleryModal';

const DetailThum = ({ tourData }) => {
    if (!tourData) return null;

    const { posterImg, images = [] } = tourData;

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const handleImageClick = () => {
        setIsGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setIsGalleryOpen(false);
    };

    return (
        <section className="detail-thum">
            {/* <div className="big-img img-box">
                <img src={posterImg || '/images/default-tour.jpg'} alt={tourData.title} />
            </div>
            <div className="imgs-all-wrap img-box">
                {images.length > 0 ? (
                    images.slice(0, 4).map((img, index) => (
                        <div key={index} className="img-wrap">
                            <img src={img} alt={`${tourData.title} ${index + 1}`} />
                        </div>
                    ))
                ) : (
                    <div className="img-wrap">
                        <img src={posterImg || '/images/default-tour.jpg'} alt={tourData.title} />
                    </div>
                )}
            </div> */}
            <section className="hotel-thum">
                <div
                    className="img-box big-img-1"
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}
                >
                    {/* <img src={`/images/hotels/detail/hotelsList/${tourData.image[0]}`} alt="숙소이미지1" /> */}
                    {/* <img src={`/images/tour/detail/${tourData.detailImg[0]}`} alt="투어이미지1" /> */}
                </div>
                <div
                    className="img-box big-img-2"
                    onClick={handleImageClick}
                    style={{ cursor: 'pointer' }}
                >
                    <img src={`/images/tour/detail/${tourData.detailImg[1]}`} alt="투어이미지2" />
                    <img src="/images/icon/gallery.svg" alt="갤러리" />
                </div>
            </section>
            {isGalleryOpen && (
                <GalleryModal
                    images={tourData.detailImg}
                    hotelName={tourData.title}
                    onClose={handleCloseGallery}
                />
            )}
        </section>
    );
};
export default DetailThum;

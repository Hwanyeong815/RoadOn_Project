import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const GalleryModalTour = ({ images, onClose, hotelName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 배경 클릭 시 모달 닫기
    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains('gallery')) {
            onClose();
        }
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const selectImage = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="gallery" onClick={handleBackgroundClick}>
            <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
                <div className="hotel-name">
                    <p>
                        {hotelName}
                        <IoCloseOutline onClick={onClose} style={{ cursor: 'pointer' }} />
                    </p>
                </div>
                <div className="info-imgs">
                    <div className="big-img">
                        <img
                            src={`/images/hotels/detail/hotelsList/${images[currentIndex]}`}
                            alt={`갤러리 이미지 ${currentIndex + 1}`}
                        />

                        {/* 네비게이션 버튼 (이미지가 2개 이상일 때만) */}
                        {images.length > 1 && (
                            <>
                                <button className="nav-btn prev-btn" onClick={prevImage}>
                                    <IoChevronBack />
                                </button>
                                <button className="nav-btn next-btn" onClick={nextImage}>
                                    <IoChevronForward />
                                </button>
                            </>
                        )}

                        {/* 이미지 카운터 */}
                        <div className="image-counter">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                    <div className="small-img">
                        <ul className="img-list">
                            {images.map((image, index) => (
                                <li
                                    key={index}
                                    className={index === currentIndex ? 'active' : ''}
                                    onClick={() => selectImage(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={`/images/hotels/detail/hotelsList/${image}`}
                                        alt={`썸네일 ${index + 1}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;

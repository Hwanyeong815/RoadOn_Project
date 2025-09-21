// src/components/.../DetailThum.jsx
import { useState, useMemo } from 'react';
import './style.scss';
import GalleryModal from '../../../hotels/hotelsDetail/GalleryModal';

const DetailThum = ({ tourData }) => {
    if (!tourData) return null;

    const { posterImg, images = [], title = '' } = tourData;

    // detailImg 우선 → 없으면 images → 둘 다 없으면 빈 배열
    const detailImgs = useMemo(() => {
        const arr = Array.isArray(tourData.detailImg) ? tourData.detailImg : images;
        return Array.isArray(arr) ? arr.filter(Boolean) : [];
    }, [tourData, images]);

    // 썸네일 폴백 계산
    const firstImg = detailImgs[0] ?? posterImg ?? '/images/default-tour.jpg';
    const secondImg = detailImgs[1]; // 있을 수도, 없을 수도

    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const hasAnyImage = Boolean(firstImg);

    const handleImageClick = () => {
        if (!hasAnyImage) return;
        setIsGalleryOpen(true);
    };
    const handleCloseGallery = () => setIsGalleryOpen(false);

    // 모달에 넘길 이미지: 최소 1장 보장
    const modalImages = detailImgs.length ? detailImgs : [firstImg];

    return (
        <section className="detail-thum">
            <section className="hotel-thum">
                {/* 큰 썸네일 1: 항상 렌더(폴백 사용) */}
                <div
                    className="img-box big-img-1"
                    onClick={handleImageClick}
                    style={{ cursor: hasAnyImage ? 'pointer' : 'default' }}
                    role={hasAnyImage ? 'button' : undefined}
                    aria-label={hasAnyImage ? `${title} 갤러리 열기` : undefined}
                >
                    <img src={firstImg} alt={title || '투어 이미지'} />
                </div>

                {/* 큰 썸네일 2: secondImg가 있을 때만 렌더 */}
                {secondImg && (
                    <div
                        className="img-box big-img-2"
                        onClick={handleImageClick}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        aria-label={`${title} 갤러리 더보기`}
                    >
                        <img src={secondImg} alt={`${title} 추가 이미지`} />
                        <img src="/images/icon/gallery.svg" alt="갤러리" />
                    </div>
                )}
            </section>

            {isGalleryOpen && (
                <GalleryModal images={modalImages} hotelName={title} onClose={handleCloseGallery} />
            )}
        </section>
    );
};

export default DetailThum;

// src/components/tour/TourBox.jsx
import './style.scss';
import { useNavigate } from 'react-router-dom';
import WishButton from '../ui/wishbutton/WishButton';
import useWishStore from '../../store/wishStore';

const svgPosterFallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240'>
      <rect width='100%' height='100%' fill='#f3f4f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        fill='#9ca3af' font-size='16'>NO IMAGE</text>
    </svg>`
    );

const toPublic = (maybeName, base) => {
    if (!maybeName) return null;
    if (/^(https?:\/\/|\/\/|\/|data:)/i.test(maybeName)) return maybeName;
    return `${base.replace(/\/$/, '')}/${maybeName}`.replace(/\/{2,}/g, '/');
};

// 투어 이미지 규칙: tour/main → tour/detail → (그 외) → SVG 폴백
const pickTourPoster = (tour) => {
    const main =
        toPublic(tour?.posterImg, '/images/tour/main') ||
        toPublic(tour?.mainImg, '/images/tour/main') ||
        toPublic(tour?.main_image, '/images/tour/main') ||
        toPublic(tour?.main, '/images/tour/main');

    const detail =
        toPublic(tour?.backgroundImg, '/images/tour/detail') ||
        toPublic(tour?.detailImg, '/images/tour/detail') ||
        toPublic(tour?.detail_image, '/images/tour/detail') ||
        toPublic(tour?.detail, '/images/tour/detail');

    const others = tour?.image || tour?.thumbnail || null; // 절대경로/루트면 그대로 쓰임

    return main || detail || others || svgPosterFallback;
};

const DEFAULT_PACKAGES = Object.freeze([]);

const TourBox = ({ packageId, inWishList = false }) => {
    const navigate = useNavigate();

    const packages = useWishStore((s) => s.packages) ?? DEFAULT_PACKAGES;
    const tour = packages.find(
        (p) => p && (String(p.id) === String(packageId) || p.slug === packageId)
    );

    if (!tour)
        return inWishList ? null : (
            <div className="tour-box-empty">투어 정보를 찾을 수 없습니다.</div>
        );

    const price = tour.adult_fee ?? tour.adultFee ?? tour.price ?? 0;
    const slug = tour.slug ?? tour.id;
    const poster = pickTourPoster(tour);

    return (
        <div
            className="hotel-box tour-box"
            onClick={() => slug && navigate(`/tours/${slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && slug) navigate(`/tours/${slug}`);
            }}
            style={{ position: 'relative' }}
        >
            <div className="hotel-image" style={{ position: 'relative' }}>
                <img
                    src={poster}
                    alt={tour.title ?? tour.name ?? '투어'}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = svgPosterFallback;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="wish-overlay" onClick={(e) => e.stopPropagation()}>
                    <WishButton type="tour" id={tour.id ?? slug} data={tour} />
                </div>
            </div>

            <div className="hotel-info">
                <div className="info-top">
                    <div className="top-title">
                        <span>{tour.contents ?? '투어'}</span>
                        <h4>{tour.title ?? tour.name ?? '제목 없음'}</h4>
                    </div>
                    <div className="rate">
                        <span>{tour.duration ?? tour.date ?? ''}</span>
                    </div>
                </div>

                <div className="info-bottom">
                    <div className="bottom-location">
                        <img src="/images/hotels/search/map_pin.svg" alt="" />
                        <span>{tour.city ?? tour.country ?? tour.location ?? ''}</span>
                    </div>
                    <div className="bottom-price">
                        <span>성인 1인</span>
                        <strong>{Number(price).toLocaleString()}원</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourBox;

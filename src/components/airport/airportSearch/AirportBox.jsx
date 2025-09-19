// src/components/airport/airportSearch/AirportBox.jsx
import './style.scss';
import { useNavigate } from 'react-router-dom';
import WishButton from '../../ui/wishbutton/WishButton';
import useWishStore from '../../../store/wishStore';

const DEFAULT_FILTERS = Object.freeze({ mode: 'oneway', dates: [], segments: [] });

// 항상 표시 가능한 SVG 폴백 (이미지 없을 때)
const svgLogoFallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>
      <rect width='100%' height='100%' fill='#f0f2f5'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        fill='#9aa3af' font-size='12'>NO LOGO</text>
    </svg>`
    );

// 파일명만 들어오면 디렉토리를 붙여 만듭니다. 절대경로/루트 경로면 그대로 사용.
const toPublic = (maybeName, base) => {
    if (!maybeName) return null;
    if (/^(https?:\/\/|\/\/|\/|data:)/i.test(maybeName)) return maybeName;
    return `${base.replace(/\/$/, '')}/${maybeName}`.replace(/\/{2,}/g, '/');
};

const safeToDate = (val) => {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val)) return val;
    const d = new Date(val);
    return isNaN(d) ? null : d;
};
const fmt = (val) => {
    const d = safeToDate(val);
    return d
        ? d.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              weekday: 'short',
          })
        : '';
};

const AirportBox = ({ airportId, inWishList = false }) => {
    const navigate = useNavigate();

    // ✅ selector는 원본만, 기본값은 상수
    const airports = useWishStore((s) => s.airports) ?? [];
    const storeFilters = useWishStore((s) => s.filters);
    const filters = storeFilters ?? DEFAULT_FILTERS;

    const airport = airports.find((a) => String(a?.id) === String(airportId));
    if (!airport)
        return inWishList ? null : (
            <div className="airport-box-empty">항공권 정보를 찾을 수 없습니다.</div>
        );

    // segments 안전 구성
    const mode = filters.mode || 'oneway';
    let segments = [];
    if (mode === 'roundtrip') {
        segments = [
            {
                departureDate: fmt(filters.dates?.[0]),
                arrivalDate: fmt(filters.dates?.[0]),
                departureAirport: airport.departureAirport,
                arrivalAirport: airport.arrivalAirport,
            },
            {
                departureDate: fmt(filters.dates?.[1]),
                arrivalDate: fmt(filters.dates?.[1]),
                departureAirport: airport.arrivalAirport,
                arrivalAirport: airport.departureAirport,
            },
        ];
    } else if (mode === 'oneway') {
        segments = [
            {
                departureDate: fmt(filters.dates?.[0]),
                arrivalDate: fmt(filters.dates?.[0]),
                departureAirport: airport.departureAirport,
                arrivalAirport: airport.arrivalAirport,
            },
        ];
    } else if (mode === 'multicity') {
        const segs = Array.isArray(filters.segments) ? filters.segments : [];
        segments = segs.map((seg) => ({
            departureDate: fmt(seg?.date),
            arrivalDate: fmt(seg?.date),
            departureAirport: seg?.from ?? '',
            arrivalAirport: seg?.to ?? '',
        }));
    }
    if (!segments.length) {
        segments = [
            {
                departureDate: '',
                arrivalDate: '',
                departureAirport: airport.departureAirport,
                arrivalAirport: airport.arrivalAirport,
            },
        ];
    }

    const handleClick = () => {
        navigate(`/payment`, { state: { productType: 'flight', airport, segments } });
    };

    // ❌ 존재하지 않는 기본경로는 더 이상 사용하지 않음
    // logo가 '파일명'이면 airline 폴더를 주로 사용한다고 가정 (필요시 base 바꿔주세요)
    const logoSrc =
        toPublic(airport.logo, '/images/airline') ||
        toPublic(airport.logo, '/images/airport') ||
        svgLogoFallback;

    // timeline도 없을 수 있으니 SVG로 폴백
    const timelineFallback =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='16'>
         <line x1='0' y1='8' x2='120' y2='8' stroke='#d1d5db' stroke-width='2'/>
       </svg>`
        );
    const timelineSrc = toPublic('timeline.png', '/images/airport') || timelineFallback;

    return (
        <section
            className={`airport-box ${mode}`}
            onClick={handleClick}
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            <div className="wish-overlay" onClick={(e) => e.stopPropagation()}>
                <WishButton type="flight" id={airportId} data={airport} />
            </div>

            {segments.map((seg, i) => (
                <div className="flight-row" key={i}>
                    <div className="airline">
                        <div className="flight-logo">
                            <img
                                src={logoSrc}
                                alt={airport.airline || 'airline'}
                                loading="lazy"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = svgLogoFallback;
                                }}
                            />
                        </div>
                        <div className="info">
                            <p className="name">{airport.airline}</p>
                            <p className="code">{airport.flightNo}</p>
                        </div>
                    </div>

                    <div className="departure">
                        <p className="date">{seg.departureDate}</p>
                        <p className="time">{airport.departureTime}</p>
                        <p className="airport">{seg.departureAirport}</p>
                    </div>

                    <div className="airport-info">
                        <p className="duration">{airport.duration}</p>
                        <img
                            src={timelineSrc}
                            className="timeline-img"
                            alt="timeline"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = timelineFallback;
                            }}
                        />
                        <p className="direct">{airport.direct ? '직항' : '경유'}</p>
                    </div>

                    <div className="arrival">
                        <p className="date">{seg.arrivalDate}</p>
                        <p className="time">{airport.arrivalTime}</p>
                        <p className="airport">{seg.arrivalAirport}</p>
                    </div>

                    {i === segments.length - 1 && (
                        <div className="price">
                            <p>{Number(airport.price ?? 0).toLocaleString()}원</p>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export default AirportBox;

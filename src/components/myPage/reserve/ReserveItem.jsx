// src/components/myPage/reserveItem.jsx
import React from 'react';
import './style.scss';

// API 데이터 경로: 필요 시 경로 조정하세요.
// 현재 경로 기준: src/components/myPage/* -> ../../api/*
import airportListData from '../../../api/airportListData';
import hotelsListData from '../../../api/hotelsListData';
import packagesData from '../../../api/packagesData';

// format helpers
const formatDateShort = (input) => {
    if (!input) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
    if (m) {
        const yy = String(m[1]).slice(2);
        return `${yy}-${m[2]}-${m[3]}`;
    }
    const d = new Date(input);
    if (isNaN(d.getTime())) return String(input);
    const yy = String(d.getFullYear()).slice(2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
};

const formatPrice = (v) => (v == null ? '-' : `${Number(v).toLocaleString()}원`);

// 시간차 계산: 'HH:mm' 문자열 2개 -> "N시간 M분"
const computeDurationFromTimes = (dep, arr) => {
    if (!dep || !arr) return '';
    const toMinutes = (t) => {
        const mm = /^(\d{1,2}):(\d{2})/.exec(t);
        if (!mm) return null;
        return parseInt(mm[1], 10) * 60 + parseInt(mm[2], 10);
    };
    const a = toMinutes(dep);
    const b = toMinutes(arr);
    if (a == null || b == null) return '';
    let diff = b - a;
    if (diff < 0) diff += 24 * 60; // 다음날 도착 처리
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h > 0 ? `${h}시간` : ''}${m > 0 ? ` ${m}분` : ''}`.trim();
};

// API에서 상품 찾기 (productData가 이미 있으면 우선 사용)
const findProductFromApis = (type, productData, fallbackId) => {
    if (productData && typeof productData === 'object') return productData;

    const tid = fallbackId ?? (productData && (productData.id ?? productData.slug));
    if (!tid) return null;

    const typeKey = (type || '').toString().toLowerCase();

    if (typeKey === 'flight') {
        return (
            airportListData.find((f) => String(f.id) === String(tid)) ||
            airportListData.find(
                (f) => (f.flightNo || '').toString().toLowerCase() === String(tid).toLowerCase()
            ) ||
            airportListData.find(
                (f) => (f.slug || '').toString().toLowerCase() === String(tid).toLowerCase()
            ) ||
            null
        );
    }

    if (typeKey === 'hotel') {
        return (
            hotelsListData.find((h) => String(h.id) === String(tid)) ||
            hotelsListData.find(
                (h) => (h.slug || '').toString().toLowerCase() === String(tid).toLowerCase()
            ) ||
            hotelsListData.find(
                (h) => (h.name || '').toString().toLowerCase() === String(tid).toLowerCase()
            ) ||
            null
        );
    }

    if (typeKey === 'package' || typeKey === 'tour') {
        return (
            packagesData.find((p) => String(p.slug) === String(tid)) ||
            packagesData.find((p) => String(p.id) === String(tid)) ||
            packagesData.find(
                (p) => (p.title || '').toString().toLowerCase() === String(tid).toLowerCase()
            ) ||
            null
        );
    }

    return null;
};

// 보조 정보 렌더링 (호텔/항공/패키지)
const renderProductSubInfo = (type, productData, fallbackId) => {
    const resolved = findProductFromApis(type, productData, fallbackId) || productData || null;
    if (!resolved) return null;

    const typeKey = (type || '').toString().toLowerCase();

    if (typeKey === 'hotel') {
        const location = resolved.location || resolved.address || resolved.city || '';
        const roomInfo =
            resolved.rooms ?? resolved.roomType ?? (resolved.nights ? `${resolved.nights}박` : '');
        return (
            <div className="product-subinfo">
                {location && <span className="sub-location">{location}</span>}
                {roomInfo && <span className="sub-room">{roomInfo}</span>}
            </div>
        );
    }

    if (typeKey === 'flight') {
        const flightInfo = resolved;
        const depAirport =
            flightInfo.departureAirport || flightInfo.departCode || flightInfo.airport_start || '';
        const arrAirport =
            flightInfo.arrivalAirport || flightInfo.arriveCode || flightInfo.airport_end || '';
        const depTime =
            flightInfo.departureTime || flightInfo.departure_time || flightInfo.time_start || '';
        const arrTime =
            flightInfo.arrivalTime || flightInfo.arrival_time || flightInfo.time_end || '';
        const duration = flightInfo.duration || computeDurationFromTimes(depTime, arrTime);

        return (
            <div className="product-subinfo">
                {depAirport && arrAirport && (
                    <span className="sub-route">{`${depAirport} → ${arrAirport}`}</span>
                )}
                {(depTime || arrTime) && (
                    <span className="sub-time">{`${depTime || '-'} → ${arrTime || '-'}`}</span>
                )}
                {duration && <span className="sub-duration">{duration}</span>}
            </div>
        );
    }

    // package / tour
    const duration =
        resolved.duration || resolved.days || resolved.itinerary?.length
            ? `${resolved.itinerary?.length || ''}일`
            : '';
    const subtitle = resolved.subtitle || resolved.desc || resolved.summary || '';
    return (
        <div className="product-subinfo">
            {duration && <span className="sub-duration">{duration}</span>}
            {subtitle && <span className="sub-sub">{subtitle}</span>}
        </div>
    );
};

const TYPE_LABELS = {
    hotel: '숙소',
    flight: '항공',
    package: '패키지',
    tour: '투어',
};

const ReserveItem = ({ data = null }) => {
    if (!data) {
        return (
            <tr>
                <td data-label="예약일">25-09-03</td>
                <td data-label="예약코드">
                    <strong>샘플코드</strong>
                </td>
                <td data-label="상품명">
                    <div className="product-name ellipsis-2">
                        <strong className="product-title">샘플 상품명</strong>
                        <span className="product-type-badge">숙소</span>
                    </div>
                    <div className="product-subinfo">
                        <span className="sub-location">서울특별시</span>
                        <span className="sub-duration">2박 3일</span>
                    </div>
                </td>
                <td data-label="결제 금액">
                    <b>999,900원</b>
                </td>
                <td data-label="인원">성인 2명, 아동 1명</td>
                <td data-label="여행기간">25-09-07 ~ 25-09-10</td>
                <td data-label="상태">
                    <span className="status status--ready">출발 전</span>
                </td>
            </tr>
        );
    }

    const {
        reservationId,
        createdAt,
        totalAmount,
        guests = {},
        startDate,
        endDate,
        status,
        data: productData,
        type,
        isUsed,
        id: fallbackId,
    } = data;

    const typeKey = (type || '').toString().toLowerCase();
    const typeLabel = TYPE_LABELS[typeKey] || typeKey;

    // resolved product (from API) - used for name if available
    const resolved = findProductFromApis(typeKey, productData, fallbackId) || productData || null;

    // product name selection by type (한국어 우선)
    let productName = '';
    if (resolved) {
        if (typeKey === 'hotel')
            productName = resolved.name || resolved.title || resolved.hotelName || '';
        else if (typeKey === 'flight') {
            const airline = resolved.airline || resolved.name || '';
            const flightNo = resolved.flightNo ? ` ${resolved.flightNo}` : '';
            productName = `${airline}${flightNo}`.trim();
            if (!productName && (resolved.departureAirport || resolved.arrivalAirport)) {
                productName = `${resolved.departureAirport || ''} → ${
                    resolved.arrivalAirport || ''
                }`;
            }
        } else if (typeKey === 'package' || typeKey === 'tour') {
            productName = resolved.title || resolved.name || resolved.subtitle || '';
        }
    }

    if (!productName) {
        productName = productData?.name || data?.id || reservationId || '상품 정보 없음';
    }

    // guest label
    const adult = guests.adult ?? 0;
    const child = guests.child ?? 0;
    const guestLabel = `성인 ${adult}명${typeof child === 'number' ? `, 아동 ${child}명` : ''}`;

    // status text/class
    const statusClass = isUsed
        ? 'status--used'
        : status === 'ready'
        ? 'status--ready'
        : status === 'completed'
        ? 'status--done'
        : status === 'cancelled'
        ? 'status--cancelled'
        : 'status--unknown';
    const statusText = isUsed
        ? '사용 완료'
        : status === 'ready'
        ? '출발 전'
        : status === 'completed'
        ? '완료'
        : status === 'cancelled'
        ? '취소'
        : '상태 없음';

    return (
        <tr>
            <td data-label="예약일">{formatDateShort(createdAt)}</td>
            <td data-label="예약코드">
                <strong>{reservationId ?? data.uid ?? '-'}</strong>
            </td>
            <td data-label="상품명">
                <div className="product-name ellipsis-2">
                    <strong className="product-title">{productName}</strong>
                    <span className="product-type-badge">{typeLabel}</span>
                </div>
                {renderProductSubInfo(typeKey, productData, fallbackId)}
            </td>
            <td data-label="결제 금액">
                <b>{formatPrice(totalAmount)}</b>
            </td>
            <td data-label="인원">{guestLabel}</td>
            <td data-label="여행기간">
                {formatDateShort(startDate)}
                {startDate && endDate ? ` ~ ${formatDateShort(endDate)}` : ''}
            </td>
            <td data-label="상태">
                <span className={`status ${statusClass}`}>{statusText}</span>
            </td>
        </tr>
    );
};

export default ReserveItem;

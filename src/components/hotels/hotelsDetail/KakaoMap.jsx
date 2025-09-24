// KakaoMap.jsx - 간단한 유동적 주소 버전
import { useState, useEffect, useRef } from 'react';

const KakaoMap = ({ address, name }) => {
    const mapContainer = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!mapContainer.current) return;

        // 카카오맵이 로드될 때까지 기다리기
        const checkKakao = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                clearInterval(checkKakao);
                createMap();
            }
        }, 100);

        // 5초 후 타임아웃
        setTimeout(() => {
            clearInterval(checkKakao);
        }, 5000);

        return () => clearInterval(checkKakao);
    }, [address, name]);

    const createMap = () => {
        console.log('Creating map with address:', address);

        const container = mapContainer.current;

        // 기본 위치 (강남역)
        const defaultPosition = new window.kakao.maps.LatLng(37.4981125, 127.0379399);

        const options = {
            center: defaultPosition,
            level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        if (address && window.kakao.maps.services) {
            // 주소 검색 시도
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    // 주소 검색 성공
                    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: coords,
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content:
                            '<div style="width:150px;text-align:center;padding:6px 0;">' +
                            (name || '숙소') +
                            '</div>',
                    });

                    infowindow.open(map, marker);
                    map.setCenter(coords);

                    console.log('Address found:', address);
                } else {
                    // 주소 검색 실패 - 기본 위치에 마커
                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: defaultPosition,
                    });

                    const infowindow = new window.kakao.maps.InfoWindow({
                        content:
                            '<div style="width:150px;text-align:center;padding:6px 0;">' +
                            (name || '숙소') +
                            '<br><small>위치 정보 없음</small></div>',
                    });

                    infowindow.open(map, marker);

                    console.log('Address not found:', address);
                }
            });
        } else {
            // Geocoder 없으면 기본 위치만
            const marker = new window.kakao.maps.Marker({
                map: map,
                position: defaultPosition,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
                content:
                    '<div style="width:150px;text-align:center;padding:6px 0;">' +
                    (name || '숙소') +
                    '</div>',
            });

            infowindow.open(map, marker);
        }

        setIsLoaded(true);
    };

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '350px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: isLoaded ? 'transparent' : '#f5f5f5',
            }}
        >
            {!isLoaded && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#666',
                    }}
                >
                    지도 로딩 중...
                </div>
            )}
        </div>
    );
};

export default KakaoMap;

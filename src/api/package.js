//삭제예정

const packages = [
    // 1. 드라마 - 갯마을 차차차
    {
        contents: '드라마',
        title: '갯마을 차차차 촬영지 성지순례 패키지',
        subtitle: '포항 2박 3일 성지순례 여행',
        desc: '드라마 속 공진마을을 따라가며 포항의 대표 촬영지와 명소를 즐기는 특별한 패키지',
        date: '상시출발',
        duration: '2박 3일',
        flight: 'KTX 왕복',
        shopping: '자유쇼핑 가능',
        guide_fee: '포함',
        optional: false,
        adult_fee: 390000,
        child_fee: 350000,
        itinerary: [
            {
                day: 1,
                country: '대한민국',
                city: '포항',
                tours: [
                    { place: '서울역 → KTX 포항역', desc: '고속열차로 편리한 이동' },
                    { place: '청진항', desc: '드라마 공진 마을 중심 배경' },
                    {
                        place: '홍반장과 윤혜진 첫 만남 장소',
                        desc: '항구 풍경 & 바닷가 포토스팟',
                    },
                    { place: '구룡포 바닷가', desc: '드라마 다수 촬영, 바닷가 산책' },
                    {
                        place: '포항 죽도시장',
                        desc: '저녁 – 회, 물회, 과메기 등 지역 특산물',
                    },
                ],
                hotel: {
                    name: '오션뷰 호텔',
                    room_type: '2인 1실',
                    desc: '바다 전망 숙소',
                },
            },
            {
                day: 2,
                country: '대한민국',
                city: '포항',
                tours: [
                    { place: '구룡포 일본인가옥거리', desc: '드라마 촬영지 & 포토존' },
                    { place: '구룡포항 빨간등대', desc: '홍반장 주요 촬영지' },
                    { place: '구룡포 해산물 요리', desc: '점심 – 로컬 해산물' },
                    {
                        place: '호미곶 해맞이 광장',
                        desc: '상생의 손 조형물, 인증샷 필수',
                    },
                    { place: '포항운하 크루즈', desc: '도심 속 바다 감상' },
                    { place: '포항 시내 레스토랑', desc: '저녁 – 해산물 파인다이닝' },
                ],
                hotel: {
                    name: '온천 & 스파 호텔',
                    room_type: '2인 1실',
                    desc: '휴식 및 스파 체험',
                },
            },
            {
                day: 3,
                country: '대한민국',
                city: '포항',
                tours: [
                    { place: '영일대 해수욕장 & 스카이워크', desc: '바다 위 유리전망대' },
                    { place: '포항 바다 전망 카페', desc: '루프탑 카페 투어' },
                    { place: '점심', desc: '지역 맛집' },
                    { place: '포항역 → 서울역', desc: 'KTX 복귀' },
                ],
                hotel: { name: '', room_type: '', desc: '숙박 없음' },
            },
        ],
        flight_info: {
            departure: {
                airline: 'KTX',
                time_start: '09:00',
                time_end: '12:00',
                airport_start: '서울역',
                airport_end: '포항역',
                duration: '3시간',
            },
            arrival: {
                time_start: '15:00',
                time_end: '18:00',
                airport_start: '포항역',
                airport_end: '서울역',
                duration: '3시간',
            },
        },
    },

    // 2. 예능 - 윤식당
    {
        contents: '예능',
        title: '윤식당 스페인 투어',
        subtitle: '스페인 가라치코 3박 4일',
        desc: "tvN 예능 '윤식당' 촬영지 가라치코에서 맛과 풍경을 즐기는 여행",
        date: '출발일 지정',
        duration: '3박 4일',
        flight: '대한항공 직항',
        shopping: '현지 자유시간 포함',
        guide_fee: '포함',
        optional: true,
        adult_fee: 1390000,
        child_fee: 1200000,
        itinerary: [
            {
                day: 1,
                country: '스페인',
                city: '테네리페',
                tours: [
                    { place: '테네리페 도착', desc: '공항 이동 및 호텔 체크인' },
                    { place: '가라치코 마을 산책', desc: '윤식당 촬영지 첫 만남' },
                ],
                hotel: {
                    name: '가라치코 시내 호텔',
                    room_type: '2인 1실',
                    desc: '스페인 전통 감성 호텔',
                },
            },
        ],
        flight_info: {
            departure: {
                airline: '대한항공',
                flight_number: 'KE123',
                time_start: '10:00',
                time_end: '18:00',
                airport_start: '인천공항',
                airport_end: '마드리드공항',
                duration: '14시간',
            },
            arrival: {
                time_start: '11:00',
                time_end: '06:00',
                airport_start: '마드리드공항',
                airport_end: '인천공항',
                duration: '13시간',
            },
        },
    },

    // 3. 드라마 - 폭싹 속았수다
    {
        contents: '드라마',
        title: '폭싹 속았수다 촬영지 성지순례 패키지',
        subtitle: '제주 2박 3일 감성 여행',
        desc: '드라마 주요 촬영지를 100% 방문하며 제주 자연과 로컬 먹거리를 함께 즐기는 성지순례 패키지',
        date: '상시출발',
        duration: '2박 3일',
        flight: '김포-제주 왕복',
        shopping: '자유쇼핑 가능',
        guide_fee: '포함',
        optional: false,
        adult_fee: 420000,
        child_fee: 380000,
        itinerary: [
            {
                day: 1,
                country: '대한민국',
                city: '제주',
                tours: [
                    { place: '김포공항 → 제주공항', desc: '제주 도착' },
                    { place: '이호테우 해변', desc: '말등대 인증샷' },
                    { place: '용두암 & 탑동 광장', desc: '드라마 산책로' },
                    { place: '제주시 흑돼지 거리', desc: '저녁 – 흑돼지 BBQ' },
                ],
                hotel: {
                    name: '제주시내 호텔',
                    room_type: '2인 1실',
                    desc: '첫째 날 숙박',
                },
            },
            {
                day: 2,
                country: '대한민국',
                city: '제주',
                tours: [
                    { place: '성산일출봉', desc: '드라마 명장면 배경' },
                    { place: '섭지코지 & 드라마 하우스', desc: '실제 세트 촬영지' },
                    { place: '표선해수욕장', desc: '바닷마을 장면' },
                    { place: '카멜리아 힐', desc: '감성 꽃길' },
                    { place: '서귀포 매일 올레시장', desc: '저녁 – 로컬 먹거리' },
                ],
                hotel: {
                    name: '서귀포 오션뷰 호텔',
                    room_type: '2인 1실',
                    desc: '바다 전망 숙소',
                },
            },
            {
                day: 3,
                country: '대한민국',
                city: '제주',
                tours: [
                    { place: '한담 해안 산책로', desc: '드라마 명장면' },
                    { place: '오설록 티뮤지엄', desc: '녹차밭 감성' },
                    { place: '점심', desc: '갈치조림/성게미역국' },
                    { place: '제주공항 귀환', desc: '서울 복귀' },
                ],
                hotel: { name: '', room_type: '', desc: '숙박 없음' },
            },
        ],
        flight_info: {
            departure: {
                airline: '대한항공',
                time_start: '09:00',
                time_end: '10:10',
                airport_start: '김포공항',
                airport_end: '제주공항',
                duration: '1시간 10분',
            },
            arrival: {
                time_start: '15:00',
                time_end: '16:10',
                airport_start: '제주공항',
                airport_end: '김포공항',
                duration: '1시간 10분',
            },
        },
    },

    // 4. 영화 - 케데헌
    {
        contents: '영화',
        title: '케데헌 성지순례 패키지',
        subtitle: 'K-POP × 판타지 2박 3일',
        desc: 'K-POP 성지와 영화 판타지 세계관을 동시에 경험하는 여행',
        date: '일정 고정 (1~6명)',
        duration: '2박 3일',
        flight: '서울 투어',
        shopping: '자유 쇼핑 가능',
        guide_fee: '포함',
        optional: false,
        adult_fee: 520000,
        child_fee: 480000,
        itinerary: [
            {
                day: 1,
                country: '대한민국',
                city: '서울',
                tours: [
                    { place: '하이브 인사이트', desc: 'BTS·세븐틴 전시관' },
                    { place: 'SM타운 플래그십 스토어', desc: '굿즈 & 세계관 체험' },
                    { place: '한강 유람선', desc: '네온 조명·음악 퍼포먼스' },
                ],
                hotel: {
                    name: '서울 시내 호텔',
                    room_type: '2인 1실',
                    desc: 'K-POP 팬 감성 숙소',
                },
            },
            {
                day: 2,
                country: '대한민국',
                city: '서울',
                tours: [
                    { place: '경복궁 & 북촌 한옥마을', desc: '전통과 판타지 조화' },
                    { place: '점심: 전통 한식', desc: '한정식·퓨전 한식' },
                    { place: 'K-팝 댄스 클래스', desc: '아이돌 안무 배우기' },
                    { place: '홍대 라이브 클럽', desc: '판타지적 무대 체험' },
                ],
                hotel: {
                    name: '서울 호텔',
                    room_type: '2인 1실',
                    desc: '홍대·강남 접근성',
                },
            },
            {
                day: 3,
                country: '대한민국',
                city: '서울',
                tours: [
                    { place: '동대문 DDP', desc: '미래적 건축물' },
                    { place: '명동 K-푸드 투어', desc: '치킨·떡볶이·호떡' },
                    { place: '뮤직비디오 거리', desc: '촬영지 산책 후 귀환' },
                ],
                hotel: { name: '', room_type: '', desc: '숙박 없음' },
            },
        ],
        flight_info: {
            departure: {
                airline: '개별 이동',
                airport_start: '집결지',
                airport_end: '서울',
            },
            arrival: { airport_start: '서울', airport_end: '귀가' },
        },
    },

    // 5. K-POP - BTS
    {
        contents: 'K-POP',
        title: 'BTS 부산 콘서트 성지순례 & 도시투어',
        subtitle: 'Yet to Come in Cinemas – 부산 2박 3일',
        desc: "BTS 'Yet to Come in Busan' 콘서트 현장과 부산 명소 투어",
        date: '일정 고정 (1~6명)',
        duration: '2박 3일',
        flight: 'KTX/항공',
        shopping: '자유 쇼핑 가능',
        guide_fee: '포함',
        optional: false,
        adult_fee: 650000,
        child_fee: 600000,
        itinerary: [
            {
                day: 1,
                country: '대한민국',
                city: '부산',
                tours: [
                    { place: '아시아드 주경기장', desc: '콘서트 성지 포토존' },
                    { place: '광안리 해변', desc: '부산 대표 바다' },
                    { place: '저녁: 부산 밀면·해산물', desc: '로컬 음식 체험' },
                ],
                hotel: {
                    name: '해운대 호텔',
                    room_type: '2인 1실',
                    desc: '콘서트 분위기 숙소',
                },
            },
            {
                day: 2,
                country: '대한민국',
                city: '부산',
                tours: [
                    { place: '해운대 & 동백섬', desc: 'BTS 화보 촬영지 감성' },
                    { place: 'BTS 카페 & 굿즈샵', desc: '아미 스토어' },
                    { place: '점심: 돼지국밥 거리', desc: '부산 로컬 맛집' },
                    { place: '태종대', desc: '바다 절경 & 포토스팟' },
                    { place: '저녁: 자갈치 시장', desc: '해산물 식사' },
                ],
                hotel: {
                    name: '해운대 호텔',
                    room_type: '2인 1실',
                    desc: '바다 전망 숙소',
                },
            },
            {
                day: 3,
                country: '대한민국',
                city: '부산',
                tours: [
                    { place: '부산 시티투어 버스', desc: 'BTS 노래 플레이' },
                    { place: '국제시장 & BIFF 거리', desc: '시장·영화 거리 산책' },
                    { place: '점심 후 귀환', desc: '서울 복귀' },
                ],
                hotel: { name: '', room_type: '', desc: '숙박 없음' },
            },
        ],
        flight_info: {
            departure: {
                airline: 'KTX/항공',
                airport_start: '서울',
                airport_end: '부산',
                duration: '약 3시간',
            },
            arrival: {
                airport_start: '부산',
                airport_end: '서울',
                duration: '약 3시간',
            },
        },
    },

    // 6. K-POP - BLACKPINK
    {
        contents: 'K-POP',
        title: 'BLACKPINK 다큐 성지 & K-POP 체험',
        subtitle: 'Light Up the Sky – 서울 2박 3일',
        desc: 'BLACKPINK 다큐 속 감성과 서울 K-POP 성지를 따라가는 투어',
        date: '일정 고정 (1~6명)',
        duration: '2박 3일',
        flight: '서울 집결',
        shopping: '굿즈샵 포함',
        guide_fee: '포함',
        optional: false,
        adult_fee: 580000,
        child_fee: 540000,
        itinerary: [
            {
                day: 1,
                country: '대한민국',
                city: '서울',
                tours: [
                    { place: 'YG 엔터 본사 외관', desc: '블링크 필수 코스' },
                    { place: '하이브 인사이트', desc: 'K-POP 전시관 체험' },
                    { place: '저녁: 홍대 K-팝 레스토랑', desc: '테마 레스토랑' },
                ],
                hotel: {
                    name: '홍대 인근 호텔',
                    room_type: '2인 1실',
                    desc: '블랙핑크 감성 숙소',
                },
            },
            {
                day: 2,
                country: '대한민국',
                city: '서울',
                tours: [
                    { place: '한강공원', desc: '연습생 시절 감성 재현' },
                    { place: '홍대 댄스 클래스', desc: '블핑 안무 배우기' },
                    { place: 'DDP', desc: '패션·뮤직비디오 촬영지' },
                    { place: '이태원 루프탑 바', desc: '글로벌 팬 감성' },
                ],
                hotel: {
                    name: '강남권 호텔',
                    room_type: '2인 1실',
                    desc: '쇼핑 최적화 숙소',
                },
            },
            {
                day: 3,
                country: '대한민국',
                city: '서울',
                tours: [
                    { place: '명동 K-팝 굿즈샵', desc: '앨범·포토카드 쇼핑' },
                    { place: '남산타워 전망 레스토랑', desc: '점심 – 서울 전경 감상' },
                    { place: '귀환', desc: '서울역/공항' },
                ],
                hotel: { name: '', room_type: '', desc: '숙박 없음' },
            },
        ],
        flight_info: {
            departure: {
                airline: '개별 이동',
                airport_start: '집결지',
                airport_end: '서울',
            },
            arrival: { airport_start: '서울', airport_end: '귀가' },
        },
    },

    // 7. 예능 - 서진이네
    {
        contents: '예능',
        title: '서진이네 성지순례 패키지',
        subtitle: '멕시코 바칼라르 3박 4일',
        desc: "tvN '서진이네' 촬영지 멕시코 바칼라르에서 한식당 성지와 라군을 즐기는 여행",
        date: '출발일 지정',
        duration: '3박 4일',
        flight: '대한항공 + 멕시코 국내선',
        shopping: '현지 마켓 투어 포함',
        guide_fee: '포함',
        optional: true,
        adult_fee: 1990000,
        child_fee: 1790000,
        itinerary: [
            {
                day: 1,
                country: '멕시코',
                city: '바칼라르',
                tours: [
                    {
                        place: '칸쿤 공항 도착 → 바칼라르 이동',
                        desc: '전용 차량 약 4시간',
                    },
                    { place: '서진이네 한식당 외관', desc: '촬영 성지 방문' },
                    { place: '저녁: 현지 레스토랑', desc: '타코 & 마가리타' },
                ],
                hotel: {
                    name: '바칼라르 호수뷰 호텔',
                    room_type: '2인 1실',
                    desc: '호수 전망 숙소',
                },
            },
            {
                day: 2,
                country: '멕시코',
                city: '바칼라르',
                tours: [
                    { place: '바칼라르 라군', desc: '보트 투어 & 수영' },
                    { place: '산 펠리페 요새', desc: '역사와 전경 감상' },
                    { place: '촬영 포인트 거리', desc: '출연진 단골 카페 탐방' },
                ],
                hotel: { name: '부티크 호텔', room_type: '2인 1실', desc: '감성 숙소' },
            },
            {
                day: 3,
                country: '멕시코',
                city: '바칼라르',
                tours: [
                    { place: '세노테 아술', desc: '천연 수영장 체험' },
                    { place: '점심: 로컬 식당', desc: '현지 가정식' },
                    { place: '석양 감상', desc: '촬영지 재방문' },
                ],
                hotel: {
                    name: '호수뷰 호텔',
                    room_type: '2인 1실',
                    desc: '여유로운 밤',
                },
            },
            {
                day: 4,
                country: '멕시코',
                city: '바칼라르 → 칸쿤',
                tours: [
                    { place: '조식 후 체크아웃', desc: '칸쿤 이동' },
                    { place: '칸쿤 국제공항 출발', desc: '귀국' },
                ],
                hotel: { name: '', room_type: '', desc: '숙박 없음' },
            },
        ],
        flight_info: {
            departure: {
                airline: '대한항공 + 국내선',
                airport_start: '인천공항',
                airport_end: '칸쿤국제공항',
                duration: '약 16시간+이동',
            },
            arrival: {
                airport_start: '칸쿤국제공항',
                airport_end: '인천공항',
                duration: '약 18시간',
            },
        },
    },
];

export default packages;

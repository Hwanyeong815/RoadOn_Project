import React, { useMemo, useState, useEffect } from 'react';
import useAirportStore from '../../../store/airportStore';
import AirportBox from './AirportBox';
import Pagination from '../../ui/pagination/Pagination';
import { openSwal } from '../../ui/swal/presets'; // ✅ swal 불러오기

const AirportBoxList = () => {
    const airports = useAirportStore((state) => state.airportDetails);
    const getFilteredAirportDetails = useAirportStore((state) => state.getFilteredAirportDetails);
    const filters = useAirportStore((state) => state.filters);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    // ✅ filters가 변경될 때마다 페이지 초기화
    useEffect(() => {
        setPage(1);
    }, [filters]);

    const filteredAirports = useMemo(() => {
        return getFilteredAirportDetails();
    }, [filters, airports]);

    const startIndex = (page - 1) * pageSize;
    const currentAirports = filteredAirports.slice(startIndex, startIndex + pageSize);

    // ✅ AirportBox 클릭 시 swal 실행
    const handleAirportClick = async (airport) => {
        const res = await openSwal('loginRequired2');
        if (res.isConfirmed) {
            // 여기서 navigate 로직도 추가할 수 있음
            console.log(`로그인 확인 → ${airport.id}번 항공권 처리`);
        } else {
            console.log('사용자가 취소함');
        }
    };

    return (
        <div className="airport-detail-list">
            <div className="list-header">
                <h3>총 {filteredAirports.length}개 항공권</h3>
            </div>

            <div className="list-box">
                {currentAirports.length > 0 ? (
                    currentAirports.map((airport) => (
                        <div
                            key={airport.id}
                            onClick={() => handleAirportClick(airport)}
                            style={{ cursor: 'pointer' }}
                        >
                            <AirportBox airportId={airport.id} />
                        </div>
                    ))
                ) : (
                    <p className="no-result">조건에 맞는 항공권이 없습니다.</p>
                )}
            </div>

            <Pagination
                page={page}
                total={filteredAirports.length}
                pageSize={pageSize}
                onPageChange={setPage}
            />
        </div>
    );
};

export default AirportBoxList;

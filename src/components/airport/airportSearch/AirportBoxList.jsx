import React, { useMemo, useState, useEffect } from 'react';
import useAirportStore from '../../../store/airportStore';
import AirportBox from './AirportBox';
import Pagination from '../../ui/pagination/Pagination';

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

    return (
        <div className="airport-detail-list">
            <div className="list-header">
                <h3>총 {filteredAirports.length}개 항공권</h3>
            </div>

            <div className="list-box">
                {currentAirports.length > 0 ? (
                    currentAirports.map((airport) => (
                        <AirportBox key={airport.id} airportId={airport.id} />
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

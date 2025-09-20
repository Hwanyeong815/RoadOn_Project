import { useState } from "react";
import AirportSearchBar from "../../../components/ui/AirportSearchBar/AirportSearchBar";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";

const AirportCon1 = () => {
  return (
    <section className="airport-main-con airport-main-con1">
      <div className="visual-bg"></div>
      <div className="inner">
        <h2 className="search-title">날짜를 선택해 예약하세요</h2>
        <AirportSearchBar />
      </div>
    </section>
  );
};

export default AirportCon1;

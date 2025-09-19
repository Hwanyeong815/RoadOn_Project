import React from "react";
import "./style.scss";
import { FaSearch, FaUser, FaCalendarAlt } from "react-icons/fa";

const SearchBar = () => {
  return (
    // 아이콘들은 수정할게요 일단 사용해놨습니당
    <div className="search-bar">
      <div className="search-item search-location">
        <FaSearch className="icon" />
        <input type="text" placeholder="여행지나 숙소를 검색해보세요" />
      </div>

      <div className="search-item">
        <FaCalendarAlt className="icon" />
        <span>09.02 화 - 09.03 수 (1박)</span>
      </div>

      <div className="search-item">
        <FaUser className="icon" />
        <span>인원 2</span>
      </div>

      <button className="search-btn">검색</button>
    </div>
  );
};

export default SearchBar;

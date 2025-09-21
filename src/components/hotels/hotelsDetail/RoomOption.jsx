// RoomOption.jsx (수정할 필요 없음)
import '../style.scss'
import { BsPeople } from "react-icons/bs";
import { IoBedOutline } from "react-icons/io5";

const RoomOption = ({ roomData, onSelect, isSelected }) => {
    const handleClick = () => {
        onSelect(roomData);
    };

    return (
        <div 
            className={`room-option-box ${isSelected ? 'selected' : ''}`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="room-option-img">
                <img src={`/images/hotels/detail/roomOptions/${roomData.image[0]}`} alt="" />
            </div>
            <div className="room-option-info">
                <div className="info-left">
                    <h3>{roomData.name}</h3>
                    <ul className="room-details">
                        <li>
                            <BsPeople />
                            <span>기준 {roomData.party}인/최대 {roomData.party}인</span>
                        </li>
                        <li>
                            <IoBedOutline />
                            <span>{roomData.beds}</span>
                        </li>
                    </ul>
                    <ul className="room-include">
                        <li><img src="/images/hotels/detail/icon/check-mint.svg" alt="체크" />{roomData.include[0]}</li>
                        <li><img src="/images/hotels/detail/icon/check-mint.svg" alt="체크" />{roomData.include[1]}</li>
                    </ul>
                </div>
                <div className="info-right">
                    <div className="room-price">
                        <span>세금 및 수수료 포함</span>
                        <strong>{roomData.price.toLocaleString()}원 <span> / 박</span></strong>
                    </div>
                    <button>객실 선택</button>
                </div>
            </div>
        </div>
    );
};

export default RoomOption;
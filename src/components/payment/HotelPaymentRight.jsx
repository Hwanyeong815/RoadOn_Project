import './style.scss';

const HotelPaymentRight = ({ hotel, selectedRoom, totalPrice, nights }) => {
    return (
        <div className="pay payment-right">
            <div className="res-title">
                <div className="ht-img">
                    <img src={`/images/hotels/detail/hotelsList/${hotel.image[0]}`} alt="" />
                </div>
                <div className="text">
                    <span>
                        {hotel.type} {hotel.star}
                    </span>
                    <span>{hotel.name}</span>
                    <span>{selectedRoom.name}</span>
                </div>
            </div>
            <div className="res-prices">
                <ul className="price total">
                    <li>
                        <b>요금 합계</b>
                        <b>{totalPrice.toLocaleString()}원</b>
                    </li>
                    <li>
                        <span>객실 1개 X {nights}박</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                    </li>
                </ul>
                <ul className="price discount">
                    <li>
                        <b>할인 혜택</b>
                        <b>-11,800원</b>
                    </li>
                    <li>
                        <span>상품 및 쿠폰 할인</span>
                        <span>-11,800원</span>
                    </li>
                    <li>
                        <span>포인트 사용</span>
                        <span>-0원</span>
                    </li>
                </ul>
                <p>
                    <strong>총액</strong>
                    <strong>450,760원</strong>
                </p>
            </div>
            <p className="assent">
                <span></span>개인정보 처리 및 이용약관에 동의합니다.
            </p>
            <button className='pay-btn'>450,760원 결제하기</button>
        </div>
    );
};

export default HotelPaymentRight;
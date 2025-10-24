// src/components/tour/tourDetail/DetailSide.jsx
import './style.scss';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReserveBtn from '../../../ui/reserveBtn';

const DetailSide = ({ tourData }) => {
    const [childCount, setChildCount] = useState(0);
    const [adultCount, setAdultCount] = useState(0);
    const navigate = useNavigate();

    if (!tourData) return null;

    const { subtitle, adult_fee = 0, child_fee = 0, posterImg, title } = tourData;
    const baseAmount = adultCount * adult_fee + childCount * child_fee; // 총액 -> baseAmount로 이름 변경

    const handleCountChange = (type, operation) => {
        if (type === 'child') {
            setChildCount((prev) => (operation === 'plus' ? prev + 1 : Math.max(0, prev - 1)));
        } else {
            setAdultCount((prev) => (operation === 'plus' ? prev + 1 : Math.max(0, prev - 1)));
        }
    };

    const handleReservation = () => {
        const reservationData = {
            productType: 'tour',
            tour: tourData,
            // ✅ TourPaymentLeft/Right에서 사용하는 party 구조에 맞춤
            party: { 
                adults: adultCount, 
                children: childCount, 
                infants: 0 
            },
            baseAmount: baseAmount, // ✅ 할인 전 금액을 baseAmount로 전달
            // totalPrice는 PaymentLayout에서 prop으로 전달되지 않으므로, 여기서는 baseAmount로 전달
        };

        navigate('/payment', {
            state: reservationData,
        });

        console.log('전달할 데이터:', reservationData);
    };

    return (
        <section className="detail-side">
            <div className="box-head">
                <div className="box-thum">
                    <img src={posterImg || '/images/default-tour.jpg'} alt={subtitle} />
                </div>
                <strong>{subtitle}</strong>
            </div>

            <div className="box-option">
                <div className="people people1">
                   <div className="peop-wrap">
                        <p className="type">성인</p>
                        <p className="price">{adult_fee.toLocaleString()}원</p>
                    </div>
                    <div className="step">
                        <button
                            className="button minus"
                            onClick={() => handleCountChange('adult', 'minus')}
                        >
                            <FiMinus />
                        </button>
                        <span>{adultCount}</span>
                        <button
                            className="button plus"
                            onClick={() => handleCountChange('adult', 'plus')}
                        >
                            <FiPlus />
                        </button>
                    </div>
                </div>

                <div className="people people2">
                    

                     <div className="peop-wrap">
                        <p className="type">아동</p>
                        <p className="price">{child_fee.toLocaleString()}원</p>
                    </div>
                    <div className="step">
                        <button
                            className="button minus"
                            onClick={() => handleCountChange('child', 'minus')}
                        >
                            <FiMinus />
                        </button>
                        <span>{childCount}</span>
                        <button
                            className="button plus"
                            onClick={() => handleCountChange('child', 'plus')}
                        >
                            <FiPlus />
                        </button>
                    </div>
                </div>

                <div className="total-wrap">
                    <strong>총액</strong>
                    <em>{baseAmount.toLocaleString()}원</em>
                </div>
            </div>

            <div className="btn-wrap">
                <ReserveBtn
                    className="o"
                    disabled={adultCount === 0 && childCount === 0}
                    onReserve={handleReservation}
                />
            </div>
        </section>
    );
};

export default DetailSide;
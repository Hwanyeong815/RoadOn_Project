import './style.scss';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DetailSide = ({ tourData }) => {
    const [childCount, setChildCount] = useState(0);
    const [adultCount, setAdultCount] = useState(0);
    const navigate = useNavigate();

    if (!tourData) return null;

    const { subtitle, adult_fee = 0, child_fee = 0, posterImg } = tourData;

    const totalPrice = adultCount * adult_fee + childCount * child_fee;

    const handleCountChange = (type, operation) => {
        if (type === 'child') {
            setChildCount((prev) => {
                const newCount = operation === 'plus' ? prev + 1 : Math.max(0, prev - 1);
                return newCount;
            });
        } else {
            setAdultCount((prev) => {
                const newCount = operation === 'plus' ? prev + 1 : Math.max(0, prev - 1);
                return newCount;
            });
        }
    };

    const handleReservation = () => {
        const reservationData = {
            tour: tourData,
            adultCount: adultCount,
            childCount: childCount,
            totalPrice: totalPrice,
            productType: 'tour',
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
                <div className="people people2">
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
                <div className="total-wrap">
                    <strong>총액</strong>
                    <em>{totalPrice.toLocaleString()}원</em>
                </div>
            </div>
            <div className="btn-wrap">
                {/* adultCount와 childCount가 모두 0일 때 버튼 비활성 */}
                <button
                    className="button large o reserve"
                    disabled={adultCount === 0 && childCount === 0}
                    onClick={handleReservation}
                >
                    예약하기
                </button>
            </div>
        </section>
    );
};

export default DetailSide;

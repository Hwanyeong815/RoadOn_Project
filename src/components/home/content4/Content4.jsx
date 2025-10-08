import Component1 from './component/Component1';
import './style.scss';

const Content4 = () => {
    return (
        <div className="content4">
            <div className="content4_top">
                <p className="text1">항공+호텔 조합</p>
                <div className="imgwrap">
                    <img className="airplane" src="./images/main/airplane.png" alt="airplane" />
                    <video autoPlay muted loop playsInline>
                        <source src="/videos/main/flight.mp4" type="video/mp4" />
                    </video>
                </div>
                <p className="text2">선착순 한정 특가!</p>
            </div>

            <Component1 />
        </div>
    );
};

export default Content4;

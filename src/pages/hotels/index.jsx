import AirportCon2 from '../../components/airport/airportMain/AirportCon2';
import AirportCon3 from '../../components/airport/airportMain/AirportCon3';
import AirportCon4 from '../../components/airport/airportMain/AirportCon4';
import AirportCon5 from '../../components/airport/airportMain/AirportCon5';
import AirportMain from '../../components/airport/airportMain/AirportMain';
import HotelsMainCon1 from '../../components/hotels/hotelsMain/hotelsMainCon1';
import './style.scss';

const Hotels = () => {
    return (
        <main className="hotel-main">
            <HotelsMainCon1 />
            <AirportCon2 />
            <AirportCon3 />
            <AirportCon4 />
            <AirportCon5 />
        </main>
    );
};

export default Hotels;

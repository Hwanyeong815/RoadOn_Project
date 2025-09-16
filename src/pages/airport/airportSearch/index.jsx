import './style.scss';
import AirportSearchBarList from '../../../components/ui/AirportSearchBarList/AirportSearchBarList';
import Filter from '../../../components/airport/airportSearch/Filter';
import AirportBoxList from '../../../components/airport/airportSearch/AirportBoxList';

const AirportSearch = () => {
    return (
        <main className="airport">
            <AirportSearchBarList />
            <div className="inner">
                <Filter />
                <div className="list-wrap">
                    <div className="list-top">
                        <div className="sort"></div>
                    </div>
                    <div className="list-box">
                        <AirportBoxList />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AirportSearch;

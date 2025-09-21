// src/components/.../TourMainCon3.jsx
import useTourStore from '../../../store/tourStore';
import TourCon3Item from './tourCon/TourCon3Item';

const TourMainCon3 = () => {
    const packages = useTourStore((s) => s.packages);
    return (
        <section className="tour-main-con tour-main-con3">
            <div className="inner">
                <div className="head">
                    <h2>씬투어 패키지 둘러보기</h2>
                </div>
                <ul className="package-wrap">
                    {packages.map((pack) => (
                        <TourCon3Item key={pack.id} pack={pack} slug={pack.slug} />
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default TourMainCon3;

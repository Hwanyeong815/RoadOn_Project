import GradeColumn from './GradeColumn';
import './style.scss';
import gradeData from '../../../api/gradeData';
const Grade = () => {
    return (
        <div className="mypage-grade">
            <div className="mypage-title-wrap">
                <h2 className="mypage-title">등급별 혜택</h2>
            </div>

            <section className="mypage-grade-main-wrap">
                {gradeData.map((g) => (
                    <GradeColumn key={g.code} {...g} />
                ))}
            </section>
        </div>
    );
};

export default Grade;

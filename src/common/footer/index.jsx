import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="footer">
            <div className="inner">
                <div className="footer-group">
                    <h2>
                        <Link to="/">
                            <img src="/images/ci-grey.png" alt="" />
                        </Link>
                    </h2>
                    <section className="footer-info-wrap">
                        <div className="links">
                            <p>이용약관</p>
                            <p>개인정보처리방침</p>
                            <p>소비자 분쟁해결</p>
                            <p>기준콘텐츠산업진흥법</p>
                        </div>
                        <div className="info">
                            <p>고객센터 1644-8282 (오전 9시 - 익일 새벽 3시)</p>
                            <p>서울특별시 서초구 서초대로77길 41 대동2빌딩 9층</p>
                        </div>
                        <div className="copyright">
                            <p>Copyright SceneTour COMPANY Corp. All rights reserved.</p>
                        </div>
                    </section>
                </div>
                <section className="footer-award-wrap">
                    <p>
                        <img src="/images/common/award1.png" alt="award1" />
                        2025 하이서울 <br /> 브랜드 선정
                    </p>
                    <p>
                        <img src="/images/common/award2.png" alt="award2" />
                        2025 하이서울 <br /> 브랜드 선정
                    </p>
                    <p>
                        <img src="/images/common/award3.png" alt="award1" />
                        2025 하이서울 <br /> 브랜드 선정
                    </p>
                    <p>
                        <img src="/images/common/award4.png" alt="award1" />
                        2025 하이서울 <br /> 브랜드 선정
                    </p>
                </section>
            </div>
        </footer>
    );
};

export default Footer;

const TourCon3Item = ({ pack }) => {
    const { thumbImg, contents, title, subtitle, desc, duration, adult_fee } = pack;

    // ✅ 숫자 포맷 (천 단위 콤마 추가)
    const formattedFee = typeof adult_fee === 'number' ? adult_fee.toLocaleString() : adult_fee;

    return (
        <li>
            <div className="img-wrap">
                <img src={thumbImg} alt={title} />
            </div>
            <div className="txt-wrap">
                <div className="txt-row txt-row1">
                    <span>{contents}</span>
                    <span>{title}</span>
                </div>
                <div className="txt-row txt-row2">
                    <h2 className="txt-title">{subtitle}</h2>
                </div>
                <div className="txt-row txt-row3">
                    <h2 className="txt-desc">{desc}</h2>
                </div>
                <div className="txt-row txt-row4">
                    <div className="txt-group">
                        <p>{duration}</p>
                        <p>전문 가이드, 촬영지 투어</p>
                    </div>
                    <div className="txt-group">
                        <p>1인 기준</p>
                        <strong className="price">{formattedFee}원</strong>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default TourCon3Item;

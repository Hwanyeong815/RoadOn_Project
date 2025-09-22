import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';
import KakaoMap from '../../../hotels/hotelsDetail/KakaoMap';
import './style.scss';

const DetailLocation = ({ locationRef, tourData }) => {
    const [copied, setCopied] = useState(false);

    const handleCopySuccess = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 해외 주소는 카카오맵에서 지원하지 않으므로 강남역 주소 사용
    const fallbackAddress = '서울특별시 강남구 강남대로 396';
    const displayAddress = tourData?.location || 'Calle Cardenal Ilundain, 28, 스페인';

    // 주요 랜드마크 정보
    const landmarks = [
        '마리아 루이사 공원 1.3km',
        '플라자 드 에스파니아 1.5km',
        '레알 알카사르 데 세비야 2.2km',
        '세비야 대성당 2.6km',
    ];

    return (
        <section id="detail-location" ref={locationRef}>
            <h2 className="title">여행지 위치</h2>
            <div className="map">
                <KakaoMap address={fallbackAddress} name={tourData?.title || '투어 위치'} />
            </div>
            <div className="address">
                <strong>
                    {displayAddress}
                    <CopyToClipboard text={displayAddress} onCopy={handleCopySuccess}>
                        <span
                            className="copy-icon"
                            style={{ cursor: 'pointer', marginLeft: '8px' }}
                        >
                            <HiOutlineClipboardDocument />
                        </span>
                    </CopyToClipboard>
                    {copied && <span className="copy-feedback">주소가 복사되었습니다.</span>}
                </strong>
                <ul className="vector">
                    {landmarks.map((landmark, idx) => (
                        <li key={idx}>{landmark}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default DetailLocation;

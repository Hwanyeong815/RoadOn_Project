// src/components/Header.jsx
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { useRef, useEffect } from 'react';
import useAutoHeaderBg from '../../hooks/useAutoHeaderBg';

const Header = () => {
    const headerRef = useRef(null);
    useAutoHeaderBg(headerRef);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        // 로고 img 선택 (h1 내부)
        const img = header.querySelector('h1 img');
        if (!img) return;

        // 기본 경로(필요시 변경)
        const defaultSrc = img.dataset.srcDefault || '/images/ci.png';
        const greySrc = img.dataset.srcGrey || '/images/ci-grey.png';

        // 프리로드: 깜빡임 최소화
        const preload = (src) => {
            const p = new Image();
            p.src = src;
        };
        preload(defaultSrc);
        preload(greySrc);

        // 적용 함수
        const apply = () => {
            // bg-on이 있으면 "비투명(흰배경) 상태"로 간주 -> grey
            if (header.classList.contains('bg-on')) {
                if (img.src !== greySrc) img.src = greySrc;
            } else {
                if (img.src !== defaultSrc) img.src = defaultSrc;
            }
        };

        // 초기 적용 (마운트 시)
        apply();

        // class 변화 감지
        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.attributeName === 'class') {
                    apply();
                    break;
                }
            }
        });
        mo.observe(header, { attributes: true, attributeFilter: ['class'] });

        // cleanup
        return () => {
            mo.disconnect();
        };
    }, []);

    return (
        <header id="header" ref={headerRef} className="site-header">
            <div className="inner">
                <h1>
                    <Link to="/">
                        <img
                            src="/images/ci.png"
                            alt="Brand"
                            data-src-default="/images/ci.png"
                            data-src-grey="/images/ci-grey.png"
                            width="140"
                            height="auto"
                        />
                    </Link>
                </h1>
                <NavBar />
            </div>
        </header>
    );
};

export default Header;

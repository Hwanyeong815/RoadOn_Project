// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { useRef, useEffect } from 'react';
import useAutoHeaderBg from '../../hooks/useAutoHeaderBg';
// import FloatingBtn from './FloatingBtn' // 필요 시 사용

const Header = () => {
    const headerRef = useRef(null);
    const { pathname } = useLocation();

    // /hotels, /airport 페이지는 초기에 반드시 투명 유지 → 40px 이상 스크롤 시에만 bg-on 허용
    const forceTransparent = pathname === '/hotels' || pathname === '/airport';
    useAutoHeaderBg(headerRef, {
        deps: [pathname],
        minScrollForOn: forceTransparent ? 40 : 0,
    });

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const img = header.querySelector('h1 img');
        if (!img) return;

        const defaultSrc = img.dataset.srcDefault || '/images/ci.png';
        const greySrc = img.dataset.srcGrey || '/images/ci-grey.png';

        const preload = (src) => {
            const p = new Image();
            p.src = src;
        };
        preload(defaultSrc);
        preload(greySrc);

        const apply = () => {
            const targetSrc = header.classList.contains('bg-on') ? greySrc : defaultSrc;
            if (img.dataset.currentSrc === targetSrc) return;

            // 부드러운 전환: 페이드 아웃 → 소스 교체 → onload에 페이드 인
            img.style.transition = 'opacity 0.14s ease';
            img.style.opacity = '0';

            const doSwap = () => {
                img.dataset.currentSrc = targetSrc;
                const onLoad = () => {
                    img.removeEventListener('load', onLoad);
                    requestAnimationFrame(() => {
                        img.style.opacity = '1';
                    });
                };
                img.addEventListener('load', onLoad);
                img.src = targetSrc;
            };

            setTimeout(doSwap, 60);
        };

        // 초기 적용
        apply();

        // 헤더 클래스 변화 감지 → 로고 스왑
        const mo = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.attributeName === 'class') {
                    apply();
                    break;
                }
            }
        });
        mo.observe(header, { attributes: true, attributeFilter: ['class'] });

        return () => mo.disconnect();
    }, [pathname]);

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
                            data-current-src="/images/ci.png"
                            width="140"
                            height="auto"
                        />
                    </Link>
                </h1>
                <div className="mobile-menu-wrap">
                    <img src="/images/ham.png" alt="" className="mobile-menu" />
                </div>
                <NavBar />
            </div>
            {/* <FloatingBtn /> */}
        </header>
    );
};

export default Header;

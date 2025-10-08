// src/components/Header.jsx
import { Link, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { useRef, useEffect } from 'react';
import useAutoHeaderBg from '../../hooks/useAutoHeaderBg';

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

        const logoImg = header.querySelector('h1 img');
        const hamImg = header.querySelector('.mobile-menu');
        if (!logoImg || !hamImg) return;

        const defaultLogoSrc = logoImg.dataset.srcDefault || '/images/ci.png';
        const greyLogoSrc = logoImg.dataset.srcGrey || '/images/ci-grey.png';
        const defaultHamSrc = hamImg.dataset.srcDefault || '/images/ham.png';
        const greyHamSrc = hamImg.dataset.srcGrey || '/images/ham-grey.png';

        // 이미지 미리 로드
        [defaultLogoSrc, greyLogoSrc, defaultHamSrc, greyHamSrc].forEach((src) => {
            const p = new Image();
            p.src = src;
        });

        const swap = (img, targetSrc) => {
            if (img.dataset.currentSrc === targetSrc) return;
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

        const apply = () => {
            const useGrey = header.classList.contains('bg-on');
            swap(logoImg, useGrey ? greyLogoSrc : defaultLogoSrc);
            swap(hamImg, useGrey ? greyHamSrc : defaultHamSrc);
        };

        // 초기 적용
        apply();

        // 헤더 클래스 변화 감지 → 로고 + 햄버거 아이콘 스왑
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
                    <img
                        src="/images/ham.png"
                        alt=""
                        className="mobile-menu"
                        data-src-default="/images/ham.png"
                        data-src-grey="/images/ham-grey.png"
                        data-current-src="/images/ham.png"
                    />
                </div>
                <NavBar />
            </div>
        </header>
    );
};

export default Header;

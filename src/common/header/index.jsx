import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import { useRef, useEffect } from 'react';
import useAutoHeaderBg from '../../hooks/useAutoHeaderBg';
import FloatingBtn from './FloatingBtn';

const Header = () => {
    const headerRef = useRef(null);
    useAutoHeaderBg(headerRef);

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
            if (header.classList.contains('bg-on')) {
                if (img.src !== greySrc) img.src = greySrc;
            } else {
                if (img.src !== defaultSrc) img.src = defaultSrc;
            }
        };

        apply();

        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.attributeName === 'class') {
                    apply();
                    break;
                }
            }
        });
        mo.observe(header, { attributes: true, attributeFilter: ['class'] });

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
            {/* <FloatingBtn /> */}
        </header>
    );
};

export default Header;

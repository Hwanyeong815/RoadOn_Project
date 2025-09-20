import React, { useEffect, useRef, useState } from 'react';
import Grade from '../../components/myPage/grade';
import Profile from '../../components/myPage/profile';
import Recom from '../../components/myPage/recom';
import Reserve from '../../components/myPage/reserve';
import Reward from '../../components/myPage/reward';
import Support from '../../components/myPage/support';
import WishList from '../../components/myPage/wishList';
import './style.scss';
import CouponButton from '../../components/ui/coupon/CouponButton';

const SECTION_KEY = 'mypage_section';
const SUPPORT_TAB_KEY = 'support_tab';
const REWARD_TAB_KEY = 'reward_tab';

const validSections = new Set(['reserve', 'wishlist', 'support', 'grade', 'reward']);

const MyPage = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [rewardTab, setRewardTab] = useState('coupons');
    const [supportTab, setSupportTab] = useState('notice');

    const reserveRef = useRef(null);
    const supportRef = useRef(null);
    const wishlistRef = useRef(null);
    const gradeRef = useRef(null);
    const rewardRef = useRef(null);
    const containerRef = useRef(null);

    const readSearchParams = () => {
        try {
            return new URLSearchParams(window.location.search);
        } catch {
            return new URLSearchParams();
        }
    };

    const replaceUrlParams = (updater = (params) => params) => {
        const params = readSearchParams();
        const next = updater(params);
        const s = next.toString();
        const newUrl = `${window.location.pathname}${s ? `?${s}` : ''}${
            window.location.hash || ''
        }`;
        window.history.replaceState({}, '', newUrl);
    };

    const pushSectionToUrl = (section, opts = {}) => {
        replaceUrlParams((params) => {
            if (!section) {
                params.delete(SECTION_KEY);
            } else {
                params.set(SECTION_KEY, section);
            }

            if (section === 'support' && opts.tab) params.set(SUPPORT_TAB_KEY, opts.tab);

            if (section === 'reward' && opts.tab) params.set(REWARD_TAB_KEY, opts.tab);

            if (opts.clearSupportTab) params.delete(SUPPORT_TAB_KEY);
            if (opts.clearRewardTab) params.delete(REWARD_TAB_KEY);

            return params;
        });
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = readSearchParams();
        const sec = params.get(SECTION_KEY);
        const sTab = params.get(SUPPORT_TAB_KEY);
        const rTab = params.get(REWARD_TAB_KEY);

        if (sec && validSections.has(sec)) {
            setActiveSection(sec);
        } else {
            setActiveSection(null);
        }

        if (sTab) setSupportTab(sTab);
        if (rTab) setRewardTab(rTab);

        const onPop = () => {
            const p = readSearchParams();
            const sec2 = p.get(SECTION_KEY);
            const sTab2 = p.get(SUPPORT_TAB_KEY);
            const rTab2 = p.get(REWARD_TAB_KEY);

            setActiveSection(sec2 && validSections.has(sec2) ? sec2 : null);
            if (sTab2) setSupportTab(sTab2);
            if (rTab2) setRewardTab(rTab2);
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, []);

    const onNavigate = (section, opts = {}) => {
        if (section === 'reward' && opts.tab) setRewardTab(opts.tab);
        if (section === 'support' && opts.tab) setSupportTab(opts.tab);

        setActiveSection(section);

        pushSectionToUrl(section, opts);
    };

    useEffect(() => {
        if (!activeSection) {
            containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        const el =
            activeSection === 'reserve'
                ? reserveRef.current
                : activeSection === 'support'
                ? supportRef.current
                : activeSection === 'wishlist'
                ? wishlistRef.current
                : activeSection === 'grade'
                ? gradeRef.current
                : activeSection === 'reward'
                ? rewardRef.current
                : null;

        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [activeSection]);

    return (
        <section id="myPage" ref={containerRef}>
            <div className="coupon-wrap">
                <CouponButton />
            </div>
            <div className="inner">
                <Profile activeSection={activeSection} onNavigate={onNavigate} />

                {activeSection === null ? (
                    <>
                        <div ref={reserveRef}>
                            <Reserve preview={true} onMore={() => onNavigate('reserve')} />
                        </div>

                        <div ref={wishlistRef}>
                            <WishList preview={true} onMore={() => onNavigate('wishlist')} />
                        </div>
                    </>
                ) : (
                    <>
                        {activeSection === 'reserve' && (
                            <div ref={reserveRef}>
                                <Reserve preview={false} onMore={() => onNavigate('reserve')} />
                            </div>
                        )}

                        {activeSection === 'wishlist' && (
                            <div ref={wishlistRef}>
                                <WishList preview={false} onMore={() => onNavigate('wishlist')} />
                            </div>
                        )}

                        {activeSection === 'support' && (
                            <div ref={supportRef}>
                                <Support
                                    activeTab={supportTab}
                                    onTabChange={(t) => setSupportTab(t)}
                                />
                            </div>
                        )}

                        {activeSection === 'grade' && (
                            <div ref={gradeRef}>
                                <Grade />
                            </div>
                        )}

                        {activeSection === 'reward' && (
                            <div ref={rewardRef}>
                                <Reward defaultTab={rewardTab} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default MyPage;

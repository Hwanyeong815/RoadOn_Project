import React, { useEffect, useState } from 'react';
import './style.scss';

import { useNavigate, useLocation } from 'react-router-dom';
import { openCouponBoxShortcut } from '../../ui/swal/presets'; // ✅ 쿠폰함 이동 헬퍼

import TabButton from '../../ui/tabButton/TabButton';
import Points from './Points';
import Coupons from './Coupons';
import useAuthStore from '../../../store/authStore';
import CouponButton from '../../ui/coupon/CouponButton';

const Reward = ({ defaultTab = 'coupons' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id;

    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    // URL 파라미터로 탭 제어 (reward_tab=coupons|points)
    useEffect(() => {
        const q = new URLSearchParams(search);
        const tab = q.get('reward_tab');
        if (tab === 'coupons' || tab === 'points') setActiveTab(tab);
    }, [search]);

    return (
        <div id="reward">
            <h2 className="mypage-title">할인 혜택</h2>

            {/* ✅ 쿠폰 발급 버튼: 성공 시 확인 → 쿠폰함으로 이동 */}
            {/* <div className="coupon-wrap">
                <CouponButton
                    onIssued={() => {
                        openCouponBoxShortcut({ navigate });
                    }}
                />
            </div> */}

            <div className="tab-button-wrap" role="tablist" aria-label="할인 혜택 탭">
                <TabButton
                    label="쿠폰함"
                    isActive={activeTab === 'coupons'}
                    onClick={() => setActiveTab('coupons')}
                />
                <TabButton
                    label="적립금"
                    isActive={activeTab === 'points'}
                    onClick={() => setActiveTab('points')}
                />
            </div>

            <div className="reward-main">
                {activeTab === 'coupons' && <Coupons userId={userId} />}
                {activeTab === 'points' && <Points userId={userId} />}
            </div>
        </div>
    );
};

export default Reward;

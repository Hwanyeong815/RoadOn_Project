// src/components/myPage/Reward.jsx
import React, { useEffect, useState } from 'react';
import './style.scss';

import TabButton from '../../ui/tabButton/TabButton';
import Points from './Points';
import Coupons from './Coupons';
import useAuthStore from '../../../store/authStore';

const Reward = ({ defaultTab = 'coupons' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const currentUser = useAuthStore((s) => s.currentUser);
    const userId = currentUser?.id;

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    return (
        <div id="reward">
            <h2 className="mypage-title">할인 혜택</h2>

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

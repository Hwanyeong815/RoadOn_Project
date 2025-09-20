// src/components/myPage/Coupons.jsx
import React, { useMemo, useState } from 'react';
import DropdownPill from '../../ui/dropdownPill/DropdownPill';
import TabButton2 from '../../ui/tabButton/TabButton2';
import CouponTicket from '../../ui/coupon/CouponTicket';
import useRewardStore from '../../../store/rewardStore';

const TABS = ['전체', '숙소', '투어'];

const Coupons = ({ userId }) => {
    const getCoupons = useRewardStore((s) => s.getCoupons);
    const coupons = getCoupons(userId) || [];

    const [tab, setTab] = useState('전체');
    const [status, setStatus] = useState('사용가능');
    const statusOptions = ['전체', '사용가능', '사용완료'];

    const matchesTab = (coupon, currentTab) => {
        if (!coupon) return false;
        if (currentTab === '전체') return true;
        if (currentTab === '숙소') return String(coupon.className || '').includes('c-hotel');
        if (currentTab === '투어') return String(coupon.className || '').includes('c-tour');
        return true;
    };

    const matchesStatus = (coupon, currentStatus) => {
        if (currentStatus === '전체') return true;
        if (currentStatus === '사용가능') return coupon.disabled === false;
        if (currentStatus === '사용완료') return coupon.disabled === true;
        return true;
    };

    // 최종 필터링
    const filteredCoupons = useMemo(() => {
        return coupons.filter((c) => matchesTab(c, tab) && matchesStatus(c, status));
    }, [coupons, tab, status]);

    // ✅ 전체 개수 & 사용 가능 개수 계산
    const totalCount = coupons.length;
    const availableCount = coupons.filter((c) => !c.disabled).length;
    const usedCount = coupons.filter((c) => c.disabled).length;

    return (
        <div className="coupons">
            <section className="coupons-head">
                <div className="tab-button-wrap2" role="tablist" aria-label="쿠폰 탭">
                    {TABS.map((label) => (
                        <TabButton2
                            key={label}
                            label={label}
                            isActive={tab === label}
                            onClick={() => setTab(label)}
                        />
                    ))}
                </div>

                <div className="dropdown-wrap">
                    <DropdownPill value={status} onChange={setStatus} options={statusOptions} />
                </div>
            </section>

            <section className="coupons-body">
                {filteredCoupons.length > 0 ? (
                    filteredCoupons.map((coupon, i) => (
                        <CouponTicket key={coupon.id ?? i} {...coupon} />
                    ))
                ) : (
                    <p className="empty">조건에 맞는 쿠폰이 없습니다.</p>
                )}
            </section>
        </div>
    );
};

export default Coupons;

import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../common/Layout';
import {
    Home,
    MyPage,
    NotFiles,
    Login,
    Payment,
    HotelsDetail,
    HotelsSearch,
    Tour,
    TourDetail,
    Airport,
    Hotels,
    AirportSearch,
    Join,
    Landing,
    PaymentFail,
    PaymentSuccess,
} from '../pages';
import AirportDetail from '../components/airport/airportSearch/AirportDetail';
import ScrollToTop from '../common/ScrollToTop';
import EditProfile from '../components/login/editProfile';
import Logout from '../components/logout';
import Test from '../components/ui/swal/Test';
import { useLayoutEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';

// ✅ 최초 1회만 Landing으로 보내는 가드
const FirstVisitGate = () => {
    const nav = useNavigate();
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // 첫 방문에 "/"로 진입하면 landing으로 1회 리다이렉트
        if (pathname === '/' && !localStorage.getItem('seen:landing')) {
            localStorage.setItem('seen:landing', '1');
            nav('/landing', { replace: true });
        }
    }, [nav, pathname]);

    return <Outlet />;
};

export const MyRoutes = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* FirstVisitGate 적용 루트 */}
                <Route element={<FirstVisitGate />}>
                    {/* 랜딩 페이지는 별도 경로 */}
                    <Route path="/landing" element={<Landing />} />

                    {/* 공통 레이아웃 */}
                    <Route element={<Layout />}>
                        {/* "/" 진입 시 홈 (FirstVisitGate가 1회 landing으로 보내줌) */}
                        <Route index element={<Home />} />

                        {/* 결제 관련 */}
                        <Route path="payment">
                            <Route index element={<Payment />} />
                            {/* ✅ 성공 경로: completed (HotelPaymentRight.successUrl과 일치시켜야 함) */}
                            {/* <Route path="completed" element={<PaymentCompleted />} /> */}
                            <Route path="success" element={<PaymentSuccess />} />
                            <Route path="fail" element={<PaymentFail />} />
                        </Route>

                        {/* 호텔 */}
                        <Route path="hotels">
                            <Route index element={<Hotels />} />
                            <Route path="search" element={<HotelsSearch />} />
                            <Route path=":slug" element={<HotelsDetail />} />
                        </Route>

                        {/* 항공 */}
                        <Route path="airport">
                            <Route index element={<Airport />} />
                            <Route path="search" element={<AirportSearch />} />
                            <Route path=":slug" element={<AirportDetail />} />
                        </Route>

                        {/* 투어 */}
                        <Route path="tour">
                            <Route index element={<Tour />} />
                            <Route path=":slug" element={<TourDetail />} />
                        </Route>

                        {/* ✅ 로그인 필요 */}
                        <Route
                            path="mypage"
                            element={
                                <ProtectedRoute>
                                    <MyPage />
                                </ProtectedRoute>
                            }
                        />
                        {/* 기타 */}
                        <Route path="login" element={<Login />} />
                        <Route path="join" element={<Join />} />
                        <Route path="logout" element={<Logout />} />
                        <Route path="editProfile" element={<EditProfile />} />
                        <Route path="test" element={<Test />} />

                        {/* 404 */}
                        <Route path="*" element={<NotFiles />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

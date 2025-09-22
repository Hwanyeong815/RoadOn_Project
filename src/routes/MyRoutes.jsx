import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
} from '../pages';

import AirportDetail from '../components/airport/airportSearch/AirportDetail';
import ScrollToTop from '../common/ScrollToTop';
import EditProfile from '../components/login/editProfile';
import TourPaymentLeft from '../components/payment/TourPaymentLeft';
import Logout from '../components/logout';
import Test from '../components/ui/swal/Test';

export const MyRoutes = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* 최초 로드시 Landing 보이고, 이후 /는 Home */}
                <Route path="/" element={<Landing />} />
                <Route path="/landing" element={<Landing />} />

                <Route element={<Layout />}>
                    <Route index element={<Home />} /> {/* / -> Home */}
                    <Route path="payment" element={<Payment />} />
                    <Route path="payment/tour" element={<TourPaymentLeft />} />
                    <Route path="hotels">
                        <Route index element={<Hotels />} />
                        <Route path="search" element={<HotelsSearch />} />
                        <Route path=":slug" element={<HotelsDetail />} />
                    </Route>
                    <Route path="airport">
                        <Route index element={<Airport />} />
                        <Route path="search" element={<AirportSearch />} />
                        <Route path=":slug" element={<AirportDetail />} />
                    </Route>
                    <Route path="tour">
                        <Route index element={<Tour />} />
                        <Route path=":slug" element={<TourDetail />} />
                    </Route>
                    <Route path="myPage" element={<MyPage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="join" element={<Join />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="editProfile" element={<EditProfile />} />
                    <Route path="test" element={<Test />} />
                    <Route path="*" element={<NotFiles />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

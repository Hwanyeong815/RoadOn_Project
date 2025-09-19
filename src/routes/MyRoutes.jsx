import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../common/Layout";
import {

    Home,
    MyPage,
    NotFiles,
    Login,
    Payment,
    // PayCompleted, 미완
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

export const MyRoutes = () => {

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="payment" element={<Payment />} />/
                    {/*Route path="payment/completed" element={<PayCompleted />} />*/}
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
                    <Route path="Join" element={<Join />} />
                    <Route path="editProfile" element={<EditProfile />} />
                    <Route path="*" element={<NotFiles />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
   
};

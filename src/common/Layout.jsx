// Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import FloatingBtn from './header/FloatingBtn';

const Layout = () => {
    return (
        <div className="wrap">
            <div className="site-header">
                <Header />
            </div>

            <main className="main">
                <Outlet />
            </main>

            <Footer />
            <FloatingBtn showAfter={1200} />
        </div>
    );
};

export default Layout;

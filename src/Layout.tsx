import { Outlet } from "react-router-dom";
import Header from "./widgets/Header";
import './index.css'

const Layout: React.FC = () => {
    return (
        <div className="bg-neutral-900 h-screen">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
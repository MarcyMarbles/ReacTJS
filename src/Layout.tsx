import { Outlet } from "react-router-dom";
import Header from "./widgets/Header";

const Layout: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
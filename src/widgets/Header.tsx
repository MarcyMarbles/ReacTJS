import {Link, useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {clearProfile, fetchProfile, logout} from "../store/profileSlice";
import HeaderDropdown from "./HeaderDropdown";
import SalaryModal from "../components/SalaryModal";
import LoanModal from "../components/LoanModal";

function Header() {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.profile);
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

    const usernameFromCookies = Cookies.get('username');

    useEffect(() => {
        const token = Cookies.get('token');

        if (token && usernameFromCookies) {
            dispatch(fetchProfile({username: usernameFromCookies}));
        }
        return () => {
            dispatch(clearProfile());
        };
    }, [dispatch, usernameFromCookies]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    }

    const handleSalarySubmit = (data: { salary: number; salaryType: string; currency: string }) => {
        console.log('Salary data:', data);
        const token = Cookies.get("token");
        fetch("http://localhost:8080/api/salary-details", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify((data))
        }).then(r => console.log(r));
    };

    const handleLoanSubmit = (data: {
        loanerName: string;
        loanType: string;
        amount: number;
        currency: string;
        approximateDate: Date;
    }) => {
        console.log('Loan data:', data);
        const token = Cookies.get("token");
        fetch("http://localhost:8080/api/loans", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then(r => console.log(r));
    };

    let avatarSrc = "/assets/default-avatar.png";
    if (user?.avatar?.name && user?.id) {
        avatarSrc = `http://localhost:8080/api/files/users/${user.id}/${user.avatar.name}`;
    }

    return (
        <header className="p-2 text-bg-dark w-full">
            <div className="grid grid-cols-3 w-full max-w-[98%] mx-auto">
                <div className='flex items-center justify-between w-96'>
                    <Link to="/" className="nav-link px-2 text-white">
                        <h3 className="text-white font-bold text-3xl cursor-pointer">CoinKeeper</h3>
                    </Link>
                </div>
                <nav className="flex items-center justify-center space-x-6 text-white">
                    <Link className="text-white nav-link px-2 hover:text-gray-300" to="/">
                        Dashboard
                    </Link>
                    <Link className="text-white nav-link px-2 hover:text-gray-300" to="/feed">
                        Posts
                    </Link>
                    <Link className="text-white nav-link px-2 hover:text-gray-300" to="/friends">
                        Friends
                    </Link>
                    <button
                        onClick={() => setIsSalaryModalOpen(true)}
                        className="text-white nav-link px-2 hover:text-gray-300 bg-transparent border-none cursor-pointer"
                    >
                        Add Salary
                    </button>
                    <button
                        onClick={() => setIsLoanModalOpen(true)}
                        className="text-white nav-link px-2 hover:text-gray-300 bg-transparent border-none cursor-pointer"
                    >
                        Add Loan
                    </button>

                </nav>

                <div className="flex items-center justify-end space-x-2"
                     style={{minHeight: '50px'}}>
                    {!user ? (
                        <>
                            <Link to="/login">
                                <button type="button" className="btn btn-outline-light me-2">Login</button>
                            </Link>
                            <Link to="/register">
                                <button type="button" className="btn btn-primary">Sign-up</button>
                            </Link>
                        </>
                    ) : (
                        <HeaderDropdown
                            user={
                                <img
                                    src={avatarSrc}
                                    alt="Avatar"
                                    width={50}
                                    height={50}
                                    className="rounded-circle"
                                    style={{objectFit: 'cover'}}
                                />
                            }
                            username={user.username || ""}
                        >
                            <Link to="/" onClick={handleLogout} className="text-decoration-none text-reset">
                                Log out
                            </Link>
                        </HeaderDropdown>
                    )}
                </div>
            </div>

            <SalaryModal
                isOpen={isSalaryModalOpen}
                onClose={() => setIsSalaryModalOpen(false)}
                onSubmit={handleSalarySubmit}
            />

            <LoanModal
                isOpen={isLoanModalOpen}
                onClose={() => setIsLoanModalOpen(false)}
                onSubmit={handleLoanSubmit}
            />
        </header>
    );
}

export default Header;

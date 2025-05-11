import {Link, useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "../store";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import Cookies from "js-cookie";
import {clearProfile, fetchProfile, logout} from "../store/profileSlice";
import HeaderDropdown from "./HeaderDropdown";

function Header() {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.profile);

    const usernameFromCookies = Cookies.get('username');

    useEffect(() => {
        const token = Cookies.get('token');

        if (token && usernameFromCookies) {
            dispatch(fetchProfile({ username: usernameFromCookies }));
        }
        return () => {
            dispatch(clearProfile());
        };
    }, [dispatch, usernameFromCookies]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    }

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
        </header>
    );
}

export default Header;

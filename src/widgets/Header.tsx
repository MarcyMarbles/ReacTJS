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
        <header className="p-2 text-bg-dark">
            <div className="container">
                <div
                    className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-2">
                    <Link to="/home" className="nav-link px-2 text-white">
                        <p className="fs-3 p-1 col-md-2 mb-2 mb-md-0 pointer-cursor">LinkUp</p>
                    </Link>
                    <nav className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <Link className="text-white nav-link px-2" to="/home">
                            Home
                        </Link>
                        <Link className="text-white nav-link px-2" to="/feed">
                            Posts
                        </Link>
                        <Link className="text-white nav-link px-2" to="/friends">
                            Friends
                        </Link>
                    </nav>
                    <div
                        className="d-flex justify-content-center align-items-center text-end col col-lg-auto mb-2 mb-md-0"
                        style={{minHeight: '50px'}}>
                        {!user ? (
                            <>
                                <Link to="/">
                                    <button type="button" className="btn btn-outline-light me-2">Login</button>
                                </Link>
                                <Link to="/">
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
            </div>
        </header>
    );
}

export default Header;

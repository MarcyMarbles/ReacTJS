import { Link } from "react-router-dom";


function Header() {

    return(
        <header className="p-2 text-bg-dark">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-2">
                    <p className="fs-3 p-1 col-md-2 mb-2 mb-md-0 pointer-cursor">LinkUp</p>
                    <nav className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <Link className="text-white nav-link px-2" to="/home">
                            Home
                        </Link>
                        <Link className="text-white nav-link px-2" to="/posts">
                            Posts
                        </Link>
                    </nav>
                    <div className="d-flex justify-content-center align-items-center text-end col col-lg-auto mb-2 mb-md-0" style={{ minHeight: '50px' }}>
                        <Link to="/">
                            <button type="button" className="btn btn-outline-light me-2">Login</button>
                        </Link>
                        <Link to="/">
                            <button type="button" className="btn btn-primary">Sign-up</button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;
import {ReactChildren, ReactNode, useEffect, useState} from "react";
import { Link } from "react-router-dom";


interface HeaderDropdownProps {
    username: string;
    user: React.ReactNode;
    children?: ReactNode;
}

export default function HeaderDropdown({username, children, user} : HeaderDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prev => !prev);
    }

    const handleClickOutside = (e: any) => {
        if (!e.target.closest(".dropdown")) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isOpen]);

    return(
        <div className="dropdown text-end z-1">
            <button
                className="btn rounded-5 p-0 text-light"
                type="button"
                id="dropdownMenuButton"
                onClick={toggleDropdown}
                aria-expanded={isOpen ? "true" : "false"}
                style={{ width: '50px', height: '50px', border: '0' }}
            >
                {user}
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-dark ${isOpen ? "show" : ""}`}
                aria-labelledby="dropdownMenuButton"
            >
                <li>
                    <Link className="dropdown-item" to={`/profile/${username}`}>
                        My profile
                    </Link>
                </li>
                <li>
                    <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-item">
                    {children}
                </li>
            </ul>
        </div>
    )
}
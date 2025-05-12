import {ReactChildren, ReactNode, useEffect, useState} from "react";
import { Link } from "react-router-dom";


interface HeaderDropdownProps {
    username: string;
    children?: ReactNode;
}

export default function HeaderDropdown({username, children} : HeaderDropdownProps) {
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
        <div className="dropdown text-end z-1 text-white">
            <button
                className="btn rounded-5 p-0 text-white"
                type="button"
                id="dropdownMenuButton"
                onClick={toggleDropdown}
                aria-expanded={isOpen ? "true" : "false"}
                style={{ width: '50px', height: '50px', border: '0' }}
            >
                Settings
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-dark ${isOpen ? "show" : ""}`}
                aria-labelledby="dropdownMenuButton"
            >
                <li>
                    <Link className="dropdown-item" to={'/'}>
                        Dashboard
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
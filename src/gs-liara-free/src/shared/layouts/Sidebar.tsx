import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../features/auth/AuthProvider";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen((pre) => !pre)}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className={`sidebar${isOpen ? " open-sidebar" : ""}`}>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {!user && (
            <li>
              <NavLink to="/auth/register">Register</NavLink>
            </li>
          )}
          {!user && (
            <li>
              <NavLink to="/auth/login">Login</NavLink>
            </li>
          )}
          {user && (
            <li>
              <button onClick={() => logout()}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

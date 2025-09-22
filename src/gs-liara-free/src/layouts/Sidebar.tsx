import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../features/auth/AuthProvider";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <button className="sidebar-toggle-btn">
        <FontAwesomeIcon
          icon={faBars}
          onClick={() => setIsOpen((pre) => !pre)}
        />
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

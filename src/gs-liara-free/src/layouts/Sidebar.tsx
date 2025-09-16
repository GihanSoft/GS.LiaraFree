import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { NavLink } from "react-router";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
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
          <li>
            <NavLink to="/security/register">Register</NavLink>
          </li>
          <li>
            <NavLink to="/security/login">Login</NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

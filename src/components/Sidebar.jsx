import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  FaBars,
  FaHome,
  FaCommentAlt,
  FaLock,
  FaQuestion,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/CustomStyle.css";

const Sidebar = () => {
  const { logout } = useAuth();
  const { auth } = useAuth();
  const { name } = auth || "";
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState("false");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <aside className="relative h-full bg-gray-200 py-3">
      <div className="mb-3 cursor-pointer px-2" onClick={toggleMenu}>
        <FaBars />
      </div>
      <div className={`${showMenu ? "block" : "hidden"}`}>
        <nav className="flex flex-col items-start">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active-nav-element" : "nav-element"
            }
          >
            <FaHome className="mr-2" />
            Home
          </NavLink>
          <NavLink
            to="post"
            className={({ isActive }) =>
              isActive ? "active-nav-element" : "nav-element"
            }
          >
            <FaCommentAlt className="mr-2" />
            Post
          </NavLink>
          <NavLink
            to="/private"
            className={({ isActive }) =>
              isActive ? "active-nav-element" : "nav-element"
            }
          >
            <FaLock className="mr-2" />
            Private Page
          </NavLink>
          <NavLink
            to="*"
            className={({ isActive }) =>
              isActive ? "active-nav-element" : "nav-element"
            }
          >
            <FaQuestion className="mr-2" />
            Missing
          </NavLink>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 mt-3 flex flex-col items-center">
          <pre>Hello {name}!</pre>
          <button
            className="mt-1 flex w-full cursor-pointer justify-center bg-orange-500 px-7 py-3 text-lg text-white hover:bg-orange-600"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
              toast.success("İstifadəçi çıxış etdi", { duration: 1000 });
            }}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

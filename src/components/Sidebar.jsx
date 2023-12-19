import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { logout } = useAuth();
  const { auth } = useAuth();
  const { name } = auth || null;
  const navigate = useNavigate();

  return (
    <aside className="h-full bg-gray-200 p-5">
      <div className="mb-5 cursor-pointer" onClick={() => navigate("/")}>
        <p>Application</p>
      </div>

      <nav className="flex flex-col">
        <NavLink to="/" className="mb-2 text-blue-600 hover:text-orange-500">
          Home
        </NavLink>
        <NavLink to="post" className="mb-2 text-blue-600 hover:text-orange-500">
          Post
        </NavLink>
        <NavLink
          to="/private"
          className="mb-2 text-blue-600 hover:text-orange-500"
        >
          Private Page
        </NavLink>
        <NavLink to="*" className="mb-2 text-blue-600 hover:text-orange-500">
          Missing
        </NavLink>
      </nav>

      <pre className="mt-3">{name}!</pre>

      <button
        className="mt-4 cursor-pointer rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
          toast.success("İstifadəçi çıxış etdi", { duration: 1000 });
        }}
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;

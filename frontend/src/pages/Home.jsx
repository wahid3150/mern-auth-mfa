import React from "react";
import { AppData } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { logoutUser, user } = AppData();
  const navigate = useNavigate();
  return (
    <div className="flex w-25 m-auto mt-40">
      <button
        className="bg-red-500 text-white p-2 rounded-md"
        onClick={() => logoutUser(navigate)}
      >
        LOGOUT
      </button>
      {user && user.role === "admin" && (
        <Link
          to="/dashboard"
          className="bg-purple-500 text-white p-2 rounded-md"
        >
          Dashboard
        </Link>
      )}
    </div>
  );
};

export default Home;

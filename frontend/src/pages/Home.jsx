import React from "react";
import { AppData } from "../context/AuthContext";

const Home = () => {
  const { logoutUser } = AppData();
  return (
    <div className="flex w-25 m-auto mt-40">
      <button
        className="bg-red-500 text-white p-2 rounded-md"
        onClick={logoutUser}
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Home;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UnAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <p className="text-xl">
        You are not authorized to view this page. Redirecting to login page...
      </p>
    </div>
  );
};

export default UnAuth;

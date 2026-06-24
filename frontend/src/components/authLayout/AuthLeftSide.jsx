import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLeftSide = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side Branding */}
      <div className="w-1/2 bg-black flex flex-col items-center justify-center px-10">
        <h2 className="text-white text-4xl font-bold mb-4 text-center">
          docker-pipeline 
        </h2>
        <p className="text-gray-400 text-lg text-center">
          Your gateway to excellence and innovation.
        </p>
      </div>

      {/* Right Side for Routes (Forms) */}
      <div className="w-1/2 flex items-center justify-center bg-white px-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLeftSide;

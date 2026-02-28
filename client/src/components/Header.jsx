import React from 'react';
import { assets } from "../assets/assets_frontend/assets.js";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 bg-blue-200">
      
      {/* Left side */}
      <div className="flex-1 mb-10 md:mb-0 p-4 md:p-8 lg:p-12 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Book Appointments <br /> With Trusted Doctors
        </h1>

        <div className="flex items-center space-x-4 md:space-x-6">
          <img src={assets.group_profiles} alt="Profiles" className="w-28 md:w-32 lg:w-40" />
          <p className="text-gray-600 text-sm md:text-base">
            Simply browse through our extensive list of trusted doctors, <br />
            and schedule your appointments easily.
          </p>
        </div>

        <a 
          href="#speciality" 
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Book Appointments
          <img src={assets.arrow_icon} alt="arrow" className="ml-3 w-5 h-5" />
        </a>
      </div>

      {/* Right side */}
      <div className="flex-1 p-4 md:p-8 lg:p-12">
        <img src={assets.header_img} alt="Header" className="w-full h-auto rounded-lg" />
      </div>
    </div>
  );
}

export default Header;

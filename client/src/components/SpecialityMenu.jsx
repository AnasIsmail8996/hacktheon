import React from 'react';
import { specialityData } from "../assets/assets_frontend/assets.js";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <section id="speciality" className="bg-white py-12 px-6 md:px-16">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Find By Speciality
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
          Simply browse through our extensive list of trusted doctors, 
          and schedule your appointments easily.
        </p>
      </div>

      {/* Speciality Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
        {specialityData.map((item, index) => (
          <Link
            key={index}
            onClick={()=>scrollTo(0,0)}
            to={`/doctors/${item.speciality}`}
            className="flex flex-col items-center p-4 md:p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <img
              src={item.image}
              alt={item.speciality}
              className="w-16 h-16 md:w-20 md:h-20 mb-3"
            />
            <p className="text-gray-800 text-sm md:text-base font-medium text-center">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;

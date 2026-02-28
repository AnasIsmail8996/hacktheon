import React from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-blue-50 w-full px-4 md:px-10 py-8 md:py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        
        {/* Left Side */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
            Book Appointment
          </h2>
          <p className="text-lg md:text-xl font-medium text-gray-700">
            With 100+ Trusted Doctors
          </p>

          <button 
            onClick={() => { navigate('/login'); scrollTo(0, 0); }}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-md font-medium text-sm md:text-base"
          >
            Create Account
          </button>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img 
            src={assets.appointment_img} 
            alt="Appointment Banner" 
            className="w-full max-w-xs md:max-w-sm lg:max-w-sm max-h-56 object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default Banner;

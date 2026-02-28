import React, { useContext } from 'react';
// import { doctors } from '../assets/assets_frontend/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
  const navigate = useNavigate();
const {doctors}=useContext(AppContext)
  return (
    <section className="py-12 px-6 md:px-16 bg-white">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Top Doctors To Book
        </h2>
        <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
          Simply browse through our extensive list of trusted doctors, <br />
          and schedule your appointments easily.
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}}
            className="cursor-pointer bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 p-4 flex flex-col items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full mb-4"
            />
            <div className="flex items-center mb-2 space-x-2">
              <p className="text-green-500 text-sm font-semibold">●</p>
              <p className="text-gray-600 text-sm">Available</p>
            </div>
            <p className="text-gray-900 font-semibold text-lg md:text-xl text-center">
              {item.name}
            </p>
            <p className="text-gray-600 text-sm md:text-base text-center">{item.speciality}</p>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div className="text-center mt-8">
        <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          More
        </button>
      </div>
    </section>
  );
};

export default TopDoctors;

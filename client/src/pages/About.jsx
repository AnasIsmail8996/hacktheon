import React from 'react';
import { assets } from '../assets/assets_frontend/assets.js';

const About = () => {
  return (
    <section className="px-6 md:px-16 py-12 bg-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          ABOUT <span className="text-blue-600">US</span>
        </h2>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm md:text-base">
          Prepcripto is dedicated to connecting you with trusted healthcare professionals quickly and efficiently. Your health is our priority.
        </p>
      </div>

      {/* Image + Vision */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
        {/* Image */}
        <div className="md:w-1/3 flex justify-center">
          <img
            src={assets.about_image}
            alt="About us"
            className="w-full max-w-xs h-auto rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Text */}
        <div className="md:w-2/3 space-y-6 p-6 bg-blue-50 rounded-lg min-h-[300px]">
          <h3 className="text-2xl font-semibold text-gray-800">Our Vision</h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            Our vision is to make healthcare accessible, reliable, and convenient for everyone. We aim to bridge the gap between patients and qualified doctors through technology.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            We strive to provide a seamless experience for booking appointments, finding specialists, and getting timely care without any hassle.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          WHY <span className="text-blue-600">CHOOSE US</span>
        </h2>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition text-center h-full">
          <h4 className="text-xl font-semibold mb-2">Efficiency</h4>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Book appointments quickly and manage your schedule effortlessly.
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition text-center h-full">
          <h4 className="text-xl font-semibold mb-2">Convenience</h4>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Access trusted doctors from anywhere, anytime, with just a few clicks.
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-lg transition text-center h-full">
          <h4 className="text-xl font-semibold mb-2">Personalization</h4>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Find doctors that match your specific needs and preferences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;

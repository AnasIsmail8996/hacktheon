import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const Contact = () => {
  return (
    <section className="px-6 md:px-16 py-12 bg-white">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          CONTACT <span className="text-blue-600">US</span>
        </h2>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm md:text-base">
          Get in touch with us for any inquiries, appointments, or career opportunities. We're here to help you.
        </p>
      </div>

      {/* Contact Info + Image */}
      <div className="flex flex-col md:flex-row items-center gap-8">

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={assets.contact_image}
            alt="Contact us"
            className="w-full max-w-xs h-auto rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Office Info */}
        <div className="md:w-1/2 space-y-4 bg-blue-50 p-6 rounded-lg min-h-[300px]">
          <h3 className="text-2xl font-semibold text-gray-800">Our Office</h3>
          <p className="text-gray-700 text-base md:text-lg">
            We are located in the New Town area, Karachi. Our doors are always open for patients and partners alike.
          </p>
          <p className="text-gray-700 text-base md:text-lg">
            Phone: <span className="font-medium">+92 734 863 8763</span>
          </p>
          <p className="text-gray-700 text-base md:text-lg">
            Email: <span className="font-medium">contact@prepcripto.com</span>
          </p>
          <p className="text-gray-700 text-base md:text-lg">
            Interested in joining our team? Learn more about our career opportunities below.
          </p>
          <button className="mt-3 bg-blue-600  cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition">
            Explore Jobs
          </button>
        </div>

      </div>

    </section>
  );
};

export default Contact;

import React from 'react'
import { assets } from '../assets/assets_frontend/assets.js'

const Footer = () => {
  return (
    <footer className="bg-blue-50 px-6 md:px-16 py-10 text-gray-700">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Left Section */}
        <div>
          <img src={assets.logo} alt="logo" className="w-28 mb-4" />
          <p className="text-sm leading-relaxed max-w-xs">
            This is the best hospital to visit for your medical needs. 
            We ensure proper care, trust, and professional healthcare solutions.
          </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-lg font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 cursor-pointer transition">Home</li>
            <li className="hover:text-blue-600 cursor-pointer transition">About Us</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Contact</li>
            <li className="hover:text-blue-600 cursor-pointer transition">Privacy Policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className="text-lg font-semibold mb-3">Get In Touch</p>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-600 transition cursor-pointer">
              +342323454676543
            </li>
            <li className="hover:text-blue-600 transition cursor-pointer">
              demo@gmail.com
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t pt-4 text-center text-sm text-gray-600">
        © 2025 by <span className="font-semibold text-gray-800">Anas Ismail</span>. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer

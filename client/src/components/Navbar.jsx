import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets_frontend/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { token, setToken, userData, loadProfileData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) loadProfileData();
  }, [token]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`;

  return (
    <nav className={`w-full sticky top-0 z-30 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm shadow-sm"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img src={assets.logo} alt="Logo" className="h-9 w-auto" />
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLink}>Home</NavLink>
          <NavLink to="/doctors" className={navLink}>All Doctors</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {token && userData ? (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 transition-all">
                <img src={userData.image} alt="User" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{userData.name}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{userData.name}</p>
                </div>
                <button onClick={() => navigate("/my-profile")} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  My Profile
                </button>
                <button onClick={() => navigate("/my-appointments")} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  My Appointments
                </button>
                <button onClick={() => navigate("/my-prescriptions")} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  My Prescriptions
                </button>
                <button onClick={() => navigate("/medical-history")} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Medical History
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-200"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen
            ? <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">Home</NavLink>
          <NavLink to="/doctors" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">All Doctors</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">About</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">Contact</NavLink>
          {token ? (
            <>
              <NavLink to="/my-profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">My Profile</NavLink>
              <NavLink to="/my-appointments" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">My Appointments</NavLink>
              <NavLink to="/my-prescriptions" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">My Prescriptions</NavLink>
              <NavLink to="/medical-history" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 py-2 border-b border-gray-50">Medical History</NavLink>
              <button onClick={logout} className="text-sm font-medium text-red-500 py-2 text-left">Logout</button>
            </>
          ) : (
            <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl text-center">Get Started</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
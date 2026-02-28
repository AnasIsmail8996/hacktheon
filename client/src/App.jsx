import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointments from './pages/Appointments';
import MyPrescriptions from './pages/MyPrescriptions';
import MedicalHistory from './pages/MedicalHistory';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className='mx-4 sm:max-[10%]'>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-prescriptions' element={<MyPrescriptions />} />
        <Route path='/medical-history' element={<MedicalHistory />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;

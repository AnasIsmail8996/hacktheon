import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { doctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])
  const { speciality } = useParams()
  const navigate = useNavigate()

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist"
  ]

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="px-6 md:px-16 py-10">
 
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Browse Doctors by Speciality
      </h1>

      <div className="flex flex-col md:flex-row gap-8">

        {/* ---- Speciality Filter Sidebar ---- */}
        <div className="md:w-1/4 bg-blue-50 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-semibold mb-4 text-gray-800">Specialities</p>

          {/* Mobile Horizontal Scroll */}
          <div className="flex md:flex-col gap-3 overflow-x-auto whitespace-nowrap">
            {specialities.map((item, index) => (
              <p
                key={index}
                onClick={() => navigate(`/doctors/${item}`)}
                className={`cursor-pointer px-3 py-2 rounded-md text-sm md:text-base transition 
                ${speciality === item 
                  ? "bg-blue-600 text-white" 
                  : "bg-white hover:bg-blue-100 text-gray-700"}`}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* ---- Doctors Grid ---- */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterDoc.map((doc, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${doc._id}`)}
              className="cursor-pointer bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition hover:-translate-y-1 text-center"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 object-cover"
              />

              <div className="flex items-center justify-center mb-1 space-x-2">
                <p className="text-green-500 text-xs font-semibold">●</p>
                <p className="text-gray-600 text-sm">Available</p>
              </div>

              <p className="text-gray-900 font-semibold text-lg">{doc.name}</p>
              <p className="text-gray-600 text-sm">{doc.speciality}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Doctors

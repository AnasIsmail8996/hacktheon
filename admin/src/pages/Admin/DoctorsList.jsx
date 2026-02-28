import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { token, doctors, getAllDoctors , changeAvailability} = useContext(AdminContext)

  useEffect(() => {
    if (token) {
      getAllDoctors()
    }
  }, [token])

  useEffect(() => {
    console.log("Fetched doctors:", doctors)
  }, [doctors])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">All Doctors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-4 flex flex-col justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.speciality}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.available}
                      readOnly
                      className="accent-green-500 w-4 h-4"
                      onClick={()=> changeAvailability(item._id)}
                    />
                    <p className={`text-sm font-medium ${item.available ? "text-green-600" : "text-red-500"}`}>
                      {item.available ? "Available" : "Unavailable"}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {item.experience} yrs exp.
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No doctors found</p>
        )}
      </div>
    </div>
  )
}

export default DoctorsList

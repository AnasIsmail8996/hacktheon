  import React, { useContext, useState } from "react";
  import { assets } from "../assets/assets_frontend/assets.js";
  import { AppContext } from "../context/AppContext.jsx";
  import toast from "react-hot-toast";
  import axios from "axios";

  const MyProfile = () => {
    const { token, userData, setUserData, backendUrl, loadProfileData } =
      useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);

const updateUserProfileData = async () => {
  try {
    const formData = new FormData();

    formData.append("name", userData.name || "");
    formData.append("phone", userData.phone || "");
    formData.append("gender", userData.gender || "");
    formData.append("dob", userData.dob || "");
    const safeAddress = userData.address || { line1: "", line2: "" };
    formData.append("address", JSON.stringify(safeAddress));
    if (image) formData.append("image", image);

    const { data } = await axios.post(
      `${backendUrl}/api/user/update-profile`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.status) {
      console.log(data);
      
      toast.success(data.message || "Profile updated successfully!");
      await loadProfileData();
      setIsEdit(false);
      setImage(false);
    } else {
      toast.error(data.message || "Failed to update profile");
    }
  } catch (error) {
    console.error("Update Profile Error:", error);
    toast.error(error.response?.data?.message || error.message);
  }
};


    if (!userData) {
      return (
        <section className="flex justify-center items-center min-h-[80vh]">
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </section>
      );
    }

    return (
      <section className="px-6 md:px-16 py-10 bg-gray-50 min-h-[80vh]">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
            {/* Profile Image */}
            {isEdit ? (
              <label htmlFor="image" className="cursor-pointer relative">
                <img
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 hover:opacity-80 transition"
                />
                <img
                  src={assets.upload_icon}
                  alt="Upload Icon"
                  className="w-10 absolute bottom-0 right-0 bg-white rounded-full shadow-md"
                />
                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            ) : (
              <img
                src={userData.image}
                alt={userData.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500"
              />
            )}

            {/* User Name + Email */}
            <div className="flex-1 text-center md:text-left space-y-2">
              {isEdit ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="text-2xl font-bold text-gray-800">
                  {userData.name}
                </p>
              )}
              <p className="text-gray-500">{userData.email}</p>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 📞 Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <p className="text-gray-500 text-sm">Email ID</p>
                <p className="text-gray-800 font-medium">{userData.email}</p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{userData.phone}</p>
                )}
              </div>

              {/* Address 1 */}
              <div>
                <p className="text-gray-500 text-sm">Address Line 1</p>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.address?.line1 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {userData.address?.line1}
                  </p>
                )}
              </div>

              {/* Address 2 */}
              <div>
                <p className="text-gray-500 text-sm">Address Line 2</p>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.address?.line2 || ""}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {userData.address?.line2}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 🧾 Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-600">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gender */}
              <div>
                <p className="text-gray-500 text-sm">Gender</p>
                {isEdit ? (
                  <select
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-800 font-medium">{userData.gender}</p>
                )}
              </div>

              {/* DOB */}
              <div>
                <p className="text-gray-500 text-sm">Date of Birth</p>
                {isEdit ? (
                  <input
                    type="date"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{userData.dob}</p>
                )}
              </div>
            </div>
          </div>

      
          <div className="text-center mt-6">
            {isEdit ? (
              <div className="flex justify-center gap-4">
                <button
                  onClick={updateUserProfileData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
                >
                  Save Information
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    loadProfileData();
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-2 rounded-lg font-semibold transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </section>
    );
  };

  export default MyProfile;

import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets.js";
import { AdminContext } from "../../context/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const { token, backendUrl } = useContext(AdminContext);

  // Form states
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState(1);
  const [fees, setFees] = useState(0);
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");

  // Handle form submit
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!docImg) return toast.error("Please upload doctor image");
      if (!name || !email || !password || !fees || !degree || !address1)
        return toast.error("Please fill all required fields");

      // FormData for file upload
      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", fees);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", address1 + ", " + address2);
      formData.append("about", about);

      // POST request to backend
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctors`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status) {
        toast.success(data.message || "Doctor added successfully!");
        // Reset form
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperience(1);
        setFees(0);
        setSpeciality("General Physician");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      } else {
        toast.error(data.message || "Failed to add doctor");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="p-6">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Add Doctor</h2>

        {/* Upload Image */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="doc-img"
            className="cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-all"
          >
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="upload"
              className="w-20 h-20 mb-2"
            />
            <p className="text-gray-500 text-center">
              Upload Doctor <br /> Picture
            </p>
            <input
              type="file"
              id="doc-img"
              hidden
              onChange={(e) => setDocImg(e.target.files[0])}
            />
          </label>
        </div>

        {/* Doctor Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Doctor Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Doctor Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Doctor Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Experience (years)</label>
            <select
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={1}>1 year</option>
              <option value={2}>2 years</option>
              <option value={3}>3 years</option>
              <option value={4}>4 years</option>
              <option value={5}>5 years</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Fees</label>
            <input
              type="number"
              value={fees}
              onChange={(e) => setFees(Number(e.target.value))}
              placeholder="Enter fees"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Speciality</label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Education / Degree</label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Enter degree"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="Address line 1"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-2"
            />
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Address line 2"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* About */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">About Doctor</label>
          <textarea
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write about doctor"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 cursor-pointer rounded-lg transition-all"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;

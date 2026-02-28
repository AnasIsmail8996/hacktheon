import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import Doctor from "../models/doctorsModel.js";
import AppointmentModel from "../models/appointmentModel.js";
import User from "../models/usersModel.js";
import jwt from 'jsonwebtoken';

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // 🧩 1. Required fields check
    if (!name || !email || !password || !speciality || !degree || !experience || !fees || !address) {
      return res.json({
        status: false,
        message: "Required fields are missing",
      });
    }

    // 🧩 2. Validate email
    if (!validator.isEmail(email)) {
      return res.json({
        status: false,
        message: "Invalid email format",
      });
    }

    // 🧩 3. Password length validation
    if (password.length < 8) {
      return res.json({
        status: false,
        message: "Password must be at least 8 characters",
      });
    }

    // 🧩 4. Check duplicate doctor (email)
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.json({
        status: false,
        message: "Doctor with this email already exists",
      });
    }

    // 🧩 5. Hash password
    const hashPass = await bcrypt.hash(password, 10);

    // 🧩 6. Upload image to Cloudinary
    let imageUrl = "";
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    // 🧩 7. Create doctor data
    const doctorData = {
      name,
      email,
      password: hashPass,
      image: imageUrl,
      speciality,
      degree,
      experience: Number(experience),
      about,
      available: available ?? true,
      fees: Number(fees),
      address: address,
      date: Date.now(),
    };

    // 🧩 8. Save to DB
    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    // 🧩 9. Send response
    return res.json({
      status: true,
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      const token = jwt.sign(
        { email },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.json({
        status: true,
        message: "Admin verified ✅",
        token,
      });
    } else {
      return res.status(401).json({
        status: false,
        message: "Not an admin ❌",
      });
    }

  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).select("-password");
    res.status(200).json({
      status: true,
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

// ─── All Appointments (Admin) ───────────────────────────────────────────────
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find().sort({ date: -1 });
    return res.status(200).json({ status: true, data: appointments });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

// ─── Cancel Appointment (Admin) ─────────────────────────────────────────────
const cancelAppointmentAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) return res.status(400).json({ status: false, message: "appointmentId is required" });

    const apt = await AppointmentModel.findById(appointmentId);
    if (!apt) return res.status(404).json({ status: false, message: "Appointment not found" });

    await AppointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // Free up the slot
    const doctor = await Doctor.findById(apt.docId);
    if (doctor) {
      let slots = doctor.slots_booked || {};
      if (slots[apt.slotDate]) {
        slots[apt.slotDate] = slots[apt.slotDate].filter((s) => s !== apt.slotTime);
        await Doctor.findByIdAndUpdate(apt.docId, { slots_booked: slots });
      }
    }

    return res.status(200).json({ status: true, message: "Appointment cancelled by admin" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

// ─── Delete Doctor (Admin) ─────────────────────────────────────────────────
const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId) return res.status(400).json({ status: false, message: "doctorId is required" });
    await Doctor.findByIdAndDelete(doctorId);
    return res.status(200).json({ status: true, message: "Doctor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

// ─── Update User Subscription (Admin) ─────────────────────────────────────
const updateSubscription = async (req, res) => {
  try {
    const { userId, plan } = req.body;
    if (!userId || !plan) return res.status(400).json({ status: false, message: "userId and plan are required" });
    if (!["free", "pro"].includes(plan)) return res.status(400).json({ status: false, message: "Plan must be 'free' or 'pro'" });
    const user = await User.findByIdAndUpdate(userId, { subscriptionPlan: plan }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ status: false, message: "User not found" });
    return res.status(200).json({ status: true, message: `Subscription updated to ${plan}`, data: user });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

// ─── Add Receptionist (Admin) ──────────────────────────────────────────────
const addReceptionist = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ status: false, message: "All fields required" });
    if (!validator.isEmail(email)) return res.status(400).json({ status: false, message: "Invalid email" });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ status: false, message: "Email already registered" });
    const hashPass = await bcrypt.hash(password, 10);
    const rec = await User.create({ name, email, password: hashPass, role: "receptionist" });
    return res.status(201).json({ status: true, message: "Receptionist added", data: { id: rec._id, name: rec.name, email: rec.email } });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
};

export { addDoctor, adminLogin, getAllDoctors, getAllAppointments, cancelAppointmentAdmin, deleteDoctor, updateSubscription, addReceptionist };

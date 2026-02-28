import validator from "validator";
import bcrypt from "bcrypt";
import User from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary"
import Doctor from "../models/doctorsModel.js";
import AppointmentModel from "../models/appointmentModel.js";



const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }


    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }


    if (password.length < 8) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User already registered with this email",
      });
    }


    const hashPass = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      password: hashPass,
    });


    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d", 
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};




const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not registered with this email",
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Incorrect password",
      });
    }

    // ✅ Generate token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // ✅ Send response
    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in userLogin:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const getProfile = async (req, res) => {
  try {
  const { userId } = req.user;
console.log(userId);

    const userData = await User.findById(userId).select('-password');

    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "User profile fetched successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user; 
    const { name, email, gender, dob, phone, address } = req.body;
    const imageFile = req.file;

    // Check for required fields
    if (!name || !email || !gender || !dob || !phone || !address) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

   
    let parsedAddress;
    try {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
      parsedAddress.line1 = parsedAddress.line1 || "";
      parsedAddress.line2 = parsedAddress.line2 || "";
    } catch (err) {
      return res.status(400).json({
        status: false,
        message: "Address must be a valid JSON object",
      });
    }

    // Update user data
    const userData = await User.findByIdAndUpdate(
      userId,
      { name, email, gender, dob, phone, address: parsedAddress },
      { new: true }
    );

    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Handle image upload if provided
    if (imageFile) {
      const uploadImage = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      userData.image = uploadImage.secure_url;
      await userData.save();
    }

    return res.status(200).json({
      status: true,
      message: "User profile updated successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const bookAppointment = async (req, res) => {
  try {
const { userId } = req.user;

    const { docId, slotDate, slotTime } = req.body;

    if (!userId || !docId || !slotDate || !slotTime) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields (userId, docId, slotDate, slotTime)",
      });
    }

    const docData = await Doctor.findById(docId).select("-password");
    if (!docData) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
      });
    }

    if (!docData.available) {
      return res.status(400).json({
        status: false,
        message: "Doctor is not available for appointments",
      });
    }

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.status(400).json({
          status: false,
          message: "This time slot is already booked",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await User.findById(userId).select("-password");
    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const { slots_booked: _, ...doctorInfo } = docData._doc;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: doctorInfo,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new AppointmentModel(appointmentData);
    await newAppointment.save();

    await Doctor.findByIdAndUpdate(docId, { slots_booked });

    res.status(200).json({
      status: true,
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const listAppointment = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: "userId is required",
      });
    }

    let appointments = await AppointmentModel.find({ userId });

    // 🔥 Address Fix Apply Here
    appointments = appointments.map(a => {
      if (a.docData?.address && typeof a.docData.address === "string") {
        try {
          a.docData.address = JSON.parse(
            a.docData.address
              .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
              .replace(/'/g, '"')
          );
          console.log("Address parse error:", err);
        } catch (err) {
            console.log("Address parse error:", err);
        }
      }
      return a;
    });

    return res.status(200).json({
      status: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const cancelAppointments = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    if (!userId || !appointmentId) {
      return res.status(400).json({
        status: false,
        message: "userId and appointmentId are required",
      });
    }

    const appointmentData = await AppointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        status: false,
        message: "Appointment not found",
      });
    }

    // Check if the user owns this appointment
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to cancel this appointment",
      });
    }

    // Mark the appointment as cancelled
    await AppointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await Doctor.findById(docId);

    if (doctorData) {
      // Ensure slots_booked exists
      let slots_booked = doctorData.slots_booked || {};

      // Remove the cancelled slot
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await Doctor.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    // Return success response
    return res.status(200).json({
      status: true,
      message: "Appointment cancelled successfully",
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export { registerUser,  userLogin, getProfile, updateProfile , bookAppointment, listAppointment , cancelAppointments};

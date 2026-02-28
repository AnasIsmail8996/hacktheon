import Doctor from "../models/doctorsModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    // 🔹 Check if docId provided
    if (!docId) {
      return res.status(400).json({
        status: false,
        message: "Doctor ID is required",
      });
    }

    // 🔹 Find doctor by ID
    const docData = await Doctor.findById(docId);
    if (!docData) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
      });
    }

    // 🔹 Toggle availability
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      docId,
      { available: !docData.available },
      { new: true } 
    );

   
    return res.status(200).json({
      status: true,
      message: "Doctor availability updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error while changing availability",
      error: error.message,
    });
  }
};



const doctorsList = async (req, res) => {
  try {
    const list = await Doctor.find({}).select(["-password", "-email"]);

    if (!list || list.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No doctors found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Doctors fetched successfully",
      doctors: list,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export {changeAvailability , doctorsList};

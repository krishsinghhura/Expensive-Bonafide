// controllers/studentController.js
const data = require("../model/Data");
const Student = require("../model/Student");

const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log(studentId);
    
    if (!studentId) {
      return res.status(404).json({ error: "Student id not found from the middleware" });
    }

    const {email} = await Student.findById(studentId);
    console.log(email);
    
    if (!email) {
      return res.status(404).json({ error: "Email for the student not found" });
    }

    const studentRecords = await data.find({ email: email }).populate("university");
    if (studentRecords.length == 0) {
      return res.status(404).json({ error: "Email for the student not found" });
    }

    res.status(200).json(studentRecords);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStudentProfile };

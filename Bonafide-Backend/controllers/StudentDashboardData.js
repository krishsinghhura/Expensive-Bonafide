// controllers/studentController.js
const Student = require("../model/Student");

const getStudentProfile = async (req, res) => {
  try {
    const { id } = req.student; 
    console.log(id);
    
    const student = await Student.findOne({ _id:id });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStudentProfile };

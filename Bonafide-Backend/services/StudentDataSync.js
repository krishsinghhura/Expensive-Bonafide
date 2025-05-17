const Data=require("../model/data");
const Student=require("../model/Student");

// Function to populate student fields using email
const populateStudentDetails = async (email) => {
  try {
    // Find data from Data model using email
    const data = await Data.findOne({ email });

    if (!data) {
      console.log("No matching data found for this email.");
      return null;
    }

    // Update the corresponding Student record
    const updatedStudent = await Student.findOneAndUpdate(
      { email },
      {
        aadhar_number: data.aadhar_number,
        registration_number: data.registration_number,
        department: data.department,
        cgpa: data.cgpa,
        blockchainTxnHash: data.blockchainTxnHash || null,
      },
      { new: true }
    );

    if (!updatedStudent) {
      console.log("Student not found in Student model.");
      return null;
    }

    console.log("Student data updated successfully.");
    return updatedStudent;
  } catch (error) {
    console.error("Error populating student details:", error);
    throw error;
  }
};


module.exports = populateStudentDetails;
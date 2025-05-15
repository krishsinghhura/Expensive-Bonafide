const mongoose = require("mongoose");
const Data = require("../model/data");

const getDataForUser = async (req, res) => {
  try {
    const univId = req.user.id;

    const data = await Data.find({ university: new mongoose.Types.ObjectId(univId) });


    res.json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDataForUser };

// app.js
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const blockRoutes=require("./routes/emaiRoutes")
const universityRoutes = require('./routes/universityRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', uploadRoutes); // API prefix

app.use("/block",blockRoutes)

app.use('/api/university', universityRoutes);
app.use('/api/student' , studentRoutes);

module.exports = app;

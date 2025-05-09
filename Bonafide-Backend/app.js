// app.js
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const blockRoutes=require("./routes/emaiRoutes")
const universityRoutes = require('./routes/universityRoutes');
const studentRoutes = require('./routes/studentRoutes');
const verifyRoutes = require('./routes/verifyRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', uploadRoutes); // API prefix

app.use("/block",blockRoutes)
app.use('/verify' , verifyRoutes);


app.use('/api/university', universityRoutes);
app.use('/api/student' , studentRoutes);
app.use('/verify' , verifyRoutes);


module.exports = app;

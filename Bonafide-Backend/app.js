// app.js
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const blockRoutes=require("./routes/emaiRoutes")
const universityRoutes = require('./routes/universityRoutes');
const studentRoutes = require('./routes/studentRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const GetData = require('./routes/dataRoutes')
const cookieParser = require('cookie-parser');
const claimRoute=require("./routes/claimRoutes")

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',  // Frontend origin
  credentials: true,               // Allow cookies to be sent
}));

app.use(express.json());

app.use('/api', uploadRoutes); // API prefix

app.use("/block",blockRoutes)
app.use('/verify' , verifyRoutes);
app.use('/get-data' , GetData);


app.use('/api/university', universityRoutes);
app.use('/api/student' , studentRoutes);
app.use('/verify' , verifyRoutes);

app.use("/api",claimRoute);


module.exports = app;

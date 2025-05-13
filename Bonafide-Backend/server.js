// server.js
const app = require('./app');
const cron = require('node-cron');
const pushDataToMongo=require("./services/dataSyncService");
const connectToMongoDB=require("./config/mongo");
const cookieParser = require('cookie-parser');
const cors = require('cors');
app.use(cookieParser());


require('dotenv').config();
connectToMongoDB();

app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true,              // Allow cookies
}));

cron.schedule('* * * * *', async () => {
  console.log('🕒 Running scheduled job to push Redis data to Supabase...');
  await pushDataToMongo();
  console.log('📦 Pushing this data:', formatted);
});//subah 8 bheje, the 2 bheje the sham 8 bheje

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

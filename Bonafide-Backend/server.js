// server.js
const app = require('./app');
const cron = require('node-cron');
const pushDataToMongo=require("./services/dataSyncService");
const connectToMongoDB=require("./config/mongo");

require('dotenv').config();
connectToMongoDB();

cron.schedule('8 14 20 * * * *', async () => {
  console.log('🕒 Running scheduled job to push Redis data to Supabase...');
  await pushDataToMongo();
  console.log('📦 Pushing this data:', formatted);
});//subah 8 bheje, the 2 bheje the sham 8 bheje

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
  
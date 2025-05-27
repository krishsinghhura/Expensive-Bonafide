// server.js
const app = require('./app');
const cron = require('node-cron');
const pushDataToMongo=require("./services/dataSyncService");
const connectToMongoDB=require("./config/mongo");

require('dotenv').config();
connectToMongoDB();

const times = ['0 8 * * *', '0 14 * * *', '0 20 * * *'];

times.forEach(time => {
  cron.schedule(time, async () => {
    await pushDataToMongo();
    console.log('📦 Data pushed at', new Date().toLocaleTimeString());
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
  
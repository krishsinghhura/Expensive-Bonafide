// utils/otpStore.js
const otpMap = new Map(); // In production, use Redis or a DB

module.exports = {
  setOTP: (email, otp) => {
    otpMap.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
  },
  getOTP: (email) => otpMap.get(email),
  deleteOTP: (email) => otpMap.delete(email),
};

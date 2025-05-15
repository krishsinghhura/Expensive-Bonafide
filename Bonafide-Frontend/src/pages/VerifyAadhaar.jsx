import React, { useState } from "react";
import axios from "axios";
// import QRCode from "qrcode.react"; // Uncomment if QR code is needed

export default function StudentVerifier() {
  const [email, setEmail] = useState("");       // 👉 Controls email input
  const [result, setResult] = useState(null);   // 👉 Stores verified credentials from backend
  const [error, setError] = useState("");        // 👉 Handles error state

  // ✅ FORM SUBMISSION HANDLER
  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");

    try {
      // 🧠 API CALL TO VERIFY STUDENT CREDENTIALS BASED ON EMAIL
      const response = await axios.post("http://localhost:4000/verify/verify", {
        email, // 🔁 This email will be sent to backend to fetch student credential
      });

      // ✅ IF VERIFIED SUCCESSFULLY, SAVE THE RESULT TO STATE
      if (response.status === 200) {
        setResult(response.data); // 💾 Stores credential object like email, credentialId, etc.
      }
    } catch (err) {
      console.error("Verification error:", err);
      // ❌ Handle any errors (like student not found, server issues)
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-500 px-4 py-12">
      
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
        
        <h2 className="text-3xl font-bold text-center mb-8 text-purple-700">
          Blockchain Credential Verifier
        </h2>

        {/* 🧾 INPUT FORM */}
        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Enter student email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white py-3 px-6 rounded-md font-semibold transition duration-200"
          >
            Verify
          </button>
        </form>

        {/* ✅ SUCCESS BLOCK - RENDER VERIFIED STUDENT DATA */}
        {result && (
          <div className="mt-10 p-6 bg-gray-100 rounded-xl shadow-inner text-gray-800 space-y-4">
            <h4 className="text-xl font-bold text-green-700">✅ Verification Successful</h4>

            {/* 📌 DISPLAY VERIFIED DATA COMING FROM BACKEND */}
            <div>
              <p><span className="font-semibold">Email:</span> {result.email}</p>
              <p><span className="font-semibold">Credential ID:</span> {result.credentialId}</p>
              <p><span className="font-semibold">Issuer:</span> {result.issuer}</p>
              <p><span className="font-semibold">Issuer Public Key:</span> <span className="break-words">{result.issuerPublicKey}</span></p>
              <p><span className="font-semibold">Issue Date:</span> {new Date(result.issueDate).toLocaleDateString()}</p>
              <p>
                <span className="font-semibold">Transaction Hash:</span>{" "}
                <a
                  // href={https://subnets-test.avax.network/c-chain/tx/${result.transactionHash}},
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline break-all"
                >
                  {result.transactionHash}
                </a>
              </p>
            </div>

            {/* OPTIONAL - GENERATE A QR CODE TO THE TRANSACTION */}
            {/* <div className="mt-4">
              <QRCode value={https://subnets-test.avax.network/c-chain/tx/${result.transactionHash}} size={128} />
            </div> */}
          </div>
        )}

        {/* ❌ ERROR DISPLAY BLOCK */}
        {error && (
          <div className="mt-10 p-5 bg-red-100 border-l-4 border-red-500 rounded-md text-red-800">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}
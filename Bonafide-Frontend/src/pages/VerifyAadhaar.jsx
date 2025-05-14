import React, { useState } from "react";
import axios from "axios";

export default function StudentVerifier() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/verify/verify", { email });

      if (response.status === 200) {
        setResult(response.data);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-500 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-700">Verify Student Credential</h2>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
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
            Verify Credential
          </button>
        </form>

        {result && (
          <div className="mt-8 p-5 bg-green-100 border-l-4 border-green-500 rounded-md text-green-900">
            <h4 className="font-bold mb-2 text-green-700">Verification Successful ✅</h4>
            <p><span className="font-semibold">Email:</span> {result.email}</p>
            <p className="mt-1">
              <span className="font-semibold">Transaction Hash:</span>{" "}
              <a
                href={`https://subnets-test.avax.network/c-chain/tx/${result.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline break-all"
              >
                {result.transactionHash}
              </a>
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-5 bg-red-100 border-l-4 border-red-500 rounded-md text-red-800">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}

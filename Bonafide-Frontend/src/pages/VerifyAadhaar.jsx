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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Verify Student Blockchain Record</h2>
      
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter student email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 font-semibold"
        >
          Verify
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md text-green-800">
          <h4 className="font-bold mb-2">Verification Successful</h4>
          <p><span className="font-semibold">Email:</span> {result.email}</p>
          <p>
            <span className="font-semibold">Transaction Hash:</span> 
            <a
              href={`https://subnets-test.avax.network/c-chain/tx/${result.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              {result.transactionHash}
            </a>
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-md text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

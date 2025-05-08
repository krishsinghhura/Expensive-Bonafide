import React, { useState } from 'react';
import axios from 'axios';
import { checkMerkleRoot } from '../utils/checkMerkleRoot';  // Import the checkMerkleRoot function

const VerifyAadhaar = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    if (!aadhaar) {
      setError('Please enter your Aadhaar number.');
      setIsLoading(false);
      return;
    }

    try {
      
      const response = await axios.post('http://localhost:4000/block/verify', { aadhaar });
      console.log(response);
      
      const { student, merkleRoot } = response.data;

      console.log(response.data.merkleRoot);
      

      if (!student) {
        setError('Student not found or verification failed.');
        setIsLoading(false);
        return;
      }

      
      const isMerkleRootValid = await checkMerkleRoot(merkleRoot);

      
      if (isMerkleRootValid) {
        setResult({
          status: 'Verified',
          student: student,
          storedMerkleRoot: merkleRoot,
          blockchainValidity: 'Valid Merkle Root',
        });
      } else {
        setResult({
          status: 'Not Verified',
          student: student,
          storedMerkleRoot: merkleRoot,
          blockchainValidity: 'Invalid Merkle Root',
        });
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || err.response.data.error);
      } else {
        setError('Server error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Verify Aadhaar</h2>
      
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter Aadhaar number"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600 text-center">{error}</p>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Status: <span className={result.status === 'Verified' ? 'text-green-600' : 'text-red-600'}>{result.status}</span>
          </h3>
          {result.student && (
            <pre className="bg-white p-3 rounded text-sm overflow-auto">
              {JSON.stringify(result.student, null, 2)}
            </pre>
          )}
          <p className="mt-2">
            <strong>Stored Merkle Root:</strong> {result.storedMerkleRoot}
          </p>
          <p className="mt-2">
            <strong>Blockchain Merkle Root Validity:</strong> {result.blockchainValidity}
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyAadhaar;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadMerkleRoot } from "../utils/uploadMerkleRoot";

const ConfirmBlockchainPost = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/fetch");
      const result = await response.json();

      if (response.ok && result.data) {
        setData(result.data);
      } else {
        alert("Failed to fetch data from Redis.");
      }
    } catch (error) {
      console.error("Error fetching Redis data:", error);
      alert("Error while fetching Redis data.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsCounting(true);
    setCounter(0);

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setCounter(count);

      if (count >= data.length) {
        clearInterval(interval);
        setIsCounting(false);
      }
    }, 11000); 

    try {
      const response = await fetch("http://localhost:4000/block/upload-email", {
        method: "GET",
      });

      const result = await response.json();

      if (response.ok) {
        const merkleRoot = result.merkleRoot;

        if (!merkleRoot) {
          alert("❌ No Merkle root returned from backend.");
          clearInterval(interval);
          setIsCounting(false);
          return;
        }

        const blockchainSuccess = await uploadMerkleRoot(merkleRoot);
        console.log(merkleRoot);

        if (blockchainSuccess) {
          alert("✅ Data confirmed and Merkle root stored on blockchain!");
          navigate("/validate");
        } else {
          alert("❌ Merkle root failed to upload to blockchain.");
        }
      } else {
        alert(`❌ Failed to post: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error posting to blockchain.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        🧾 Confirm Data for Blockchain Posting
      </h2>

      {loading ? (
        <p>Loading data from Redis...</p>
      ) : data.length === 0 ? (
        <p className="text-red-500">No data found in Redis.</p>
      ) : (
        <>
          <div className="overflow-auto max-h-[400px] border rounded-md bg-white shadow-md">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  {Object.keys(data[0] || {}).map((key) => (
                    <th key={key} className="border p-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} className="border p-2">
                        {Array.isArray(value) ? value.join(", ") : value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-4 items-center">
            <button
              onClick={handleConfirm}
              disabled={isCounting}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 disabled:opacity-60"
            >
              ✅ Confirm and Post to Blockchain
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-600"
            >
              ❌ Cancel
            </button>
          </div>

          {isCounting && (
            <div className="w-full mt-6">
              <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-blue-600 transition-all duration-700 ease-in-out"
                  style={{ width: `${(counter / data.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-700 mt-2 text-center">
                Processing {counter} of {data.length} records...
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConfirmBlockchainPost;

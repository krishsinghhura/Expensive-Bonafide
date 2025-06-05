import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import Cancel from "../components/CancelDialogBox";

const ConfirmBlockchainPost = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [Token, setToken] = useState("");
  const navigate = useNavigate();

  // Define the columns we want to display
  const displayColumns = [
    'NAME',
    'EMAIL',
    'AADHAR NUMBER',
    'REGISTRATION NUMBER',
    'DEPARTMENT',
    'CGPA'
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);

    if (!token) {
      navigate("/auth");
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("before hitting", token);

      const response = await fetch("https://expensive-bonafide-production.up.railway.app/api/fetch", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.data) {
        setData(result.data);
      } else {
        console.log("Failed to fetch data from Redis.");
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
      const response = await fetch("https://expensive-bonafide-production.up.railway.app/block/upload-email", {
        method: "GET",
      });

      const result = await response.json();

      if (response.ok) {
        const done = result.data;

        if (!done) {
          alert("❌no data in backend.");
          clearInterval(interval);
          setIsCounting(false);
          return;
        }
      } else {
        alert(`❌ Failed to post: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-blue-100 text-black">
      <Header />

      <main className="flex-grow p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          🧾 Confirm Data for Blockchain Posting
        </h2>

        {loading ? (
          <p className="text-blue-700 animate-pulse">
            Loading data from Redis...
          </p>
        ) : data.length === 0 ? (
          <p className="text-red-500">No data found in Redis.</p>
        ) : (
          <>
            <div className="overflow-auto max-h-[400px] border border-blue-200 rounded-lg bg-white shadow-md transition duration-300">
              <table className="min-w-full border-collapse text-sm">
                <thead className="bg-blue-100 sticky top-0 text-blue-700 font-medium">
                  <tr>
                    {displayColumns.map((column) => (
                      <th key={column} className="border px-4 py-2">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition">
                      {displayColumns.map((column) => (
                        <td key={column} className="border px-4 py-2">
                          {Array.isArray(row[column]) 
                            ? row[column].join(", ") 
                            : row[column] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className="mt-6 flex gap-4 items-center">
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isCounting}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 disabled:opacity-60"
                >
                  ✅ Confirm and Post to Blockchain
                </button>

                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-600 transition duration-300"
                >
                  ❌ Cancel
                </button>
              </div>

              <Cancel
                showCancelDialog={showCancelDialog}
                setShowCancelDialog={setShowCancelDialog}
              />

              {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <h3 className="text-xl font-bold text-blue-700 mb-4">
                      Confirm Transaction
                    </h3>
                    <p className="mb-6">
                      Are you sure you want to deduct money from your wallet and
                      post the data to blockchain?
                    </p>
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setShowConfirmDialog(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowConfirmDialog(false);
                          handleConfirm();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmBlockchainPost;
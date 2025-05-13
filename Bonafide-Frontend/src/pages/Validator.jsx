import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import { FaFileUpload, FaCheckCircle, FaTimesCircle, FaSave, FaDatabase } from "react-icons/fa";
import Header from "../components/Header";

const departments = ["BCA", "BSC", "MSC", "MCA", "EEE", "CSE"];

const Validator = () => {
  const [rows, setRows] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedData, setSavedData] = useState(null);

  const navigate = useNavigate();

  const validateRow = (row) => {
    const errors = [];

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.EMAIL)) errors.push("Invalid Email");
    if (!/^\d{12}$/.test(String(row["AADHAR NUMBER"]))) errors.push("AADHAR must be 12 digits");
    if (!/^\d{12}$/.test(String(row["REGISTRATION NUMBER"]))) errors.push("Reg No. must be 12 digits");
    if (!departments.includes(row.DEPARTMENT)) errors.push("Invalid Department");
    const cgpa = parseFloat(row.CGPA);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) errors.push("CGPA must be between 0 and 10");

    return errors;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);

      setRows(json);
      setLoading(true);
      setValidRows([]);
      setInvalidRows([]);

      const tempValid = [];
      const tempInvalid = [];
      let count = 0;

      const interval = setInterval(() => {
        if (count < json.length) {
          const row = json[count];
          const errors = validateRow(row);

          if (errors.length === 0) {
            tempValid.push(row);
          } else {
            tempInvalid.push({ ...row, errors });
          }

          count++;
          setProgress(Math.floor((count / json.length) * 100));
        } else {
          clearInterval(interval);
          setValidRows(tempValid);
          setInvalidRows(tempInvalid);
          setLoading(false);
        }
      }, 2000 / json.length);
    };

    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    const allData = [...validRows, ...invalidRows];
    try {
      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: allData }),
      });

      const result = await response.json();
      if (response.ok) alert("✅ Data successfully cached to Redis!");
      else alert(`❌ Failed to save data: ${result.error}`);
    } catch (error) {
      console.error("Error saving to backend:", error);
      alert("❌ Something went wrong while saving data.");
    }
  };

  const handleFetchFromRedis = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/fetch");
      const result = await response.json();
      if (response.ok && result.data?.length > 0) setSavedData(result.data);
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching from Redis.");
    }
  };

  const PostingToBlockchain = () => navigate("/confirmation");

  useEffect(() => {
    handleFetchFromRedis();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-800">
      {/* Navbar */}
      <Header/>      

      <main className="flex flex-col md:flex-row gap-10 mt-40 pt-24 px-6 sm:px-16">
        {/* Info Panel */}
        <div className="md:w-1/3 bg-white/40 backdrop-blur-sm shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">What are we doing?</h2>
          <p className="text-gray-700 leading-relaxed">
            We are verifying student data uploaded through an Excel file. Each row is validated
            against rules like email format, AADHAR length, CGPA range, and valid department.
            Valid and invalid data are separated and visually shown. You can also push this
            validated data to the blockchain for permanent storage.
          </p>
        </div>

        {/* Upload + Validation */}
        <div className="md:w-2/3 bg-white/40 backdrop-blur-sm shadow-md rounded-xl p-8">
          <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
             Data Validator
          </h2>

          <div className="mb-4">
            <label htmlFor="file-upload" className="cursor-pointer block border-2 border-dashed border-purple-400 p-6 rounded-lg text-center hover:bg-purple-100 transition">
              <FaFileUpload className="w-10 h-10 mx-auto text-purple-600" />
              <p className="mt-2 text-purple-700 font-semibold">Click or Drag to Upload Excel File</p>
            </label>
            <input id="file-upload" type="file" onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
          </div>

          <button
            onClick={PostingToBlockchain}
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded w-full mb-4"
          >
            <FaDatabase className="inline mr-2" /> Post to Blockchain
          </button>

          {loading && (
            <div>
              <div className="text-purple-700 font-semibold">Validating Rows...</div>
              <div className="w-full h-2 bg-purple-200 rounded">
                <div style={{ width: `${progress}%` }} className="h-full bg-purple-700 rounded transition-all" />
              </div>
              <p className="text-sm mt-1 text-gray-600">{Math.floor(rows.length * (progress / 100))} / {rows.length} processed</p>
            </div>
          )}

          {!loading && (validRows.length > 0 || invalidRows.length > 0) && (
            <>
              <details open className="mt-6">
                <summary className="text-lg font-bold text-green-700 cursor-pointer">
                  <FaCheckCircle className="inline mr-2" /> Valid Data ({validRows.length})
                </summary>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full bg-white rounded">
                    <thead>
                      <tr>
                        {Object.keys(validRows[0] || {}).map((key) => (
                          <th key={key} className="px-4 py-2 border">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {validRows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-100">
                          {Object.values(row).map((val, idx) => (
                            <td key={idx} className="px-4 py-2 border">{val}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              <details className="mt-6">
                <summary className="text-lg font-bold text-red-700 cursor-pointer">
                  <FaTimesCircle className="inline mr-2" /> Invalid Data ({invalidRows.length})
                </summary>
                <div className="overflow-x-auto mt-2">
                  <table className="min-w-full bg-white rounded">
                    <thead>
                      <tr>
                        {Object.keys(invalidRows[0] || {}).map((key) => (
                          <th key={key} className="px-4 py-2 border">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invalidRows.map((row, i) => (
                        <tr key={i} className="hover:bg-red-50">
                          {Object.entries(row).map(([key, val], idx) => (
                            <td key={idx} className="px-4 py-2 border">
                              {key === "errors" ? <span className="text-red-500">{val.join(", ")}</span> : val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              <button
                onClick={handleSave}
                className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded mt-6 w-full"
              >
                <FaSave className="inline mr-2" /> Save to Redis
              </button>
            </>
          )}
        </div>
         {/* Show card if Redis data exists */}
      </main>
      {savedData && (
        <div
          onClick={() => navigate("/edit-data")}
          className="cursor-pointer mb-6 p-4 rounded-lg shadow-lg mt-10 bg-white border-l-4 border-green-500 hover:bg-green-50 transition"
        >
          <h3 className="text-xl font-semibold text-green-600">📦 Cached Data Found</h3>
          <p className="text-gray-600 mt-1">Click here to edit the cached data from Redis</p>
          
        </div>
        
      )}
    </div>
  );
};

export default Validator;

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  FaFileUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaDatabase,
} from "react-icons/fa";
import Header from "../components/Header";
import { motion } from "framer-motion";

const departments = ["BCA", "BSC", "MSC", "MCA", "EEE", "CSE"];

const Validator = () => {
  const [rows, setRows] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedData, setSavedData] = useState(null);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const validateRow = (row) => {
    const errors = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.EMAIL))
      errors.push("Invalid Email");
    if (!/^\d{12}$/.test(String(row["AADHAR NUMBER"])))
      errors.push("AADHAR must be 12 digits");
    if (!/^\d{12}$/.test(String(row["REGISTRATION NUMBER"])))
      errors.push("Reg No. must be 12 digits");
    if (!departments.includes(row.DEPARTMENT))
      errors.push("Invalid Department");
    const cgpa = parseFloat(row.CGPA);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10)
      errors.push("CGPA must be between 0 and 10");
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
          if (errors.length === 0) tempValid.push(row);
          else tempInvalid.push({ ...row, errors });
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
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: allData }),
      });
      const result = await response.json();
      if (response.ok)
        setAlert({
          type: "success",
          message: "Data successfully cached to Redis!",
        });
      else
        setAlert({
          type: "error",
          message: `Failed to save data: ${result.error}`,
        });
    } catch (error) {
      console.error("Error saving to backend:", error);
      setAlert({
        type: "error",
        message: "Something went wrong while saving data.",
      });
    }
  };

  const handleFetchFromRedis = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/fetch", {
        method: "GET",
        credentials: "include", 
      });
      const result = await response.json();
      if (response.ok && result.data?.length > 0) setSavedData(result.data);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Error fetching from Redis." });
    }
  };

  const PostingToBlockchain = () => navigate("/confirmation");

  useEffect(() => {
    handleFetchFromRedis();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-500 via-purple-400 to-pink-500 text-gray-800 backdrop-blur-lg">
      <Header />

      {alert && (
        <motion.div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-md max-w-xs w-full z-50 ${
            alert.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p>{alert.message}</p>
        </motion.div>
      )}

      <main className="h-full min-h-[600px] sm:backdrop-blur flex flex-col items-center px-6 sm:px-16 mt-21">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT HALF: Guide + Do's & Don'ts */}
          <div className="bg-white rounded-2xl shadow-md p-8 h-full">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">
              How to Validate?
            </h2>
            <ul className="list-disc list-inside text-gray-800 space-y-2 mb-6">
              <li>Prepare an Excel file with all student data.</li>
              <li>
                Ensure headers like EMAIL, CGPA, DEPARTMENT, etc., are present.
              </li>
              <li>CGPA must be between 0 and 10.</li>
              <li>Email format must be valid.</li>
              <li>AADHAR and Reg. No. must have 12 digits.</li>
              <li>DEPARTMENT must be valid.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-purple-700 mt-6 mb-3">
              Do's ✅
            </h3>
            <ul className="list-disc list-inside text-green-700 space-y-1">
              <li>Check headers before uploading.</li>
              <li>Use .xlsx or .xls format only.</li>
              <li>Check CGPA and department fields.</li>
            </ul>

            <h3 className="text-2xl font-semibold text-red-700 mt-6 mb-3">
              Don'ts ❌
            </h3>
            <ul className="list-disc list-inside text-red-600 space-y-1">
              <li>Don't include extra spaces in headers.</li>
              <li>Don't use merged cells.</li>
              <li>Don't upload PDFs or CSVs.</li>
            </ul>
          </div>

          {/* RIGHT HALF: Description + Upload */}
          <div className="bg-white rounded-2xl shadow-md p-8 h-full flex flex-col justify-between space-y-6">
            {/* What are we doing? */}
            <div>
              <h2 className="text-3xl font-bold text-blue-700 mb-3">
                What are we doing?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We are verifying student data uploaded through an Excel file.
                Each row is validated against rules like email format, AADHAR
                length, CGPA range, and valid department. Valid and invalid data
                are separated visually. You can also push validated data to the
                blockchain.
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label
                htmlFor="file-upload"
                className="cursor-pointer block border-2 border-dashed border-blue-400 p-6 rounded-lg text-center hover:bg-blue-100 transition"
              >
                <FaFileUpload className="w-10 h-10 mx-auto text-blue-600" />
                <p className="mt-2 text-blue-700 font-semibold">
                  Click or Drag to Upload Excel File
                </p>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".xlsx, .xls"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                PostingToBlockchain();
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded w-full mb-21"
            >
              <FaDatabase className="inline mr-2" /> Post to Blockchain
            </button>
          </div>
        </div>

        {loading && (
          <div className="w-full max-w-4xl mb-10">
            <div className="text-blue-700 font-semibold">
              Validating Rows...
            </div>
            <div className="w-full h-2 bg-blue-200 rounded">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-blue-700 rounded transition-all"
              />
            </div>
            <p className="text-sm mt-1 text-gray-600">
              {Math.floor(rows.length * (progress / 100))} / {rows.length}{" "}
              processed
            </p>
          </div>
        )}

        {!loading && (validRows.length > 0 || invalidRows.length > 0) && (
          <motion.div className="w-full max-w-4xl bg-white/60 backdrop-blur-md shadow-md rounded-xl p-8 mb-10">
            <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">
              Validation Results
            </h2>
            <details open className="mt-6">
              <summary className="text-lg font-bold text-green-700 cursor-pointer">
                <FaCheckCircle className="inline mr-2" /> Valid Data (
                {validRows.length})
              </summary>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white rounded">
                  <thead>
                    <tr>
                      {Object.keys(validRows[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-2 border">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {validRows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-100">
                        {Object.values(row).map((val, idx) => (
                          <td key={idx} className="px-4 py-2 border">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            <details className="mt-6">
              <summary className="text-lg font-bold text-red-700 cursor-pointer">
                <FaTimesCircle className="inline mr-2" /> Invalid Data (
                {invalidRows.length})
              </summary>
              <div className="overflow-x-auto mt-2">
                <table className="min-w-full bg-white rounded">
                  <thead>
                    <tr>
                      {Object.keys(invalidRows[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-2 border">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invalidRows.map((row, i) => (
                      <tr key={i} className="hover:bg-red-50">
                        {Object.entries(row).map(([key, val], idx) => (
                          <td key={idx} className="px-4 py-2 border">
                            {key === "errors" ? (
                              <span className="text-red-500">
                                {val.join(", ")}
                              </span>
                            ) : (
                              val
                            )}
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
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded mt-6 w-full"
            >
              <FaSave className="inline mr-2" /> Save to Redis
            </button>
          </motion.div>
        )}

        {savedData && (
          <motion.div
            onClick={() => navigate("/edit-data")}
            className="cursor-pointer w-full max-w-md bg-white border border-green-400 rounded-lg p-4 shadow-lg mb-10 hover:bg-green-50 transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-lg font-bold text-green-600 mb-2">
              📦 Cached Data Found
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Click here to edit the cached data from Redis
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                PostingToBlockchain();
              }}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded w-full"
            >
              <FaDatabase className="inline mr-2" /> Post to Blockchain
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Validator;

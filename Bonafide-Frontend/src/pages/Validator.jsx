import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.EMAIL)) {
      errors.push("Invalid Email");
    }

    if (!/^\d{12}$/.test(String(row["AADHAR NUMBER"]))) {
      errors.push("AADHAR must be 12 digits");
    }

    if (!/^\d{12}$/.test(String(row["REGISTRATION NUMBER"]))) {
      errors.push("Reg No. must be 12 digits");
    }

    if (!departments.includes(row.DEPARTMENT)) {
      errors.push("Invalid Department");
    }

    const cgpa = parseFloat(row.CGPA);
    if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
      errors.push("CGPA must be between 0 and 10");
    }

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

  const handleInputChange = (type, index, field, value) => {
    const updated = type === "valid" ? [...validRows] : [...invalidRows];
    updated[index][field] = value;
    if (type === "valid") setValidRows(updated);
    else setInvalidRows(updated);
  };

  const handleSave = async () => {
    const allData = [...validRows, ...invalidRows];

    try {
      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: allData }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Data successfully cached to Redis!");
      } else {
        alert(`❌ Failed to save data: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving to backend:", error);
      alert("❌ Something went wrong while saving data.");
    }
  };

  const handleFetchFromRedis = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/fetch");
      const result = await response.json();

      if (response.ok && result.data?.length > 0) {
        setSavedData(result.data);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error fetching from Redis.");
    }
  };

  useEffect(() => {
    handleFetchFromRedis();
  }, []);

  const PostingToBlockchain=()=>{
    navigate("/confirmation");
  }

  return (
    <div className="p-8 bg-blue-50 min-h-screen">
      <h2 className="text-2xl text-blue-700 font-semibold mb-4">🎓 Excel Student Validator</h2>
      

      {/* Show card if Redis data exists */}
      {savedData && (
        <div
          onClick={() => navigate("/edit-data")}
          className="cursor-pointer mb-6 p-4 rounded-lg shadow-lg bg-white border-l-4 border-green-500 hover:bg-green-50 transition"
        >
          <h3 className="text-xl font-semibold text-green-600">📦 Cached Data Found</h3>
          <p className="text-gray-600 mt-1">Click here to edit the cached data from Redis</p>
          
        </div>
        
      )}

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4 p-2 border-2 border-blue-300 rounded"
      />
      <button
            onClick={PostingToBlockchain}
            className="mt-4 p-3 w-full bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Post to Blockchain
          </button>

      {loading && (
        <div className="mt-4">
          <div className="mb-2">Validating Rows...</div>
          <div className="h-2 bg-blue-200 rounded">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-blue-600 transition-all rounded"
            ></div>
          </div>
          <div className="mt-2">
            {Math.floor(rows.length * (progress / 100))} / {rows.length}
          </div>
        </div>
      )}

      {!loading && (validRows.length > 0 || invalidRows.length > 0) && (
        <div className="mt-8">
          <h3 className="text-green-700 font-semibold">Data Verified</h3>

          <details className="mt-4">
            <summary className="cursor-pointer text-lg text-blue-600">
              ✅ Valid Data ({validRows.length})
            </summary>
            <table className="w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr>
                  {Object.keys(validRows[0] || {}).map((key) => (
                    <th key={key} className="border p-2 bg-blue-100">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {validRows.map((row, index) => (
                  <tr key={index} className="cursor-pointer hover:bg-blue-200">
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} className="border p-2">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <details className="mt-4">
            <summary className="cursor-pointer text-lg text-red-600">
              ❌ Invalid Data ({invalidRows.length})
            </summary>
            <table className="w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr>
                  {Object.keys(invalidRows[0] || {}).map((key) => (
                    <th key={key} className="border p-2 bg-red-100">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invalidRows.map((row, index) => (
                  <tr key={index} className="cursor-pointer hover:bg-red-200">
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} className="border p-2">
                        {key === "errors" ? (
                          <span className="text-red-500">{value.join(", ")}</span>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <button
            onClick={handleSave}
            className="mt-4 p-3 w-full bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            💾 Save Data
          </button>

          <button
            onClick={() => navigate("/edit-data")}
            className="mt-4 p-3 w-full bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            ✏️ Edit Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Validator;

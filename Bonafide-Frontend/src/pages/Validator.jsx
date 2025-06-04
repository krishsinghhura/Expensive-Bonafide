import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  FaFileUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaDatabase,
  FaInfoCircle,
  FaExclamationTriangle,
  FaFileDownload,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const departments = ["BCA", "BSC", "MSC", "MCA", "EEE", "CSE"];

const Validator = () => {
  const [rows, setRows] = useState([]);
  const [validRows, setValidRows] = useState([]);
  const [invalidRows, setInvalidRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedData, setSavedData] = useState(null);
  const [alert, setAlert] = useState(null);
  const [dataSaved, setDataSaved] = useState(false);
  const [token, setToken] = useState("");
  
  // Pagination state
  const [validCurrentPage, setValidCurrentPage] = useState(1);
  const [invalidCurrentPage, setInvalidCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);

    if (!token) {
      navigate("/auth");
    }
  }, []);

  // Pagination logic
  const validPaginate = (pageNumber) => setValidCurrentPage(pageNumber);
  const invalidPaginate = (pageNumber) => setInvalidCurrentPage(pageNumber);

  // Get current rows for pagination
  const indexOfLastValidRow = validCurrentPage * rowsPerPage;
  const indexOfFirstValidRow = indexOfLastValidRow - rowsPerPage;
  const currentValidRows = validRows.slice(indexOfFirstValidRow, indexOfLastValidRow);
  const validTotalPages = Math.ceil(validRows.length / rowsPerPage);

  const indexOfLastInvalidRow = invalidCurrentPage * rowsPerPage;
  const indexOfFirstInvalidRow = indexOfLastInvalidRow - rowsPerPage;
  const currentInvalidRows = invalidRows.slice(indexOfFirstInvalidRow, indexOfLastInvalidRow);
  const invalidTotalPages = Math.ceil(invalidRows.length / rowsPerPage);

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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);

        if (json.length === 0) {
          setAlert({
            type: "error",
            message: "The uploaded file contains no data",
          });
          return;
        }

        setRows(json);
        setLoading(true);
        setValidRows([]);
        setInvalidRows([]);
        // Reset pagination when new data is loaded
        setValidCurrentPage(1);
        setInvalidCurrentPage(1);

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

            if (tempInvalid.length > 0) {
              setAlert({
                type: "warning",
                message: `${tempInvalid.length} records failed validation. Please review before saving.`,
              });
            }
          }
        }, 2000 / json.length);
      } catch (error) {
        console.error("Error processing file:", error);
        setAlert({
          type: "error",
          message: "Error processing Excel file. Please check the format.",
        });
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setAlert({
        type: "error",
        message: "Error reading file. Please try again.",
      });
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    if (validRows.length === 0) {
      setAlert({ type: "warning", message: "No valid data to save" });
      return;
    }

    setSaving(true);
    try {
      console.log("token is", token);

      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: validRows }),
      });

      const result = await response.json();
      if (response.ok) {
        setAlert({
          type: "success",
          message: `${validRows.length} records successfully cached to Redis!`,
        });
        setSavedData(validRows);
        setDataSaved(true);
      } else {
        setAlert({
          type: "error",
          message: result.error || "Failed to save data to server",
        });
      }
    } catch (error) {
      console.error("Error saving to backend:", error);
      setAlert({
        type: "error",
        message: "Network error while saving data. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFetchFromRedis = async () => {
    setFetching(true);
    const Token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:4000/api/fetch", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.data?.length > 0) {
        setSavedData(result.data);
      }
    } catch (err) {
      console.error("Redis fetch error:", err);
      setAlert({ type: "error", message: "Error fetching cached data" });
    } finally {
      setFetching(false);
    }
  };

  const PostingToBlockchain = () => {
    if (!savedData || savedData.length === 0) {
      setAlert({
        type: "warning",
        message: "No validated data available to post",
      });
      return;
    }
    navigate("/confirmation");
  };

  const handleDownloadTemplate = () => {
    const filePath = "/student_data.xlsx"; // Note the leading slash
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "student_data_template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    handleFetchFromRedis();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Pagination component
  const Pagination = ({ currentPage, totalPages, paginate, type }) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage, endPage;
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(currentPage * rowsPerPage, type === 'valid' ? validRows.length : invalidRows.length)}
          </span>{" "}
          of <span className="font-medium">{type === 'valid' ? validRows.length : invalidRows.length}</span> records
        </div>
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => paginate(1)}
                className={`px-3 py-1 rounded-md ${1 === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${number === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => paginate(totalPages)}
                className={`px-3 py-1 rounded-md ${totalPages === currentPage ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {alert && (
        <motion.div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg max-w-xs w-full z-50 flex items-start ${
            alert.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : alert.type === "error"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-yellow-50 border border-yellow-200 text-yellow-800"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {alert.type === "success" ? (
            <FaCheckCircle className="mt-1 mr-2 flex-shrink-0 text-green-500" />
          ) : alert.type === "error" ? (
            <FaTimesCircle className="mt-1 mr-2 flex-shrink-0 text-red-500" />
          ) : (
            <FaExclamationTriangle className="mt-1 mr-2 flex-shrink-0 text-yellow-500" />
          )}
          <div>
            <p className="font-medium">{alert.message}</p>
          </div>
        </motion.div>
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Panel - Instructions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Data Validation Guidelines
            </h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                Required Fields
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    EMAIL
                  </span>
                  <span>Valid email format (user@domain.com)</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    AADHAR NUMBER
                  </span>
                  <span>Exactly 12 digits</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    REGISTRATION NUMBER
                  </span>
                  <span>Exactly 12 digits</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    DEPARTMENT
                  </span>
                  <span>One of: {departments.join(", ")}</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                    CGPA
                  </span>
                  <span>Number between 0 and 10</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Best Practices
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Ensure consistent formatting in your Excel file</li>
                <li>• Remove any empty rows before uploading</li>
                <li>• Verify department names match exactly</li>
                <li>• Save your file as .xlsx for best compatibility</li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Upload Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Upload Student Data
            </h2>

            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-8 cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <FaFileUpload className="w-12 h-12 text-blue-500 mb-4" />
                <p className="text-lg font-medium text-blue-700 mb-1">
                  Drag & Drop Excel File Here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports .xlsx, .xls
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

            {/* Download Template Button */}
            <button
              onClick={handleDownloadTemplate}
              className="w-full mb-6 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaFileDownload className="mr-2 text-blue-500" />
              Download Template File
              <p className=" ml-2">| Note: This data cannot be used for uploading</p>
            </button>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={validRows.length === 0 || saving || dataSaved}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${
                  validRows.length === 0 || saving || dataSaved
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : dataSaved ? (
                  <>
                    <FaSave className="mr-2" /> Data saved
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Save Valid Data
                  </>
                )}
              </button>

              <button
                onClick={PostingToBlockchain}
                disabled={!savedData || savedData.length === 0}
                className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${
                  !savedData || savedData.length === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900 text-white"
                }`}
              >
                <FaDatabase className="mr-2" /> Post to Blockchain
              </button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-4 h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">
                  Validating Student Records
                </h3>
                <p className="text-sm text-gray-500">
                  Processed {Math.floor(rows.length * (progress / 100))} of{" "}
                  {rows.length} records ({progress}%)
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!loading && (validRows.length > 0 || invalidRows.length > 0) && (
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">
                Validation Results
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {/* Valid Records */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="flex items-center text-lg font-medium text-green-700">
                    <FaCheckCircle className="mr-2 text-green-500" />
                    Valid Records ({validRows.length})
                  </h4>
                  <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                    Ready for submission
                  </span>
                </div>

                {validRows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(validRows[0]).map((key) => (
                            <th
                              key={key}
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentValidRows.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {Object.values(row).map((val, idx) => (
                              <td
                                key={idx}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                              >
                                {val}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      currentPage={validCurrentPage}
                      totalPages={validTotalPages}
                      paginate={validPaginate}
                      type="valid"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No valid records found
                  </p>
                )}
              </div>

              {/* Invalid Records */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="flex items-center text-lg font-medium text-red-700">
                    <FaTimesCircle className="mr-2 text-red-500" />
                    Invalid Records ({invalidRows.length})
                  </h4>
                  <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">
                    Requires correction
                  </span>
                </div>

                {invalidRows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(invalidRows[0])
                            .filter((key) => key !== "errors")
                            .map((key) => (
                              <th
                                key={key}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Errors
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentInvalidRows.map((row, i) => (
                          <tr key={i} className="hover:bg-red-50">
                            {Object.entries(row)
                              .filter(([key]) => key !== "errors")
                              .map(([key, val], idx) => (
                                <td
                                  key={idx}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                >
                                  {val}
                                </td>
                              ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                              {row.errors.join(", ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pagination
                      currentPage={invalidCurrentPage}
                      totalPages={invalidTotalPages}
                      paginate={invalidPaginate}
                      type="invalid"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No invalid records found
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Cached Data Notification */}
        {fetching ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
            <svg
              className="animate-spin -ml-1 mr-4 h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-gray-700">Checking for cached data...</span>
          </div>
        ) : savedData ? (
          <motion.div
            onClick={() => navigate("/edit-data")}
            className="cursor-pointer bg-white rounded-xl shadow-sm border border-blue-200 p-6 hover:bg-blue-50 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                <FaDatabase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-800 mb-1">
                  Cached Data Available
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  You have {savedData.length} previously validated records ready
                  for submission.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/edit-data");
                    }}
                    className="text-sm bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                  >
                    Review Data
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      PostingToBlockchain();
                    }}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                  >
                    Submit Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default Validator;
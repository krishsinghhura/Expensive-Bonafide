import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const navigate = useNavigate();

  useEffect(()=>{
    const token=Cookies.get("token");

    if(!token){
      navigate("/auth");
    }
  },[])

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get('https://bonafide-backend.onrender.com/get-data/student', {
          withCredentials: true
        });
        setStudentData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch student data');
        setLoading(false);
        console.error('Error fetching student data:', err);
      }
    };

    fetchStudentData();
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <div className="text-blue-600 text-2xl font-semibold">Loading your dashboard...</div>
          <p className="text-blue-400 mt-2">Securely fetching your academic records</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-red-500 text-xl p-4 bg-white rounded-lg shadow-md">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!studentData || studentData.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-blue-600 text-xl">No student records found</div>
      </div>
    );
  }

  // Get the primary record (first MongoDB record)
  const primaryRecord = studentData.data[0];
  const certificates = studentData.data.filter(record => record.CertificateUrl);

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-4 shadow-lg">
        <div className="mb-8 mt-4 flex items-center space-x-3">
          <img 
            src="./public/bonafide-logo.png" 
            alt="Bonafide Logo" 
            className="h-10 w-100"
          />
          
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left p-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('academics')}
                className={`w-full text-left p-3 rounded-lg transition ${activeTab === 'academics' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              >
                Academic Details
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`w-full text-left p-3 rounded-lg transition ${activeTab === 'certificates' ? 'bg-blue-600' : 'hover:bg-blue-700'}`}
              >
                Certificates
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-800">
            {activeTab === 'profile' && 'Student Profile'}
            {activeTab === 'academics' && 'Academic Details'}
            {activeTab === 'certificates' && 'My Certificates'}
          </h2>
          <p className="text-blue-600">Welcome back, {primaryRecord.name}</p>
        </header>

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium">{primaryRecord.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{primaryRecord.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Aadhar Number</p>
                <p className="font-medium">{primaryRecord.aadhar_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Registration Number</p>
                <p className="font-medium">{primaryRecord.registration_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Wallet Address</p>
                <p className="font-medium">{primaryRecord.walletAddress || 'Not connected'}</p>
              </div>
            </div>

            <button
              onClick={() => openModal({
                title: 'University Details',
                content: (
                  <div>
                    <p><span className="font-semibold">Name:</span> {primaryRecord.university.name}</p>
                    <p><span className="font-semibold">Email:</span> {primaryRecord.university.email}</p>
                  </div>
                )
              })}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View University Details
            </button>
          </div>
        )}

        {activeTab === 'academics' && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">University</p>
                <p className="font-medium">{primaryRecord.university.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-medium">{primaryRecord.department}</p>
              </div>
              <div>
                <p className="text-gray-500">CGPA</p>
                <p className="font-medium">{primaryRecord.cgpa}</p>
              </div>
              <div>
                <p className="text-gray-500">Blockchain Status</p>
                <p className="font-medium">
                  {primaryRecord.blockchainTxnHash ? 'Verified on blockchain' : 'Not verified'}
                </p>
              </div>
            </div>

            {primaryRecord.blockchainTxnHash && (
              <button
                onClick={() => openModal({
                  title: 'Blockchain Verification',
                  content: (
                    <div>
                      <p className="mb-2">Transaction Hash:</p>
                      <a 
                        href={`https://subnets-test.avax.network/c-chain/tx/${primaryRecord.blockchainTxnHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {primaryRecord.blockchainTxnHash}
                      </a>
                      <p className="mt-2 text-sm text-gray-500">Click the hash to view on Avalanche Explorer</p>
                    </div>
                  )
                })}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Blockchain Details
              </button>
            )}
            <button  className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-148"
            onClick={()=>{
              navigate("/verify-student")
            }}
            >Claim NFT</button>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div>
            <h3 className="text-xl font-semibold text-blue-800 mb-4">My Certificates</h3>
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <img 
                      src={cert.CertificateUrl} 
                      alt={`Certificate ${index + 1}`} 
                      className="w-full h-48 object-contain"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-blue-800">Certificate #{index + 1}</h4>
                      <p className="text-sm text-gray-500 mb-2">
                        Issued on: {new Date(cert.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => window.open(cert.CertificateUrl, '_blank')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Full Size
                        </button>
                        {cert.blockchainTxnHash && (
                          <a
                            href={`https://subnets-test.avax.network/c-chain/tx/${cert.blockchainTxnHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                            title="View on blockchain"
                          >
                            🔗 Verify
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-500">No certificates found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-blue-800">{modalContent.title}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              {modalContent.content}
            </div>
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
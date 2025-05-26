import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ClaimNFTButton from "../components/ClaimButton";

export default function StudentVerifier() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const verificationSteps = [
    { label: "Checking credential revocation status", emoji: "🔍" },
    { label: "Comparing blockchain hashes", emoji: "🔗" },
    { label: "Validating credential expiration", emoji: "⏳" },
    { label: "Verifying issuer signature", emoji: "✍️" },
    { label: "Final confirmation", emoji: "✅" },
  ];

  useEffect(() => {
    if (isVerifying) {
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < verificationSteps.length) {
          setVerificationStep(currentStep);
          currentStep += 1;
        } else {
          clearInterval(interval);
          setIsVerifying(false);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isVerifying]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationStep(0);
    setError("");
    setVerificationError("");
    setResult(null);

    try {
      const response = await axios.post(
        "https://bonafide-backend.onrender.com/verify/verify",
        { email }
      );
      if (response.status === 200) {
        setResult(response.data);
        setIsDialogOpen(false);
      }
      console.log(response);
      console.log(response.data.certificateUrl);
      
      
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationError(err.response?.data?.error || "Verification failed. Please check the email and try again.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Verification Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800">Credential Verification</h2>
                <p className="text-gray-600 mt-1">Verify academic credentials using blockchain technology</p>
              </div>
              
              <div className="p-6">
                {!result ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Verify a credential</h3>
                    <p className="text-gray-600 mb-6">Enter the student's email address to begin verification</p>
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Start Verification
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">Credential Verified Successfully</h3>
                        <p className="text-gray-600">This credential has been verified on the blockchain</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DetailCard 
                        title="Student Information" 
                        items={[
                          { label: "Name", value: result.name || "Not provided" },
                          { label: "Email", value: result.email },
                        ]} 
                      />
                      
                      <DetailCard 
                        title="Blockchain Details" 
                        items={[
                          { label: "Transaction Hash", value: result.transactionHash, link: `https://subnets-test.avax.network/c-chain/tx/${result.transactionHash}` },
                          { label: "Verification Date", value: new Date().toLocaleDateString() },
                        ]} 
                      />
                    </div>
                    
                    {result.certificateUrl && (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700">Certificate Preview</h4>
                        </div>
                        <div className="p-4">
                          <img
                            src={result.certificateUrl}
                            alt="Certificate"
                            className="w-full h-auto rounded-lg shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Share Section - Only shown when verified */}
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800">Share This Credential</h3>
                </div>
                <div className="p-6">
                  <div className="flex justify-center space-x-4">
                    <FacebookShareButton 
                      url={result.certificateUrl || window.location.href} 
                      quote="Check out my verified credential!"
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <FacebookIcon size={40} round />
                    </FacebookShareButton>
                    <TwitterShareButton 
                      url={result.certificateUrl || window.location.href} 
                      title="My verified credential!"
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <TwitterIcon size={40} round />
                    </TwitterShareButton>
                    <LinkedinShareButton 
                      url={result.certificateUrl || window.location.href}
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <LinkedinIcon size={40} round />
                    </LinkedinShareButton>
                    <EmailShareButton
                      url={result.certificateUrl || window.location.href}
                      subject="My Verified Credential"
                      body="I wanted to share my verified credential with you."
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      <EmailIcon size={40} round />
                    </EmailShareButton>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-800">Credential Status</h3>
              </div>
              <div className="p-6">
                <div className="text-center">
                  
                  <h4 className="text-xl font-medium text-gray-800 mb-1">
                    {result?.name || "Student Name"}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {result?.institution || "Educational Institution"}
                  </p>
                  
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    result ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {result ? (
                      <>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Not Verified
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* NFT Claim Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-800">Digital Badge</h3>
              </div>
              <div className="p-6">
                <div className="text-center">
                  <div className="mx-auto w-32 h-32 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {result 
                      ? "Claim your NFT badge as proof of this verified credential"
                      : "Verify a credential to claim your NFT badge"}
                  </p>
                  <ClaimNFTButton
                    email={result?.email || ""}
                    jsonUrl={result?.jsonUrl || ""}
                    disabled={!result}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Verification Dialog */}
        <AnimatePresence>
          {isDialogOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">Verify Credential</h3>
                </div>
                
                <div className="p-6">
                  {!isVerifying && !verificationError ? (
                    <form onSubmit={handleVerify} className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Student Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          placeholder="student@institution.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setResult(null);
                          }}
                          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          Verify
                        </button>
                      </div>
                    </form>
                  ) : isVerifying ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-800">Verifying Credential</h4>
                        <p className="text-gray-600 mt-1">This may take a few moments...</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${((verificationStep + 1) / verificationSteps.length) * 100}%`,
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        
                        <ul className="space-y-3">
                          {verificationSteps.map((step, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{
                                opacity: index <= verificationStep ? 1 : 0.5,
                                x: 0,
                              }}
                              transition={{ delay: index * 0.3 }}
                              className={`flex items-start space-x-3 ${
                                index === verificationStep ? "text-blue-600" : "text-gray-500"
                              }`}
                            >
                              <span className="flex-shrink-0 mt-0.5">{step.emoji}</span>
                              <span className={`${
                                index <= verificationStep ? "font-medium" : "font-normal"
                              }`}>{step.label}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : verificationError ? (
                    <div className="text-center space-y-6">
                      <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-800">Verification Failed</h4>
                      <p className="text-gray-600">{verificationError}</p>
                      <button
                        onClick={() => {
                          setIsDialogOpen(false);
                          setVerificationStep(0);
                          setVerificationError("");
                        }}
                        className="mt-4 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

function DetailCard({ title, items }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">{title}</h4>
      <dl className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <dt className="text-xs font-medium text-gray-500">{item.label}</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                >
                  {item.value}
                </a>
              ) : (
                <span>{item.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
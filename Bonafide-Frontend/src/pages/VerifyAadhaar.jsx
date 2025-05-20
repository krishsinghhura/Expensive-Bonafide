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
    { label: "Verifying issuer signature", emoji: "✍" },
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
        "http://localhost:4000/verify/verify",
        { email }
      );
      if (response.status === 200) {
        setResult(response.data);
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationError(err.response?.data?.error || "Verification failed.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-500">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full flex gap-8">
          {/* Left Section */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
            style={{ width: "800px", height: "550px" }}
          >
            <div className="mb-8 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={result?.certificateUrl || "https://source.unsplash.com/800x400/?certificate"}
                alt="Certificate"
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "https://source.unsplash.com/800x400/?certificate";
                }}
              />
            </div>

            {result && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-purple-700">
                  Credential Details
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Student Email" value={result.email} />
                  <DetailItem
                    label="Transaction Hash"
                    value={result.transactionHash}
                    link={`https://subnets-test.avax.network/c-chain/tx/${result.transactionHash}`}
                  />
                  {result.certificateUrl && (
                    <DetailItem
                      label="Certificate URL"
                      value={result.certificateUrl}
                      link={result.certificateUrl}
                      breakWords
                    />
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Section */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col justify-between"
            style={{ width: "360px", height: "600px" }}
          >
            <div className="text-center">
              <img
                src="https://source.unsplash.com/100x100/?portrait"
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-purple-700 mb-2">
                {result?.name || "Student Name"}
              </h3>
              <p className="text-gray-600 mb-6">
                {result ? "Verified Credential" : "Enter email to verify"}
              </p>

              <div
                className={`p-4 rounded-lg mb-6 ${
                  result ? "bg-green-100" : "bg-yellow-100"
                }`}
              >
                <span
                  className={`font-semibold ${
                    result ? "text-green-700" : "text-yellow-700"
                  }`}
                >
                  {result ? "✅ Verified Credential" : "⚠ Pending Verification"}
                </span>
              </div>

              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-purple-700 hover:bg-purple-800 text-white w-full py-3 rounded-md font-semibold transition duration-200"
              >
                Verify Credential
              </button>
            </div>

            {/* Claim NFT Button (enabled only if verified) */}
            <div className="mt-8">
              <ClaimNFTButton
                email={email}
                disabled={!result}
                certificateUrl={result?.certificateUrl}
              />
            </div>
          </motion.div>
        </div>

        {/* Verification Dialog */}
        <AnimatePresence>
          {isDialogOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
              >
                <h3 className="text-2xl font-bold text-purple-700 mb-6">
                  Verify Credential
                </h3>

                {!isVerifying && !verificationError ? (
                  <form onSubmit={handleVerify} className="space-y-6">
                    <input
                      type="email"
                      placeholder="Enter student email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setResult(null);
                        }}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-purple-700 text-white py-3 rounded-md"
                      >
                        Start Verification
                      </button>
                    </div>
                  </form>
                ) : isVerifying ? (
                  <div className="space-y-6">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <motion.div
                        className="h-full bg-purple-700 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            ((verificationStep + 1) / verificationSteps.length) * 100
                          }%`,
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    <div className="space-y-4">
                      {verificationSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: index <= verificationStep ? 1 : 0.3,
                            x: 0,
                          }}
                          transition={{ delay: index * 0.3 }}
                          className={`flex items-center space-x-2 text-sm ${
                            index === verificationStep
                              ? "font-semibold text-purple-700"
                              : "text-gray-500"
                          }`}
                        >
                          <span>{step.emoji}</span>
                          <span>{step.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : verificationError ? (
                  <div className="text-center space-y-4">
                    <p className="text-red-600 font-semibold text-lg">
                      ❌ {verificationError}
                    </p>
                    <button
                      onClick={() => {
                        setIsDialogOpen(false);
                        setVerificationStep(0);
                        setVerificationError("");
                      }}
                      className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md"
                    >
                      Close
                    </button>
                  </div>
                ) : null}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Share Section */}
      {result && result.certificateUrl && (
        <div className="bg-white py-10 px-6 rounded-t-3xl shadow-inner mt-12 text-center">
          <h3 className="text-2xl font-bold text-purple-700 mb-6">
            🎉 Share Your Achievement
          </h3>
          <div className="flex justify-center space-x-6">
            <FacebookShareButton url={result.certificateUrl} quote="Check out my verified certificate!">
              <FacebookIcon size={48} round />
            </FacebookShareButton>
            <TwitterShareButton url={result.certificateUrl} title="My verified certificate!">
              <TwitterIcon size={48} round />
            </TwitterShareButton>
            <LinkedinShareButton url={result.certificateUrl}>
              <LinkedinIcon size={48} round />
            </LinkedinShareButton>
            <EmailShareButton
              url={result.certificateUrl}
              subject="My Certificate"
              body="Hey, check out my verified certificate!"
            >
              <EmailIcon size={48} round />
            </EmailShareButton>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

function DetailItem({ label, value, breakWords, link }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-purple-700 font-semibold ${breakWords ? "break-all" : ""}`}
        >
          {value}
        </a>
      ) : (
        <p className={`text-gray-800 font-medium ${breakWords ? "break-all" : ""}`}>
          {value}
        </p>
      )}
    </div>
  );
}

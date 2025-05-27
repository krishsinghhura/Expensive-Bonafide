import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "./abi.json";
import axios from "axios";

const CONTRACT_ADDRESS = "0x65047797669259f28cABc1719a0885AFCD27aB57";

const ClaimEmailNFT = ({ email = "", jsonUrl = "", disabled = false }) => {
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setUserAddress(accounts[0]);
    return accounts[0];
  };

  const checkEmailVerification = async () => {
    if (!email) {
      alert("No email provided");
      return;
    }

    try {
      setStatus("Checking verification status...");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const isVerified = await contract.verifyStudentEmail(email);
      setIsVerified(isVerified);

      setStatus(isVerified 
        ? "✅ Email verified! Ready to claim NFT" 
        : "❌ Email not verified on blockchain");
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("❌ Error checking verification: " + err.message);
      setIsVerified(false);
    }
  };

  const claimNFT = async () => {
  if (!isVerified) {
    alert("Email must be verified first");
    return;
  }
  console.log(jsonUrl);
  
  try {
    setStatus("Connecting wallet...");
    const account = await connectWallet();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    setStatus("Claiming NFT... (Confirm in MetaMask)");
    const tx = await contract.mintNFT(email, account, jsonUrl);
    await tx.wait();

    // After successful mint, update backend
    try {
      setStatus("Updating claim status...");
      const response = await axios.post('https://bonafide-backend.onrender.com/api/claim', {
        email,
        walletAddress: account
      });

      setStatus("🎉 NFT successfully claimed and recorded!");
    } catch (backendError) {
      console.error("Backend update error:", backendError);
      setStatus("⚠️ NFT minted but backend update failed: " + backendError.message);
    }
  } catch (err) {
    console.error("Claim error:", err);
    setStatus("❌ Error: " + (err.message.includes("user rejected") 
      ? "Transaction rejected" 
      : err.message));
  }
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Claim Email NFT</h2>
      
      <div className="mb-4">
        <p className="block text-gray-700 mb-2">Email:</p>
        <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">
          {email || "No email provided"}
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={checkEmailVerification}
          disabled={disabled || !email}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            !disabled && email
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Verify Email
        </button>

        <button
          onClick={claimNFT}
          disabled={!isVerified || disabled || !email}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            isVerified && email
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Claim NFT
        </button>
      </div>

      {userAddress && (
        <p className="mt-2 text-sm text-gray-600">
          Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
        </p>
      )}

      {status && (
        <p className={`p-3 rounded-lg text-sm ${
          status.includes("✅") || status.includes("🎉")
            ? "bg-green-100 text-green-800"
            : status.includes("❌")
            ? "bg-red-100 text-red-800"
            : "bg-blue-100 text-blue-800"
        }`}>
          {status}
        </p>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Note: This NFT is non-transferable (Soulbound Token)</p>
      </div>
    </div>
  );
};

export default ClaimEmailNFT;
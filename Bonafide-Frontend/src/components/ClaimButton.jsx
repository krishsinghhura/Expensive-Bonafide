import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "./abi.json";
import axios from "axios";

const CONTRACT_ADDRESS = "0xA8Af939C27657414bdAeD587Bafba593baf5C1Bf";

const ClaimEmailNFT = ({ email = "", jsonUrl = "", disabled = false, claimed = false }) => {
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

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
    setShowConfirmation(false);
    setIsClaiming(true);
    
    if (!isVerified) {
      alert("Email must be verified first");
      setIsClaiming(false);
      return;
    }
    
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
        const response = await axios.post('https://expensive-bonafide-production.up.railway.app/api/claim', {
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
    } finally {
      setIsClaiming(false);
    }
  };

  // Show different UI if NFT is already claimed
  if (claimed) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Email NFT Status</h2>
        
        <div className="mb-4">
          <p className="block text-gray-700 mb-2">Email:</p>
          <div className="w-full px-4 py-2 border rounded-lg bg-gray-100">
            {email || "No email provided"}
          </div>
        </div>

        <div className="p-4 bg-green-100 text-green-800 rounded-lg mb-4">
          <p className="font-medium">✅ NFT Already Claimed</p>
          <p className="text-sm mt-1">This credential has already been minted as an NFT.</p>
        </div>

        {userAddress && (
          <p className="mt-2 text-sm text-gray-600">
            Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </p>
        )}
      </div>
    );
  }

  // Normal UI for unclaimed NFTs
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">      
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
          onClick={() => setShowConfirmation(true)}
          disabled={!isVerified || disabled || !email || isClaiming}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            isVerified && email && !isClaiming
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isClaiming ? "Processing..." : "Claim NFT"}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm NFT Claim</h3>
            <p className="mb-4 text-gray-700">
              Once claimed, you won't be able to transfer this NFT to anyone else. 
              Your degree will be permanently locked in the wallet you're using right now.
            </p>
            <p className="mb-4 font-medium text-gray-800">
              Current Wallet: {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : "Not connected"}
            </p>
            <p className="mb-6 text-sm text-red-600">
              Please double-check your wallet address before proceeding.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={claimNFT}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Confirm Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimEmailNFT;
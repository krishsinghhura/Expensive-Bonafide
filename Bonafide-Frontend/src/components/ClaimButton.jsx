import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "./abi.json";

const CONTRACT_ADDRESS = "0x0c99df73fB87c46EaA7666CeCfeAA6E758355329";

const ClaimEmailNFT = ({ email, certificateUrl, disabled }) => {
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setUserAddress(accounts[0]);
        return accounts[0];
      } catch (error) {
        throw new Error("Wallet connection failed");
      }
    } else {
      throw new Error("Please install MetaMask");
    }
  };

  const checkEmailVerification = async () => {
    console.log("email",email);
    
    if (!email || !certificateUrl) {
      alert("Email and certificate URL are required");
      return;
    }

    try {
      setStatus("Checking email verification...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const isVerified = await contract.verifyStudentEmail(email);
      setIsVerified(isVerified);
      
      if (isVerified) {
        setStatus("✅ Email verified! You can now claim your NFT");
      } else {
        setStatus("❌ Email not verified. Contact your university");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("❌ Error checking verification: " + err.message);
    }
  };

  const claimNFT = async () => {
    if (!isVerified || !certificateUrl) {
      alert("Email must be verified first");
      return;
    }

    try {
      setStatus("Connecting wallet...");
      const account = await connectWallet();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setStatus("Claiming your NFT... (Confirm in MetaMask)");
      const tx = await contract.mintNFT(email, account, certificateUrl);
      await tx.wait();

      setStatus("🎉 NFT Successfully Claimed! Check your wallet");
    } catch (err) {
      console.error("Claim error:", err);
      setStatus("❌ Error: " + 
        (err.message.includes("NFT already minted") 
          ? "You've already claimed your NFT" 
          : err.message)
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Claim Your University NFT</h2>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={checkEmailVerification}
          disabled={disabled}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            !disabled
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Check Verification
        </button>
        
        <button
          onClick={claimNFT}
          disabled={!isVerified || disabled}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            isVerified && !disabled
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Claim NFT
        </button>
      </div>

      {userAddress && (
        <p className="text-sm text-gray-600 mb-2">
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
        {email && <p>Email: {email}</p>}
        {certificateUrl && <p>Certificate URL: {certificateUrl.slice(0, 30)}...</p>}
      </div>
    </div>
  );
};

export default ClaimEmailNFT;
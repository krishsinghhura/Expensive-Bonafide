import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "./abi.json"; // Make sure this matches your contract's ABI
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CONTRACT_ADDRESS = "0xDf5fb0517f05d96410Fd525CD03E68de647FAe83"; // Replace with your contract address

const ClaimEmailNFT = () => {
  const navigate = useNavigate();
  const [uri, setUri] = useState("");
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState("");
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  //get the data of all the students from the db
  useEffect(() => {
    axios
      .get("http://localhost:4000/get-data/data", {
        withCredentials: true,
      })
      .then((res) => {
        const allData = res.data;
        alert("done");
        setStudent(allData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask");
    }
  };

  const checkEmailVerification = async () => {
    if (!email) {
      alert("Please enter your university email");
      return;
    }

    try {
      setStatus("Checking email verification...");

      // 1. Find the student with matching email
      const matchedStudent = Array.isArray(student)
        ? student.find((s) => s.email === email)
        : null;

      if (!matchedStudent) {
        setStatus("❌ No student found with this email");
        return;
      }

      // 2. Extract JSONUrl
      setUri(matchedStudent.JSONUrl);

      // 3. Verify on blockchain
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
    // if (!email || !certificateUrl) {
    //   setStatus("❌ Missing email or certificate URL");
    //   return;
    // }

    // if (!contractAddress) {
    //   setStatus("❌ Contract address not configured");
    //   return;
    // }

    try {
      setStatus("Connecting wallet...");
      const account = await connectWallet();

      // Check if we need to switch networks
      if (requiredChainId && currentChainId !== parseInt(requiredChainId)) {
        setStatus("Switching network...");
        await switchNetwork(requiredChainId);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, ABI, signer);

      setStatus("Claiming your NFT... (Confirm in MetaMask)");
      const tx = await contract.mintNFT(email, account, uri);
      await tx.wait();

      setStatus("🎉 NFT Successfully Claimed! Check your wallet");
    } catch (err) {
      console.error("Claim error:", err);
      setStatus(
        "❌ Error: " +
          (err.message.includes("NFT already minted")
            ? "You've already claimed your NFT"
            : err.message)
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        University Email NFT
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">University Email</label>
        <input
          type="email"
          placeholder="student@university.edu"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={checkEmailVerification}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Check Verification
        </button>

        <button
          onClick={claimNFT}
          disabled={!isVerified}
          className={`flex-1 px-4 py-2 rounded-lg transition ${
            isVerified
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
          {currentChainId && ` (Chain ID: ${currentChainId})`}
        </p>
      )}

      {status && (
        <p
          className={`p-3 rounded-lg text-sm ${
            status.includes("✅") || status.includes("🎉")
              ? "bg-green-100 text-green-800"
              : status.includes("❌")
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
        }`}>
          {status}
        </p>
      )}  

      <p className="mt-2 text-xs text-gray-400">
        Note: This NFT is non-transferable (Soulbound Token)
      </p>
    </div>
  );
};

export default ClaimEmailNFT;

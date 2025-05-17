import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "./abi.json"; // Replace with actual ABI JSON filename if different

const CONTRACT_ADDRESS = "0x83F1DA1967e2FA1022C52c9B0e0EAd0C61bB2a89";

const MintEmailNFT = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setUserAddress(accounts[0]);
        return accounts[0];
      } catch (error) {
        throw new Error("Wallet connection failed");
      }
    } else {
      throw new Error("MetaMask not found");
    }
  };

  const handleMint = async () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }

    try {
      setStatus("Connecting wallet...");
      const account = await connectWallet();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setStatus("Minting NFT...");
      const tx = await contract.mintEmailSBT(account, email);
      await tx.wait();

      setStatus("✅ NFT Minted Successfully!");
    } catch (err) {
      console.error("Transaction error:", err);
      setStatus("❌ Error: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Claim Your NFT</h2>

      <input
        type="email"
        placeholder="Enter email"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleMint}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-pink-500 hover:to-yellow-500 text-white font-bold rounded-lg transition-all duration-300"
      >
        Claim NFT (SBT)
      </button>

      {status && (
        <p className="mt-4 text-sm text-center text-blue-600">{status}</p>
      )}
    </div>
  );
};

export default MintEmailNFT;

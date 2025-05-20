import React, { useState } from "react";
import { ethers } from "ethers";
import ABI from "./abi.json";

const ClaimNFTButton = ({ 
  email, 
  certificateUrl, 
  disabled,
  contractAddress,
  requiredChainId 
}) => {
  const [status, setStatus] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [currentChainId, setCurrentChainId] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask");
    }

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Create provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get network and verify
      const network = await provider.getNetwork();
      setCurrentChainId(network.chainId);

      if (requiredChainId && network.chainId !== parseInt(requiredChainId)) {
        throw new Error(`Please connect to the correct network (Chain ID: ${requiredChainId})`);
      }

      const accounts = await provider.listAccounts();
      setUserAddress(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      return true;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        throw new Error(`Please add this network to MetaMask first`);
      }
      throw switchError;
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
      const tx = await contract.mintNFT(account, certificateUrl);
      
      setStatus("⏳ Waiting for transaction confirmation...");
      await tx.wait(); // Wait for transaction to be mined

      setStatus("🎉 NFT Successfully Claimed! Check your wallet");
    } catch (err) {
      console.error("Claim error:", err);
      let errorMessage = err.message;
      
      if (err.code === 4001) {
        errorMessage = "Transaction rejected by user";
      } else if (err.message.includes("user rejected")) {
        errorMessage = "Transaction rejected";
      } else if (err.message.includes("already minted")) {
        errorMessage = "You've already claimed your NFT";
      }

      setStatus(`❌ ${errorMessage.split("(")[0].trim()}`);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <button
        onClick={claimNFT}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        🎓 Claim NFT
      </button>

      {userAddress && (
        <p className="mt-2 text-sm text-gray-600">
          Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          {currentChainId && ` (Chain ID: ${currentChainId})`}
        </p>
      )}

      {status && (
        <p
          className={`mt-3 p-3 rounded text-sm ${
            status.includes("✅") || status.includes("🎉")
              ? "bg-green-100 text-green-800"
              : status.includes("❌")
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {status}
        </p>
      )}

      <p className="mt-2 text-xs text-gray-400">
        Note: This NFT is non-transferable (Soulbound Token)
      </p>
    </div>
  );
};

export default ClaimNFTButton;
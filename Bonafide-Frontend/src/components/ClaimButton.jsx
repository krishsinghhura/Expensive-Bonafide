import React from "react";

const ClaimNFTButton = () => {
  const handleClaim = () => {
    // You can add your claim logic here
    alert("NFT Claimed!");
  };

  return (
    <div >
      <button
        onClick={handleClaim}
        className="px-6 py-3 text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-pink-500 hover:to-yellow-500 rounded-xl shadow-lg transition-all duration-300 ease-in-out"
      >
        Claim as NFT
      </button>
    </div>
  );
};

export default ClaimNFTButton;

import { ethers } from 'ethers';
import  CONTRACT_ABI from "./ABI.json"

// Replace these:
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS

export const getContract = async () => {
  if (!window.ethereum) throw new Error('MetaMask not installed');

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  return contract;
};

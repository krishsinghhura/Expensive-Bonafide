import { getContract } from './contract';

export const uploadMerkleRoot = async (merkleRootHex) => {
  try {
    const contract = await getContract();

    // Convert hex string to bytes32 format
    const tx = await contract.addMerkleRoot(`0x${merkleRootHex}`);
    await tx.wait(); // Wait for transaction to be mined

    console.log('Merkle root uploaded:', merkleRootHex);
    return true;
  } catch (err) {
    console.error('Upload failed:', err.message);
    return false;
  }
};
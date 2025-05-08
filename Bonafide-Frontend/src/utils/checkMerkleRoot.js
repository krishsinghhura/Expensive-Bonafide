import { getContract } from './contract';

export const checkMerkleRoot = async (merkleRootHex) => {
  try {
    const contract = await getContract();

    const isValid = await contract.isRootValid(`0x${merkleRootHex}`);
    console.log('Merkle root validity:', isValid);
    return isValid;
  } catch (err) {
    console.error('Check failed:', err.message);
    return false;
  }
};

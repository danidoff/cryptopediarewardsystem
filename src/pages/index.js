import { useState } from "react";
import Web3 from "web3";
import { rewardContractAbi, rewardContractAddress } from "./constants";

const HomePage = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        setWeb3(web3Instance);
        setAccount(accounts[0]);

        // Create contract instance
        const contractInstance = new web3Instance.eth.Contract(rewardContractAbi, rewardContractAddress);
        setContract(contractInstance);
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Example function to interact with the smart contract
  const addRewardAddress = async () => {
    if (!contract) return alert("Contract is not loaded.");
    const rewardAddress = prompt("Enter the reward address:");
    try {
      await contract.methods.addRewardAddress(rewardAddress).send({ from: account });
      alert("Reward address added successfully.");
    } catch (error) {
      console.error("Error adding reward address:", error);
    }
  };

  const removeRewardAddress = async () => {
    if (!contract) return alert("Contract is not loaded.");
    const rewardAddress = prompt("Enter the reward address to remove:");
    try {
      await contract.methods.removeRewardAddress(rewardAddress).send({ from: account });
      alert("Reward address removed successfully.");
    } catch (error) {
      console.error("Error removing reward address:", error);
    }
  };

  const changeRewardPercentage = async () => {
    if (!contract) return alert("Contract is not loaded.");
    const newPercentage = prompt("Enter the new reward percentage:");
    try {
      await contract.methods.changeRewardPercentage(newPercentage).send({ from: account });
      alert("Reward percentage updated successfully.");
    } catch (error) {
      console.error("Error changing reward percentage:", error);
    }
  };

  const distributeRewards = async () => {
    if (!contract) return alert("Contract is not loaded.");
    try {
      await contract.methods.distributeRewards().send({ from: account });
      alert("Rewards distributed successfully.");
    } catch (error) {
      console.error("Error distributing rewards:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Web3.js MetaMask Connection</h1>

      {/* Connect Wallet Button */}
      {!account ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Connect to MetaMask
        </button>
      ) : (
        <div>
          <p>Connected Wallet: {account}</p>

          {/* Buttons to interact with the smart contract */}
          <button
            onClick={addRewardAddress}
            style={{
              margin: "10px",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Reward Address
          </button>

          <button
            onClick={removeRewardAddress}
            style={{
              margin: "10px",
              padding: "10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Remove Reward Address
          </button>

          <button
            onClick={changeRewardPercentage}
            style={{
              margin: "10px",
              padding: "10px",
              backgroundColor: "#ffc107",
              color: "#000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Change Reward Percentage
          </button>

          <button
            onClick={distributeRewards}
            style={{
              margin: "10px",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Distribute Rewards
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;

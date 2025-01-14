import { useState } from "react";
import Web3 from "web3";
import { rewardContractAbi, rewardContractAddress } from "../helpers/constants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const HomePage = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);
  const [contract, setContract] = useState(null);
  const [inputValue, setInputValue] = useState(""); // Input value state
  const [loading, setLoading] = useState(false); // Loading state
  const [action, setAction] = useState(""); // Current action state

  // Function to connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        setWeb3(web3Instance);
        setAccount(accounts[0]);

        const contractInstance = new web3Instance.eth.Contract(rewardContractAbi, rewardContractAddress);
        setContract(contractInstance);

        const accountBalance = await web3Instance.eth.getBalance(accounts[0]);
        setBalance(web3Instance.utils.fromWei(accountBalance, "ether"));

        const networkId = await web3Instance.eth.net.getId();
        const networkName = getNetworkName(networkId);
        setNetwork(networkName);

        toast.success("Wallet connected successfully!");
      } else {
        toast.error("MetaMask is not installed. Please install it to use this app.");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet. Check the console for details.");
    }
  };

  const getNetworkName = (id) => {
    switch (id) {
      case 1:
        return "Ethereum Mainnet";
      case 3:
        return "Ropsten Testnet";
      case 4:
        return "Rinkeby Testnet";
      case 5:
        return "Goerli Testnet";
      case 42:
        return "Kovan Testnet";
      case 137:
        return "Polygon Mainnet";
      case 80001:
        return "Mumbai Testnet";
      default:
        return "Unknown Network";
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setBalance(null);
    setNetwork(null);
    setContract(null);
    toast.info("Wallet disconnected.");
  };

  const handleAction = async () => {
    if (!contract) return toast.error("Contract is not loaded.");
    setLoading(true);

    try {
      switch (action) {
        case "add":
          if (!web3.utils.isAddress(inputValue)) {
            toast.error("Invalid address format.");
            return;
          }
          await contract.methods.addRewardAddress(inputValue).send({ from: account });
          toast.success("Reward address added successfully.");
          break;

        case "remove":
          if (!web3.utils.isAddress(inputValue)) {
            toast.error("Invalid address format.");
            return;
          }
          await contract.methods.removeRewardAddress(inputValue).send({ from: account });
          toast.success("Reward address removed successfully.");
          break;

        case "change":
          if (isNaN(inputValue) || inputValue <= 0) {
            toast.error("Please enter a valid reward percentage.");
            return;
          }
          await contract.methods.changeRewardPercentage(inputValue).send({ from: account });
          toast.success("Reward percentage updated successfully.");
          break;

        case "distribute":
          try {
            console.log("Distribute rewards triggered.");
            const confirmDistribute = window.confirm(
                "Are you sure you want to distribute rewards to all eligible addresses?"
            );
            if (!confirmDistribute) {
              setLoading(false);
              return;
            }
            console.log("Attempting to distribute rewards...");
            await contract.methods.distributeRewards().send({ from: account });
            toast.success("Rewards distributed successfully.");
          } catch (error) {
            console.error("Error distributing rewards:", error);
            toast.error("Failed to distribute rewards. Check the console for details.");
          }
          break;

        default:
          toast.error("No valid action selected.");
      }
    } catch (error) {
      console.error("Error during action:", error);
      toast.error("Failed to perform action. Check the console for details.");
    } finally {
      setLoading(false);
      setInputValue(""); // Clear input after action
      setAction(""); // Reset action state
    }
  };

  return (
      <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "black",
            fontFamily: "Arial, sans-serif",
          }}
      >
        <div
            style={{
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              width: "1000px",
            }}
        >
          <h1 style={{ marginBottom: "20px", color: "#333" }}>Cryptopedia Reward System</h1>

          {!account ? (
              <button onClick={connectWallet} style={{ padding: "10px 20px", backgroundColor: "#0070f3", color: "#fff", 
                border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>
                Connect to MetaMask
              </button>
          ) : (
              <div>
                <p style={{marginBottom: "20px", color: "#555"}}>Connected Wallet: {account}</p>
                <p style={{marginBottom: "10px", color: "#555"}}>Balance: {balance} ETH</p>
                <p style={{marginBottom: "20px", color: "#555"}}>Network: {network}</p>

                <button
                    onClick={disconnectWallet}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "20px",
                    }}
                >
                  Disconnect Wallet
                </button>

                {/* Action Buttons */}
                <div>
                  <button
                      onClick={() => setAction("add")}
                      style={{
                        margin: "10px 5px",
                        padding: "10px",
                        backgroundColor: action === "add" ? "#0056b3" : "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      disabled={loading}
                  >
                    Add Reward Address
                  </button>

                  <button
                      onClick={() => setAction("remove")}
                      style={{
                        margin: "10px 5px",
                        padding: "10px",
                        backgroundColor: action === "remove" ? "#9a1f2f" : "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      disabled={loading}
                  >
                    Remove Reward Address
                  </button>

                  <button
                      onClick={() => setAction("change")}
                      style={{
                        margin: "10px 5px",
                        padding: "10px",
                        backgroundColor: action === "change" ? "#d9a30d" : "#ffc107",
                        color: "#000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      disabled={loading}
                  >
                    Change Reward Percentage
                  </button>

                  <button
                      onClick={() => setAction("distribute")}
                      style={{
                        margin: "10px 5px",
                        padding: "10px",
                        backgroundColor: action === "distribute" ? "#0062cc" : "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      disabled={loading}
                  >
                    Distribute Rewards
                  </button>
                </div>

                {/* Input Form */}
                {(action && action !== "distribute") && (
                    <div style={{marginTop: "20px"}}>
                      <input
                          type="text"
                          placeholder={
                            action === "change"
                                ? "Enter reward percentage"
                                : "Enter reward address"
                          }
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          style={{
                            padding: "10px",
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginBottom: "10px",
                            color: "black", // Black text color for better visibility
                            backgroundColor: "#ffffff", // White background for contrast
                          }}
                          disabled={loading}
                      />
                      <button
                          onClick={handleAction}
                          disabled={loading || !inputValue}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: loading || !inputValue ? "not-allowed" : "pointer",
                            width: "100%",
                          }}
                      >
                        {loading ? "Processing..." : "Submit"}
                      </button>
                    </div>
                )}
              </div>
          )}
          <ToastContainer position="top-right" autoClose={3000}/>
        </div>
      </div>
  );
};

export default HomePage;

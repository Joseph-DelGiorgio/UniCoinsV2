import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';
import './Home.css';

const Home = ({ web3, account, UNCollaborationContract, UNBadgeContract, getBalance }) => {
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        setAccounts(accounts);
        setWeb3(web3);
        setContract(contract);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Please install MetaMask!');
    }
  };

  const fetchBalance = async () => {
    if (UNCollaborationContract && account) {
      const balance = await UNCollaborationContract.methods.balanceOf(account).call();
      setBalance(balance);
    }
  };
  
  return (
    <div>
      <header className="home-header">
        <h1 className="display-4">Welcome to UNCollaboration</h1>
        <p className="lead">A platform for incentivizing volunteer work</p>
        <hr className="my-4" />
        <Button variant="primary" onClick={connectWallet}>Connect Wallet</Button>
      </header>
      <section className="features-section">
        <div className="row">
          <div className="col-md-4">
            <div className="feature">
              <i className="fas fa-tasks feature-icon"></i>
              <h3>Tasks</h3>
              <p>View and complete tasks to earn UNicoin tokens.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature">
              <i className="fas fa-project-diagram feature-icon"></i>
              <h3>Projects</h3>
              <p>Propose and participate in collaborative projects.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature">
              <i className="fas fa-medal feature-icon"></i>
              <h3>Badges</h3>
              <p>Earn badges for contributing a certain number of hours to a project.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="getting-started-section">
        <h2>Getting Started</h2>
        <p>Follow these steps to get started:</p>
        <ol>
          <li>Connect your wallet</li>
          <li>View available tasks and choose one to complete</li>
          <li>Receive UNicoin tokens for completing tasks</li>
          <li>Propose a project or participate in an existing project</li>
          <li>Earn badges for contributing a certain number of hours to a project</li>
        </ol>
      </section>
      <section className="how-to-stake-section">
        <h2>How toStake</h2>
<p>When proposing a project, the volunteer stakes a specified amount of tokens. Here's how you stake tokens when proposing a project:</p>
<ol>
<li>Make sure you are a volunteer: You must be added as a volunteer by a project manager using the addVolunteer(address volunteer) function.</li>
<li>Ensure you have enough tokens: Check your token balance using the balanceOf(address account) function from the ERC20 contract. You need to have enough tokens in your balance to stake the specified amount.</li>
<li>Propose a project: As a volunteer, call the proposeProject(string memory projectDescription, uint256 stakingAmount) function, where projectDescription is a description of the project, and stakingAmount is the amount of tokens you want to stake. The specified amount of tokens will be transferred from your balance to the contract and will be locked as a stake.</li>
</ol>
<Button variant="primary" onClick={fetchBalance}>Check Balance</Button>
  <p>Your balance is: {balance} UNicoins</p>
</section>
</div>
);
};

export default Home;








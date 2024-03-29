import { Web3Provider } from './contexts/Web3Context';
import AppNavbar from './components/AppNavbar';
import Tasks from './components/Tasks';
import Task from './components/Task';
import Projects from '/Users/josephdelgiorgio/UniCoins/Unicoins/my-app/src/components/Projects.js';
import Staking from '/Users/josephdelgiorgio/UniCoins/Unicoins/my-app/src/components/Staking.js';
import ProposeProject from '/Users/josephdelgiorgio/UniCoins/Unicoins/my-app/src/components/ProposeProject.js';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Home from './components/Home';
import UNCollaborationABI from './abis/UNCollaboration.json';
import UNBadgeABI from './abis/UNBadge.json';
import './Styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UNCollaboration from './abis/UNCollaboration.json';
import UNBadge from './abis/UNBadge.json';
import Badges from "./components/Badges";
import '/Users/josephdelgiorgio/UniCoins/Unicoins/my-app/src/components/Navigation.css';

const UNCollaborationAddress = 'REPLACE_WITH_UNCOLLABORATION_CONTRACT_ADDRESS';
const UNBadgeAddress = 'REPLACE_WITH_UNBADGE_CONTRACT_ADDRESS';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [UNCollaborationContract, setUNCollaborationContract] = useState(null);
  const [UNBadgeContract, setUNBadgeContract] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
      } else {
        console.log('Please install MetaMask!');
        // Consider displaying an alert or notification to the user about the missing Web3 provider.
      }
    };
  
    initWeb3();
  }, []);
  


  useEffect(() => {
    const initContracts = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const UNCollaboration = new web3.eth.Contract(UNCollaborationABI, UNCollaborationAddress);
        setUNCollaborationContract(UNCollaboration);

        const UNBadge = new web3.eth.Contract(UNBadgeABI, UNBadgeAddress);
        setUNBadgeContract(UNBadge);
      }
    };

    initContracts();
  }, [web3]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (UNCollaborationContract) {
        const taskCount = await UNCollaborationContract.methods.getTaskCount().call();
        const fetchedTasks = [];

        for (let i = 0; i < taskCount; i++) {
          const task = await UNCollaborationContract.methods.tasks(i).call();
          fetchedTasks.push(task);
        }

        setTasks(fetchedTasks);
      }
    };

    fetchTasks();
  }, [UNCollaborationContract]);

  const addTask = async (taskDescription, reward, volunteer) => {
    if (UNCollaborationContract) {
      await UNCollaborationContract.methods
        .addTask(taskDescription, reward, volunteer)
        .send({ from: account });
    }
  };

  const completeTask = async (taskIndex) => {
    if (UNCollaborationContract) {
      await UNCollaborationContract.methods
        .completeTask(taskIndex)
        .send({ from: account });
    }
  };

  const awardBadge = async (volunteer, tokenId, badgeDescription, hoursContributed) => {
    if (UNBadgeContract) {
      await UNBadgeContract.methods
        .awardBadge(volunteer, tokenId, badgeDescription, hoursContributed)
        .send({ from: account });
    }
  };

  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <AppNavbar />
          <Routes>
          <Route
              path="/"
              element={
                <Home
                  web3={web3}
                  account={account}
                  UNCollaborationContract={UNCollaborationContract}
                  UNBadgeContract={UNBadgeContract}
                />
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task/:id" element={<Task />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/propose-project" element={<ProposeProject />} />
            <Route path="/badges" element={<Badges provider={web3} volunteerAddress={account} />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
};

export default App;



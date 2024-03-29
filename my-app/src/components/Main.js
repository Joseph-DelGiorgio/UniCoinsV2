import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import Home from './Home';
import Tasks from './Tasks';
import Projects from './Projects';
import './Main.css';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';

const Main = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState('');
  const [networkId, setNetworkId] = useState(0);

  const connectWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const web3 = new Web3(provider);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      // Get user's UNicoin balance
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const balance = await contract.methods.balanceOf(accounts[0]).call();
      setBalance(balance);
    } else {
      alert('Please install MetaMask or another Ethereum wallet provider.');
    }
  };

  const logout = () => {
    setAccount('');
  };

  useEffect(() => {
    // Get current network and network ID
    const getNetworkInfo = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const network = await web3.eth.net.getNetworkType();
        const networkId = await web3.eth.net.getId();
        setNetwork(network);
        setNetworkId(networkId);
      }
    };

    getNetworkInfo();
  }, []);

  useEffect(() => {
    // Refresh page on network change
    const handleNetworkChange = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleNetworkChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.off('chainChanged', handleNetworkChange);
      }
    };
  }, []);

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4" style={{backgroundColor: "var(--primary-color)"}}>
        <Container>
          <Navbar.Brand href="/">UNCollaboration</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/tasks">Tasks</Nav.Link>
          <Nav.Link href="/projects">Projects</Nav.Link>
          {account ? (
            <div className="d-flex align-items-center">
              <span className="text-light mr-2">{`${balance} UNIC`}</span>
              <span className="text-light mr-2">Connected: {account}</span>
              <Button variant="outline-light" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="primary" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  <Container>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/projects" component={Projects} />
    </Switch>
  </Container>
  <footer className="mt-4 text-center">
    <p>UNCollaboration Platform &copy; {new Date().getFullYear()}</p>
  </footer>
</Router>
);
};

export default Main;



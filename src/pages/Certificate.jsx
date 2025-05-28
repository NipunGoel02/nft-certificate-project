// src/pages/Certificate.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ethers } from 'ethers'; // Ethers.js import kiya
import axios from 'axios';
import html2canvas from 'html2canvas';
import { useAuth } from '../Context/AuthContext';

// Pinata credentials
const PINATA_API_KEY = '073a6be7ca3053e2f986';
const PINATA_API_SECRET = 'e124cf0ef9fdfb9e9409e69e058bcb129320abdc68c0aab97972a8dd9e4d2c4a';



// Image ko IPFS pe upload karne ka function
const uploadImageToPinata = async (canvas) => {
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  const formData = new FormData();
  formData.append('file', blob, 'certificate.png');

  const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
    maxBodyLength: 'Infinity',
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });

  return `ipfs://${res.data.IpfsHash}`;
};

// Metadata ko IPFS pe upload karne ka function
const uploadMetadataToPinata = async (metadata) => {
  const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
  return `ipfs://${res.data.IpfsHash}`;
};



const Certificate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const certificateRef = useRef(null);
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load certificate data');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      // Check if we're on the correct network (Sepolia)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') { // Sepolia chain ID
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'SEP',
                    decimals: 18,
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      setWalletAddress(address);
      try {
        // Save wallet address to backend
        const token = localStorage.getItem('token');
        console.log('Saving wallet address with token:', token);
        await axios.patch('http://localhost:5000/api/auth/wallet', { walletAddress: address }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Wallet address saved successfully');
      } catch (err) {
        console.error('Failed to save wallet address:', err);
        alert('Failed to save wallet address. Please try again.');
      }
      setWalletConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(error.message);
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleMintNFT = async () => {
    if (!walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsMinting(true);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }
       // Certificate ko image mein convert karo
    const canvas = await html2canvas(certificateRef.current);

    // Step 1: Image ko Pinata pe upload karo
    const imageURI = await uploadImageToPinata(canvas);

    // Step 2: Metadata banao
    const metadata = {
      name: `${course.title} Certificate`,
      description: `Certificate for completing ${course.title}`,
      image: imageURI,
      attributes: [
        { trait_type: "Course", value: course.title },
        { trait_type: "Recipient", value: currentUser?.name || "User" },
        { trait_type: "Date", value: currentDate }
      ]
    };

    // Step 3: Metadata ko Pinata pe upload karo
    const tokenURI = await uploadMetadataToPinata(metadata);
      // Get the contract ABI and address
      const contractABI =[
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721IncorrectOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721InsufficientApproval",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidApprover",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOperator",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidReceiver",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidSender",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721NonexistentToken",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_fromTokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_toTokenId",
                    "type": "uint256"
                }
            ],
            "name": "BatchMetadataUpdate",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "tokenURI",
                    "type": "string"
                }
            ],
            "name": "CertificateMinted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                }
            ],
            "name": "MetadataUpdate",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "tokenURI",
                    "type": "string"
                }
            ],
            "name": "mintCertificate",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

      // Replace with your actual contract address
      const contractAddress = "0xA30C990fcda532F85CA3C52c744A373F71FF0299"; // Sepolia network pe deployed contract address

      // Create a Web3 provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Generate a simple tokenURI (in production, you'd upload to IPFS)
      

      // Call the mintCertificate function
      const tx = await contract.mintCertificate(walletAddress, tokenURI);
      console.log("Transaction sent:", tx.hash);
      setTransactionHash(tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // Check if the transaction was successful
      if (receipt.status === 1) {
        setIsMinted(true);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/courses" 
            className="inline-block px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-300"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Congratulations on Completing the Course!</h1>
            <p className="text-gray-600 mb-6">
              You've successfully completed "{course.title}" and earned this certificate.
              Claim it as an NFT on the blockchain for permanent verification and add it to your digital wallet.
            </p>
            
            {/* Certificate Preview */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div 
                ref={certificateRef}
                className="relative bg-white border-8 border-teal-100 rounded-lg p-8 w-full max-w-3xl mx-auto"
                style={{ aspectRatio: '1.4/1' }}
              >
                <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-500 rounded-lg m-2 pointer-events-none"></div>
                
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-teal-800 mb-1">Certificate of Completion</h2>
                  <div className="w-40 h-1 bg-teal-500 mx-auto"></div>
                </div>
                
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-600 mb-2">This is to certify that</p>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentUser?.name || "User"}</h3>
                  <p className="text-lg text-gray-600">has successfully completed the course</p>
                  <h4 className="text-xl font-bold text-teal-700 mt-2">"{course.title}"</h4>
                </div>
                
                <div className="flex justify-between items-end mt-12">
                  <div className="text-center">
                    <div className="w-40 h-px bg-gray-400 mb-1"></div>
                    <p className="text-gray-600">{course.instructor.name}</p>
                    <p className="text-sm text-gray-500">{course.instructor.title}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-40 h-px bg-gray-400 mb-1"></div>
                    <p className="text-gray-600">Date Issued</p>
                    <p className="text-sm text-gray-500">{currentDate}</p>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                  Certificate ID: CERT-{courseId}-{Date.now().toString().slice(-6)}
                </div>
                
                <div className="absolute bottom-4 left-4">
                  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 92C73.196 92 92 73.196 92 50C92 26.804 73.196 8 50 8C26.804 8 8 26.804 8 50C8 73.196 26.804 92 50 92Z" stroke="#0D9488" strokeWidth="4"/>
                    <path d="M50 75V50M50 50V25M50 50H75M50 50H25" stroke="#0D9488" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              {!walletConnected ? (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnectingWallet}
                  className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-400"
                >
                  {isConnectingWallet ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Connecting Wallet...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Connect Wallet to Claim NFT
                    </>
                  )}
                </button>
              ) : !isMinted ? (
                <button
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors duration-300 flex items-center justify-center disabled:bg-gray-400"
                >
                  {isMinting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      Claim as NFT
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center cursor-default"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  NFT Claimed Successfully
                </button>
              )}
            </div>
          </div>
          
          {/* Wallet & NFT Details */}
          {walletConnected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Wallet & NFT Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Connected Wallet</h3>
                  <div className="flex items-center">
                    <div className="bg-teal-100 text-teal-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                    <span className="text-gray-800 font-medium">{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</span>
                  </div>
                </div>
                
                {isMinted && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Transaction Hash</h3>
                      <div className="flex items-center">
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:text-teal-700 transition-colors duration-300"
                        >
                          {`${transactionHash.substring(0, 10)}...${transactionHash.substring(transactionHash.length - 10)}`}
                          <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">NFT Status</h3>
                      <div className="flex items-center">
                        <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                          Verified on Blockchain
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-gray-600">
                        Your certificate has been permanently recorded on the blockchain as an NFT. 
                        This provides immutable proof of your achievement that can be verified by anyone.
                      </p>
                    </div>
                    
                    <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-100">
                      <h3 className="font-medium text-teal-800 mb-2">NFT Added to Your Wallet</h3>
                      <p className="text-gray-600 mb-4">
                        Your NFT certificate has been added to your wallet. You can view it in your wallet's NFT collection.
                      </p>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-sm text-teal-600">
                          To view in MetaMask: Open MetaMask → NFTs tab → Your certificate should appear there
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificate;

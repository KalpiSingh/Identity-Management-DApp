import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import configuration from '../build/contracts/Identity.json';

const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    alert('MetaMask is not installed. Please install MetaMask to use this dApp!');
}

// Create a Web3 instance using the MetaMask provider
const web3 = new Web3(window.ethereum);

// Define the contract instance
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let account;

const accountEl = document.getElementById('account');
const registerButton = document.getElementById('registerButton');
const displayButton = document.getElementById('displayButton');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const userDetailsEl = document.getElementById('userDetails');
const displayNameInput = document.getElementById('displayNameInput');
const displayEmailInput = document.getElementById('displayEmailInput');

// Function to update the displayed account information
const updateAccountInfo = async () => {
    const accounts = await web3.eth.getAccounts();
    account = accounts[0];
    accountEl.innerText = account;
    // Store the connection status in session storage
    sessionStorage.setItem('isConnected', 'true');
};

// Main function to connect to MetaMask and get the user's account
const main = async () => {
    try {
        // Check if the session is already connected
        const isConnected = sessionStorage.getItem('isConnected');
        if (!isConnected) {
            // Request account access if needed
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Update the displayed account information
            await updateAccountInfo();
        } else {
            await updateAccountInfo();
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', async () => {
            await updateAccountInfo();
        });
    } catch (error) {
        console.error('User denied account access', error);
        alert('Please connect to MetaMask.');
    }
}


const checkMetaMaskConnection = async () => {
    const isConnected = sessionStorage.getItem('isConnected');
    if (!isConnected) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            await updateAccountInfo();
        } catch (error) {
            console.error('User denied account access', error);
            alert('Please connect to MetaMask.');
            throw new Error('MetaMask not connected');
        }
    }
}

const registerIdentity = async () => {
    try {
        await checkMetaMaskConnection();
    } catch (error) {
        return;
    }

    if (account) {
        const name = nameInput.value;
        const email = emailInput.value;
        if(name=="" || email==""){
            alert("Please enter avalid value!");
        }
        else{
            try {
                // MetaMask will prompt the user to confirm this transaction
                await contract.methods.registerIdentity(name, email).send({ from: account, gas: 2000000 });
    
                alert('Identity registered successfully!');
            } catch (error) {
                alert('Failed to register identity: Identity already registered!');
            }

        }
       
    }
}

const displayIdentity = async () => {
    try {
        await checkMetaMaskConnection();
    } catch (error) {
        return;
    }

    if (account) {
        const name = displayNameInput.value;
        const email = displayEmailInput.value;
        if(name=="" || email==""){
            alert("Please enter avalid value!");
        }
        else{
            try {
                const userInfo = await contract.methods.displayDetails(name, email).call();
                if (userInfo[0]) {
                    userDetailsEl.innerHTML = `
                        <p><strong>Name:</strong> ${userInfo[1]}</p>
                        <p><strong>Email:</strong> ${userInfo[2]}</p>
                        <p><strong>Verified:</strong> Yes</p>
                    `;
                } else {
                    userDetailsEl.innerHTML = `
                        <p><strong>User not verified or registered</strong></p>
                    `;
                }
            } catch (error) {
                alert('Failed to retrieve user details: ' + error.message);
            }

        }

        
    }
}

// Event listeners for the "Register" button and the "Display Details" button
registerButton.addEventListener('click', registerIdentity);
displayButton.addEventListener('click', displayIdentity);

// Listen for beforeunload event to perform cleanup
window.addEventListener('beforeunload', () => {
    // Clear session storage
    sessionStorage.clear();
    // Disable MetaMask connection
    if (window.ethereum && window.ethereum.selectedAddress) {
        window.ethereum.selectedAddress = null;
    }
});

main();

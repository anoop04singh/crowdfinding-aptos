// src/App.js
import React, { useState } from 'react';
import { connectWallet, createCampaign, viewCampaign, contribute } from './utils/aptosClient';

function App() {
  const [userAccount, setUserAccount] = useState(null);
  const [goalAmount, setGoalAmount] = useState('');
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

  // Connect wallet on button click
  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      setUserAccount(account);
      console.log('Connected account:', account.address);
    } catch (error) {
      alert('Failed to connect wallet.');
    }
  };

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    if (!goalAmount) return;
    try {
      await createCampaign(goalAmount, userAccount.address);
      alert('Campaign created successfully!');
    } catch (error) {
      alert('Error creating campaign.');
    }
  };

  // Fetch and display campaign details
  const handleViewCampaign = async () => {
    try {
      const campaign = await viewCampaign(userAccount.address);
      setCampaignDetails(campaign);
    } catch (error) {
      alert('Error fetching campaign.');
    }
  };

  // Handle contribution to campaign
  const handleContribute = async () => {
    if (!contributionAmount) return;
    try {
      await contribute(userAccount.address, contributionAmount);
      alert('Contribution successful!');
    } catch (error) {
      alert('Error contributing.');
    }
  };

  return (
    <div>
      <h1>Crowdfunding on Aptos</h1>

      <button onClick={handleConnectWallet}>Connect Wallet</button>

      {userAccount && <p>Connected account: {userAccount.address}</p>}

      <h2>Create Campaign</h2>
      <input
        type="number"
        value={goalAmount}
        onChange={(e) => setGoalAmount(e.target.value)}
        placeholder="Goal Amount"
      />
      <button onClick={handleCreateCampaign}>Create Campaign</button>

      <h2>View Campaign</h2>
      <button onClick={handleViewCampaign}>View Campaign</button>
      {campaignDetails && (
        <div>
          <p>Goal: {campaignDetails.goal_amount}</p>
          <p>Current: {campaignDetails.current_amount}</p>
          <p>Active: {campaignDetails.active ? 'Yes' : 'No'}</p>
        </div>
      )}

      <h2>Contribute to Campaign</h2>
      <input
        type="number"
        value={contributionAmount}
        onChange={(e) => setContributionAmount(e.target.value)}
        placeholder="Contribution Amount"
      />
      <button onClick={handleContribute}>Contribute</button>
    </div>
  );
}

export default App;

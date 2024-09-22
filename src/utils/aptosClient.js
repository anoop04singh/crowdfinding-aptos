// src/utils/aptosClient.js
import { AptosClient } from 'aptos';

// Initialize Aptos client with devnet node
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

// Function to connect to the Aptos wallet
export const connectWallet = async () => {
  if (window.aptos) {
    const response = await window.aptos.connect();
    return response;
  } else {
    throw new Error('Aptos wallet not installed.');
  }
};

// Function to create a new campaign
export const createCampaign = async (goalAmount, accountAddress) => {
  const payload = {
    type: 'entry_function_payload',
    function: '0xa8b10ab4bf87b830aa1d6cc7c3e40825f28c0a8eb44ba3b1b2ce64e7fd79eaff::Crowdfunding::create_campaign',
    arguments: [goalAmount],
    type_arguments: [],
  };

  try {
    const transaction = await window.aptos.signAndSubmitTransaction(payload);
    console.log('Campaign Created:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

// Function to view a campaign
export const viewCampaign = async (accountAddress) => {
  try {
    const resource = await client.getAccountResource(
      accountAddress,
      '0xa8b10ab4bf87b830aa1d6cc7c3e40825f28c0a8eb44ba3b1b2ce64e7fd79eaff::Crowdfunding::Campaigns'
    );
    return resource.data.campaigns[0];
  } catch (error) {
    console.error('Error viewing campaign:', error);
    throw error;
  }
};

// Function to contribute to a campaign
export const contribute = async (campaignOwner, amount) => {
  const payload = {
    type: 'entry_function_payload',
    function: '0xa8b10ab4bf87b830aa1d6cc7c3e40825f28c0a8eb44ba3b1b2ce64e7fd79eaff::Crowdfunding::contribute',
    arguments: [campaignOwner, amount],
    type_arguments: [],
  };

  try {
    const transaction = await window.aptos.signAndSubmitTransaction(payload);
    console.log('Contributed:', transaction);
    return transaction;
  } catch (error) {
    console.error('Error contributing to campaign:', error);
    throw error;
  }
};

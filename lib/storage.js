const fs = require('fs');
const path = require('path');

// File paths for storage (Vercel /tmp directory)
const PAYMENT_LINKS_FILE = '/tmp/payment-links.json';
const TRANSACTIONS_FILE = '/tmp/transactions.json';

// Payment Links Storage
function loadPaymentLinks() {
  try {
    if (fs.existsSync(PAYMENT_LINKS_FILE)) {
      const data = fs.readFileSync(PAYMENT_LINKS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading payment links:', error);
  }
  return [];
}

function savePaymentLinks(paymentLinks) {
  try {
    fs.writeFileSync(PAYMENT_LINKS_FILE, JSON.stringify(paymentLinks, null, 2));
  } catch (error) {
    console.error('Error saving payment links:', error);
  }
}

function addPaymentLink(paymentLink) {
  const paymentLinks = loadPaymentLinks();
  paymentLinks.push({
    ...paymentLink,
    createdAt: new Date().toISOString()
  });
  savePaymentLinks(paymentLinks);
  return paymentLink;
}

// Transactions Storage
function loadTransactions() {
  try {
    if (fs.existsSync(TRANSACTIONS_FILE)) {
      const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
  return [];
}

function saveTransactions(transactions) {
  try {
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
}

function addTransaction(transaction) {
  const transactions = loadTransactions();
  transactions.push({
    ...transaction,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  });
  saveTransactions(transactions);
  return transaction;
}

module.exports = {
  // Payment Links
  loadPaymentLinks,
  savePaymentLinks,
  addPaymentLink,
  
  // Transactions
  loadTransactions,
  saveTransactions,
  addTransaction
};
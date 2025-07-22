// Import/Export transactions store để share với các endpoints khác
const fs = require('fs');
const path = require('path');

// Simple file-based storage (trong production dùng database)
const STORAGE_FILE = '/tmp/transactions.json';

// Load transactions từ storage
function loadTransactions() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
  return [];
}

// Save transactions to storage
function saveTransactions(transactions) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const webhookData = req.body;
    console.log("📥 PayOS Webhook received:", webhookData);

    // Map status
    const mapStatus = (status) => {
      if (["SUCCEEDED", "SUCCESS", "PAID"].includes(status)) return "PAID";
      if (["CANCELED", "CANCELLED"].includes(status)) return "CANCELED";
      return status;
    };

    // Load existing transactions
    const transactions = loadTransactions();

    // Create new transaction
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderCode: webhookData.orderCode,
      amount: webhookData.amount,
      status: mapStatus(webhookData.status),
      bankName: webhookData.bankCode || webhookData.bankName || "Other",
      channelName: webhookData.channelCode || webhookData.channelName || "Other",
      description: webhookData.description,
      createdAt: new Date().toISOString(),
      webhookData: webhookData // Store full webhook data for debugging
    };

    // Add to transactions
    transactions.push(transaction);

    // Save transactions
    saveTransactions(transactions);

    console.log("💾 Transaction stored:", transaction);

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
};
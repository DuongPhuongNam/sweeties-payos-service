const { loadTransactions } = require("../lib/storage");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    // Load from shared storage
    const transactions = loadTransactions();
    
    // Sort by newest first
    const sortedTransactions = transactions.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    console.log(`📋 Retrieved ${transactions.length} transactions`);

    res.status(200).json({
      success: true,
      data: sortedTransactions,
      total: sortedTransactions.length
    });
  } catch (error) {
    console.error("❌ Get transactions error:", error);
    res.status(500).json({ error: error.message });
  }
};
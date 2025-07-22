const { loadTransactions } = require("../../lib/storage");

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
    // Load transactions from shared storage
    const allTransactions = loadTransactions();
    console.log(`📊 Loaded ${allTransactions.length} total transactions`);
    
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayTransactions = allTransactions.filter(t => {
      const transactionDate = new Date(t.createdAt);
      const isToday = transactionDate >= startOfDay && transactionDate <= endOfDay;
      const isPaid = t.status === "PAID";
      return isToday && isPaid;
    });

    const totalRevenue = todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalOrders = todayTransactions.length;

    console.log(`📈 Today stats: ${totalOrders} orders, ${totalRevenue} VND`);

    res.status(200).json({
      totalRevenue,
      totalOrders,
      transactions: todayTransactions,
      date: new Date().toDateString(),
      debug: {
        totalTransactionsInDB: allTransactions.length,
        todayTransactionsCount: todayTransactions.length
      }
    });
  } catch (error) {
    console.error("❌ Stats error:", error);
    res.status(500).json({ error: error.message });
  }
};
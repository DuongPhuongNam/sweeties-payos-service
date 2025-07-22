// In-memory store cho transactions
let transactionsStore = [];

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

    // Store transaction
    const transaction = {
      orderCode: webhookData.orderCode,
      amount: webhookData.amount,
      status: mapStatus(webhookData.status),
      bankName: webhookData.bankCode || webhookData.bankName || "Other",
      channelName: webhookData.channelCode || webhookData.channelName || "Other",
      description: webhookData.description,
      createdAt: new Date().toISOString(),
    };

    transactionsStore.push(transaction);
    console.log("💾 Transaction stored:", transaction);

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
};
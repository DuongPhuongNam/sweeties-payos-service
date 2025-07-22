const payos = require("../lib/payos");

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
    const { orderCode } = req.query;
    
    if (!orderCode) {
      return res.status(400).json({ error: "orderCode is required" });
    }

    const data = await payos.getPaymentLinkInformation(orderCode);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Get payment error:", error);
    res.status(500).json({ error: error.message });
  }
};
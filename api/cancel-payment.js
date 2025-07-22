const payos = require("../lib/payos");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "PUT") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { orderCode } = req.query;
    const { cancellationReason } = req.body;
    
    if (!orderCode) {
      return res.status(400).json({ error: "orderCode is required" });
    }

    const result = await payos.cancelPaymentLink(
      orderCode, 
      cancellationReason || "User requested cancellation"
    );
    
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Cancel payment error:", error);
    res.status(500).json({ error: error.message });
  }
};
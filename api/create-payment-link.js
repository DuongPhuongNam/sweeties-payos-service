const payos = require("../lib/payos");
const { addPaymentLink } = require("../lib/storage");

module.exports = async (req, res) => {
  // CORS headers
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
    const { orderCode, amount, description } = req.body;

    if (!orderCode || !amount || !description) {
      return res.status(400).json({ 
        error: "Missing required fields: orderCode, amount, description" 
      });
    }

    const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN || "http://localhost:5173";
    
    const paymentData = {
      orderCode: parseInt(orderCode),
      amount: parseInt(amount),
      description,
      returnUrl: `${FRONTEND_DOMAIN}/return-url`,
      cancelUrl: `${FRONTEND_DOMAIN}/cancel-url`,
    };

    console.log("Creating payment with data:", paymentData);

    const paymentLink = await payos.createPaymentLink(paymentData);
    
    // Store using shared storage
    addPaymentLink(paymentLink);

    res.status(200).json(paymentLink);
  } catch (error) {
    console.error("❌ Create payment error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to create payment link" 
    });
  }
};
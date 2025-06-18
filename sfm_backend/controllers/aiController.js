const pdfParse = require("pdf-parse");
const axios = require("axios");

exports.handlePDFUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const summary = await queryGeminiSummary(pdfData.text);

    res.json({ summary });
  } catch (err) {
    console.error("PDF Upload Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Error processing PDF." });
  }
};

exports.handleTextQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const summary = await queryGeminiSummary(query);
    res.json({ summary });
  } catch (err) {
    console.error("Text Query Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Error processing query." });
  }
};

// ✅ FIXED FUNCTION
async function queryGeminiSummary(text) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  console.log("🔑 Using API Key:", process.env.GEMINI_API_KEY);

  const payload = {
    contents: [{ parts: [{ text }] }],
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const candidates = response.data?.candidates;
    return (
      candidates?.[0]?.content?.parts?.[0]?.text || "❌ No response from Gemini"
    );
  } catch (err) {
    // Log full response error for diagnosis
    console.error("❌ Gemini API Error:", err.response?.data || err.message);
    throw err; // rethrow to be caught in handleTextQuery
  }
}

const axios = require("axios");

const solveDoubt = async (req, res) => {
  try {
          console.log("API KEY:", process.env.OPENROUTER_API_KEY);
    const { messages, title, description } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // ✅ free model
        messages: [
          {
            role: "system",
            content: `
You are an expert DSA instructor.

Problem:
${title}

Description:
${description}

Guide the user step by step. Do not directly give full solution unless asked.
            `
          },
          ...messages.map(msg => ({
  role: msg.role === "model" ? "assistant" : "user",
  content: msg.parts?.[0]?.text || ""
}))
        ]
      },
      {
        headers: {
         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiMessage =
      response.data.choices?.[0]?.message?.content || "No response";

    res.status(200).json({ message: aiMessage });

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);

    res.status(500).json({
      message: "AI failed"
    });
  }
};

module.exports = { solveDoubt };
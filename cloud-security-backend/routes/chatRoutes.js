const express = require('express');
const router = express.Router();
const { OpenAI } = require("openai");

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/fireworks-ai/inference/v1",
  apiKey: process.env.HF_TOKEN,
});

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  try {
    const chatCompletion = await client.chat.completions.create({
      model: "accounts/fireworks/models/deepseek-r1-0528",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const responseText = chatCompletion.choices[0].message.content;
    res.json({ response: responseText });

  } catch (error) {
    console.error("Erreur HF:", error);
    res.status(500).json({ error: "Erreur côté serveur Hugging Face" });
  }
});

module.exports = router;

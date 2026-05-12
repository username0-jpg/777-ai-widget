require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const app = express();
const businesses = require("./businesses.json");
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {

  try {

    const userMessage = req.body.message;

    // EMAIL DETECTION
    const emailMatch = userMessage.match(
      /[^\s@]+@[^\s@]+\.[^\s@]+/
    );

    if (emailMatch) {

      const lead = {

        email: emailMatch[0],

        message: userMessage,

        date: new Date()

      };

      fs.appendFileSync(
        "leads.txt",
        JSON.stringify(lead) + "\n"
      );

      console.log("Lead saved:", lead);

    }

    const completion = await openai.chat.completions.create({

      model: "gpt-4o-mini",

      messages: [

        {
          role: "system",

          content: `
You are an AI assistant for 777LuckyDraws.

Your job:
- answer customer questions
- help users understand competitions
- encourage signups
- be friendly and professional
- keep responses short

IMPORTANT:
- try to collect the user's:
  - name
  - email
  - phone number

- if someone is interested, politely ask for their contact details

Rules:
- never invent information
- if unsure, ask customer to contact support
`
        },

        {
          role: "user",
          content: userMessage
        }

      ]

    });

    console.log(completion);

    res.json({
      reply:
        completion.choices?.[0]?.message?.content
        || "No AI response"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Something went wrong"
    });

  }

});

app.listen(3000, () => {

  console.log("Server running on port 3000");

});
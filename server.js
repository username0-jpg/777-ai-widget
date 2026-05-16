require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const { createClient } =
  require("@supabase/supabase-js");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

// OPENAI

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SUPABASE

const supabaseUrl =
  "https://kmcrbguumketxanqmdja.supabase.co";

const supabaseKey =
  process.env.SUPABASE_KEY;

const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );

// CHAT ROUTE

app.post("/chat", async (req, res) => {

  try {

    const userMessage =
      req.body.message;

    const businessId =
      req.body.businessId
      || "777luckydraws";

    const userEmail =
      req.body.userEmail
      || "owner@777luckydraws.com";

    // LOAD SETTINGS

    const {
      data: settings,
      error: settingsError
    } = await supabase
      .from("business_settings")
      .select("*")
      .eq(
        "business_id",
        businessId
      )
      .single();

    if (settingsError) {

      throw settingsError;

    }

    // EMAIL DETECTION

    const emailMatch =
      userMessage.match(
        /[^\s@]+@[^\s@]+\.[^\s@]+/
      );

    // SAVE LEAD

    if (emailMatch) {

      await supabase
        .from("leads")
        .insert([
          {
            email: emailMatch[0],
            message: userMessage,
            business_id: businessId,
            user_email: userEmail
          }
        ]);

    }

    // AI RESPONSE

    const completion =
      await openai.chat.completions.create({

        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `

${settings.ai_prompt}

IMPORTANT:
- keep responses short
- be friendly
- collect customer details politely
- encourage signups

Rules:
- never invent information
- if unsure tell user to contact support

`
          },

          {
            role: "user",
            content: userMessage
          }

        ]

      });

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

// GET LEADS

app.get("/leads", async (req, res) => {

  try {

    const userEmail =
      req.query.userEmail;

    const {
      data,
      error
    } = await supabase
      .from("leads")
      .select("*")
      .eq(
        "user_email",
        userEmail
      )
      .order(
        "created_at",
        { ascending: false }
      );

    if (error) {

      throw error;

    }

    res.json(data);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Error loading leads"
    );

  }

});

// GET SETTINGS

app.get("/settings", async (req, res) => {

  try {

    const businessId =
      req.query.businessId;

    const {
      data,
      error
    } = await supabase
      .from("business_settings")
      .select("*")
      .eq(
        "business_id",
        businessId
      )
      .single();

    if (error) {

      throw error;

    }

    res.json(data);

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Error loading settings"
    );

  }

});

// SAVE SETTINGS

app.post("/settings", async (req, res) => {

  try {

    const {
      businessId,
      businessName,
      aiPrompt,
      primaryColor
    } = req.body;

    const {
      error
    } = await supabase
      .from("business_settings")
      .update({

        business_name:
          businessName,

        ai_prompt:
          aiPrompt,

        primary_color:
          primaryColor

      })
      .eq(
        "business_id",
        businessId
      );

    if (error) {

      throw error;

    }

    res.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    res.status(500).send(
      "Error saving settings"
    );

  }

});

// CREATE BUSINESS

app.post("/create-business", async (req, res) => {

  try {

    const {
      businessId,
      businessName,
      userEmail,
      aiPrompt,
      primaryColor
    } = req.body;

    const {
      error
    } = await supabase
      .from("business_settings")
      .insert([
        {
          business_id:
            businessId,

          user_email:
            userEmail,

          business_name:
            businessName,

          ai_prompt:
            aiPrompt,

          primary_color:
            primaryColor
        }
      ]);

    if (error) {

      throw error;

    }

    const widgetCode = `

<script
  src="http://localhost:5500/widget.js"
  data-business="${businessId}"
></script>

`;

    res.json({

      success: true,

      widgetCode

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        "Error creating business"
    });

  }

});

// TEST SUPABASE

app.get("/test-supabase", async (req, res) => {

  const {
    data,
    error
  } = await supabase
    .from("leads")
    .insert([
      {
        email: "test@gmail.com",
        message: "test message",
        business_id: "777luckydraws",
        user_email:
          "owner@777luckydraws.com"
      }
    ]);

  res.json({
    data,
    error
  });

});

// START SERVER

app.listen(3000, () => {

  console.log(
    "Server running on port 3000"
  );

});
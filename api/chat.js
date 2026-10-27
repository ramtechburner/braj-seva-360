
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_INSTRUCTIONS = `
You are Braj AI Yatra Guide for Braj Seva 360.
Help tourists visiting Mathura, Vrindavan, Govardhan,
Barsana and nearby Braj destinations.

Reply in the language the user uses: Hindi or English.
If the user mixes Hindi and English, you may do the same.
Be polite, practical, concise and culturally respectful.

Help with itineraries, temples, transport planning, food,
hotel-selection tips, local businesses and tourist problems.
Ask a short follow-up question when essential details are missing.

Never invent live opening hours, prices, availability, phone
numbers, traffic conditions or official temple rules.
Clearly say when information needs verification.
Do not claim a booking or payment has been made.
For urgent safety issues, recommend contacting local emergency
services or the relevant official authority.
`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "AI is not configured yet. Please try again later."
    });
  }

  try {
    const { messages } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please send a message."
      });
    }

    // Keep only recent user/assistant messages and limit input size.
    const safeMessages = messages.slice(-10).map((message) => {
      if (
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        message.content.length > 2000
      ) {
        throw new Error("Invalid message format.");
      }

      return {
        role: message.role,
        content: message.content
      };
    });

    if (safeMessages[safeMessages.length - 1].role !== "user") {
      return res.status(400).json({
        error: "The last message must be from the user."
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-astra",
      instructions: SYSTEM_INSTRUCTIONS,
      input: safeMessages.map((message) => ({
        role: message.role,
        content: message.content
      })),
      max_output_tokens: 700
    });

    return res.status(200).json({
      reply: response.output_text || "Sorry, please try asking another way."
    });
  } catch (error) {
    console.error("Braj AI chat error:", error.message);

    return res.status(500).json({
      error: "Sorry, the guide is temporarily unavailable. Please try again."
    });
  }
}

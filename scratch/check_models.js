const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    // Note: The listModels method might not be in all v0.x versions of the SDK 
    // but we can try to find it or use fetch
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // dummy
    console.log("Checking model service...");
    // Since we don't have a direct listModels in the simple SDK wrapper sometimes, 
    // let's just try gemini-2.0-flash
  } catch (err) {
    console.error(err);
  }
}

listModels();

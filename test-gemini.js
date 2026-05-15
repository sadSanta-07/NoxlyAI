const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "c:/Users/iffco/OneDrive/Desktop/peblo-ai-workspace/.env" });

async function run() {
  try {
    console.log("Key starting with:", process.env.GEMINI_API_KEY?.substring(0, 5));
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch(e) {
    console.error("ERROR", e);
  }
}
run();

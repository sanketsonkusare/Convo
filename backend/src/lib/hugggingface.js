import axios from "axios";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API;
const HF_MODEL_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";


export const queryHuggingFace = async (text) => {
  try {
    const response = await axios.post(
      HF_MODEL_URL,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Some models return array of responses
    const data = response.data;
    if (Array.isArray(data)) {
      return data[0]?.generated_text || "Sorry, I couldn't understand that.";
    } else if (typeof data.generated_text === "string") {
      return data.generated_text;
    }

    return "AI failed to generate response.";
  } catch (err) {
    console.error("Hugging Face API Error:", err.message);
    return "AI could not process your request.";
  }
};

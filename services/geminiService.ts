import { GoogleGenAI, Type } from "@google/genai";

export async function fetchPopulationInsights() {
  // Use the required initialization format
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Provide a detailed yet concise analysis of current global population trends. 
  Focus on the regions with highest birth rates and the socio-economic implications for the next 20 years.
  Format the response as JSON with properties: summary (string), keyPoints (array of strings), projection (string).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            projection: { type: Type.STRING }
          },
          required: ["summary", "keyPoints", "projection"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback data if the API call fails or key is missing
    return {
      summary: "Global birth patterns are shifting towards Africa and South Asia, while many developed nations face declining birth rates.",
      keyPoints: [
        "Rapid growth in Sub-Saharan Africa is reshaping global demographics.",
        "Aging populations in East Asia and Europe pose economic challenges.",
        "Urbanization continues to influence family size worldwide."
      ],
      projection: "The world population is expected to reach 9.7 billion by 2050, driven primarily by 8 countries."
    };
  }
}
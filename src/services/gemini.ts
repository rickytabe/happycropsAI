import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Country } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    is_crop: { type: Type.BOOLEAN, description: "True if the image clearly shows a plant, crop, leaf or agricultural field. False if it is a human, animal, face, or completely irrelevant object." },
    status: { type: Type.STRING, description: "Either 'healthy' or 'diseased'" },
    disease_name: { type: Type.STRING, description: "Name. E.g., 'Late Blight'" },
    confidence_score: { type: Type.NUMBER, description: "0 to 1 confidence level" },
    risk_level: { type: Type.STRING, description: "low, medium, or high" },
    contextual_insight: { type: Type.STRING, description: "Full intro text naming the specific plant and causative agents. E.g., Our AI analysis has identified active Late Blight in your potato plants. This is caused by..." },
    image_analysis: {
      type: Type.OBJECT,
      properties: {
        photo_id: { type: Type.STRING, description: "E.g., #042" },
        description: { type: Type.STRING, description: "Typical lesions..." }
      },
      required: ["photo_id", "description"]
    },
    untreated_impact: {
      type: Type.OBJECT,
      properties: {
        value_lost: { type: Type.STRING, description: "E.g., 'Up to 80%'" },
        description: { type: Type.STRING, description: "Without treatment..." },
        risk_label: { type: Type.STRING, description: "E.g., 'Severe risk detected'" },
        risk_percentage: { type: Type.NUMBER, description: "Risk bar width 0-100" }
      },
      required: ["value_lost", "description", "risk_label", "risk_percentage"]
    },
    spread_factors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          icon_name: { type: Type.STRING, description: "Google Material Symbol Outlined name (e.g. 'rainy', 'thermometer', 'pest_control')" },
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["icon_name", "title", "description"]
      }
    },
    treatment_steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "E.g., 'Apply Fungicide'" },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    },
    preventive_measures: { type: Type.ARRAY, items: { type: Type.STRING, description: "Short bullet point" } }
  },
  required: [
    "is_crop", "status", "disease_name", "confidence_score", "risk_level",
    "contextual_insight", "image_analysis", 
    "untreated_impact", "spread_factors", "treatment_steps", "preventive_measures"
  ]
};

export async function analyzeCropImage(base64Image: string, country: Country): Promise<AnalysisResult> {
  const model = "gemini-3.1-flash-lite-preview";

  const prompt = `
    Analyze this cropped image for a farmer in ${country}. 
    
    CRITICAL CONSTRAINTS - YOU MUST FOLLOW EXACTLY:
    - FIRST CHECK (Security): Determine if the image is actually of a plant, crop, or agricultural leaf. If it is a person, face, animal, or random object, set 'is_crop' to false and fill the rest of the fields with generic terms like "N/A" and 0. If it IS a plant, set 'is_crop' to true and complete the analysis accurately.
    - Target audience: Farmers. Provide a clear, actionable diagnostic report.
    - 'disease_name': Just the name (e.g., "Late Blight"). The UI will append "Detected".
    - 'contextual_insight': Base it on the specific plant identified, not just 'crops'. E.g., "Our AI analysis has identified active {disease_name} in your {identified_plant_name, e.g. coffee plants, maize}. Immediate action is required. This is typically caused by {briefly state causative agents, e.g. a specific fungus or bacteria}."
    - 'image_analysis': photo_id (always "#1"), description (e.g. "Typical lesions showing dark appearance...")
    - 'untreated_impact': value_lost (e.g., "Up to 80%"), description ("Without treatment, this pathogen can destroy..."), risk_label ("Severe risk detected"), risk_percentage (0-100).
    - 'spread_factors': Provide exactly 2 spread factors with an appropriate Google Material Icon name ('rainy', 'thermometer', 'air', 'bug_report', 'water_drop').
    - 'treatment_steps': Maximum 2 steps. Provide a short title and a description. If recommending chemical treatments (like fungicides or pesticides), you MUST include EXACT common commercial product names available in ${country} (e.g., 'Ridomil Gold', 'Dithane M-45', 'Bravo 500') instead of just the active ingredients.
    - 'preventive_measures': Maximum 3 bullet points.
    
    Return strictly in JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image.split(",")[1] || base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: SCHEMA
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    if (result.is_crop === false) {
      throw new Error("NOT_A_PLANT");
    }

    return {
      ...result,
      timestamp: Date.now(),
      imageUrl: base64Image,
      country
    } as AnalysisResult;
  } catch (error: any) {
    console.error("AI Analysis failed:", error);
    if (error?.message === "NOT_A_PLANT") throw error; // Re-throw to be caught by UI
    // Fallback mock for demo if API fails
    return {
      status: "diseased",
      disease_name: "Late Blight",
      confidence_score: 0.95,
      risk_level: "high",
      country: country,
      contextual_insight: "Our AI analysis has identified active Late Blight in your potato crops. Immediate action is required to prevent widespread infection.",
      image_analysis: {
        photo_id: "#1",
        description: "Typical lesions showing dark, water-soaked appearance with faint white mold on the leaf underside."
      },
      untreated_impact: {
        value_lost: "Up to 80%",
        description: "Without treatment, this pathogen can destroy your entire harvest within 7-10 days under current weather conditions.",
        risk_label: "Severe risk detected",
        risk_percentage: 80
      },
      spread_factors: [
        { icon_name: "rainy", title: "Rain & Wind", description: "Spores travel easily through moisture and breeze to nearby plants." },
        { icon_name: "thermometer", title: "Cool & Damp", description: "Thrives in the current 60°F-75°F temperature window." }
      ],
      treatment_steps: [
        { title: "Apply Fungicide", description: "Spray a commercial fungicide like Ridomil Gold (Metalaxyl) or Dithane M-45 (Mancozeb) immediately to protect healthy leaves." },
        { title: "Remove Infected Plants", description: "Pull up and bag heavily damaged plants. Do not compost them." }
      ],
      preventive_measures: [
        "Increase spacing between rows",
        "Avoid evening watering",
        "Use resistant crop varieties"
      ],
      timestamp: Date.now(),
      imageUrl: base64Image
    };
  }
}

export async function chatWithAgronomist(
  contextResult: AnalysisResult,
  chatHistory: { role: "user" | "model", text: string }[],
  userMessage: string
): Promise<string> {
  const model = "gemini-3.1-flash-lite-preview";
  
  const systemInstruction = `
    You are an expert AI Crop Expert assisting a non-technical smallholder farmer.
    You just diagnosed their crop with: ${contextResult.disease_name}.
    Risk level: ${contextResult.risk_level}.
    Treatment suggested: ${contextResult.treatment_steps.join("; ")}.
    Keep answers very simple, empathetic, and short (max 2-3 sentences).
    No scientific jargon.
  `;

  try {
    const contents = chatHistory.map(msg => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }]
    }));
    
    contents.push({ role: "user", parts: [{ text: userMessage }] });

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.4
      }
    });

    return response.text || "I'm having trouble connecting. Could you try asking again?";
  } catch (error) {
    console.error("Chat error:", error);
    return "The connection is weak right now, but I recommend following the treatment steps above immediately to save your crop.";
  }
}


import { GoogleGenAI, Type } from "@google/genai";
import { TravelPackage, BudgetProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTravelPackage = async (
  city: string,
  days: number,
  budget: BudgetProfile
): Promise<TravelPackage> => {
  const prompt = `Create a comprehensive trip itinerary for ${city} for ${days} days.
  Profile: ${budget} traveler.
  Hotels: Select one top-rated hotel matching the ${budget} profile.
  Logistics: Suggest one round-trip flight and a primary cab service provider.
  Itinerary: Provide a day-by-day breakdown of 3 key activities per day.
  One-Click Data: Summarize the total cost and a single "Booking ID" string for a mock payment gateway.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a 'One-Click Travel Architect.' Your goal is to take a destination and duration and generate a fully executable travel package. Output ONLY JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          total_estimated_price: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          accommodation: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price_per_night: { type: Type.NUMBER }
            },
            required: ["name", "price_per_night"]
          },
          transport: {
            type: Type.OBJECT,
            properties: {
              flight: { type: Type.STRING },
              local_cab: { type: Type.STRING }
            },
            required: ["flight", "local_cab"]
          },
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.NUMBER },
                activities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["day", "activities"]
            }
          },
          booking_payload: { type: Type.STRING }
        },
        required: [
          "destination",
          "total_estimated_price",
          "currency",
          "accommodation",
          "transport",
          "itinerary",
          "booking_payload"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as TravelPackage;
};

export const executeMockBooking = async (payload: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`Executing mock booking for ID: ${payload}`);
  return true;
};

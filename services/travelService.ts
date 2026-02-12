
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPackage, BudgetProfile, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTravelPackage = async (
  city: string,
  departureDate: string,
  returnDate: string,
  budgetAmount: number,
  budgetProfile: BudgetProfile
): Promise<TravelPackage> => {
  const prompt = `Create a comprehensive "All-in-One" travel package for ${city}.
  Dates: From ${departureDate} to ${returnDate}.
  Budget: Maximum ${budgetAmount} (Profile: ${budgetProfile}).
  
  Details required:
  1. Hotels: One top-rated hotel matching the profile for the entire stay. Include a specific cancellation policy (e.g., "Free cancellation before [date]", "Non-refundable").
  2. Transport: At least two primary transport options (Flights/Train) for arrival/departure and one local transit provider (Cab/Bus). Include specific cancellation policies for each.
  3. Itinerary: 3 curated activities per day for the specific duration.
  4. Real-time Status: Mark all transport options with a status (e.g. "On Time", "Available").
  5. Booking Logic: Generate a total cost under the budget and a unique Booking ID.
  
  Use Google Search to find real, current prices, availability, and cancellation terms for these dates.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a 'One-Click Travel Architect.' Output ONLY a valid JSON object. Ensure the total price is realistically within the user's budget. Calculate the number of days between the departure and return dates provided.",
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          destination: { type: Type.STRING },
          total_estimated_price: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          departure_date: { type: Type.STRING },
          return_date: { type: Type.STRING },
          accommodation: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price_per_night: { type: Type.NUMBER },
              cancellation_policy: { type: Type.STRING }
            },
            required: ["name", "price_per_night", "cancellation_policy"]
          },
          transport: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mode: { type: Type.STRING, enum: ["Flight", "Train", "Bus", "Cab"] },
                provider: { type: Type.STRING },
                reference_number: { type: Type.STRING },
                departure_time: { type: Type.STRING },
                arrival_time: { type: Type.STRING },
                origin: { type: Type.STRING },
                destination: { type: Type.STRING },
                status: { type: Type.STRING },
                cancellation_policy: { type: Type.STRING }
              },
              required: ["mode", "provider", "reference_number", "departure_time", "arrival_time", "origin", "destination", "status", "cancellation_policy"]
            }
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
          "destination", "total_estimated_price", "currency", "accommodation", 
          "transport", "itinerary", "booking_payload", "departure_date", "return_date"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");

  const data = JSON.parse(text) as TravelPackage;

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    const sources: GroundingSource[] = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || 'Verified Source',
        uri: chunk.web?.uri || '#'
      }));
    data.grounding_sources = sources;
  }

  return data;
};

export const executeMockBooking = async (payload: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log(`Executing multi-segment booking for ID: ${payload}`);
  return true;
};

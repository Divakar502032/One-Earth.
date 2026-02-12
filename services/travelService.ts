
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPackage, BudgetProfile, GroundingSource, LocalEvent } from "../types";

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
  1. Hotels: One top-rated hotel matching the profile for the entire stay. Include a specific cancellation policy.
  2. Transport: Primary transport (Flights/Train) for arrival/departure and local transit (Cab/Bus). Include cancellation policies.
  3. Itinerary: 3 curated activities per day.
  4. Real-time Events: Use Google Search to find current important events, festivals, concerts, or exhibitions happening in ${city} specifically between ${departureDate} and ${returnDate}. Include titles, short descriptions, locations, and timings.
  5. Booking Logic: Total cost under budget and a unique Booking ID.
  
  Use Google Search for real-time grounding on prices and events.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are a 'One-Click Travel Architect.' Output ONLY a valid JSON object. Ensure the total price is realistically within the user's budget. Identify REAL events happening during the specified dates.",
      responseMimeType: "application/json",
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
          local_events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING },
                date_time: { type: Type.STRING }
              },
              required: ["title", "description", "location", "date_time"]
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
  return true;
};

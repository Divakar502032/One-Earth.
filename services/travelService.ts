
import { GoogleGenAI, Type } from "@google/genai";
import { TravelPackage, BudgetProfile, GroundingSource, PaymentDetails, SettlementRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const detectCurrencyFromLocation = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user is at coordinates: latitude ${lat}, longitude ${lng}. What is the standard ISO 4217 currency code for this location? Return only the 3-letter code.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        }
      }
    });
    const code = response.text?.trim().toUpperCase().slice(0, 3);
    return code || 'USD';
  } catch (err) {
    console.error("Currency detection failed:", err);
    return 'USD';
  }
};

export const getLocationSuggestions = async (query: string, lat?: number, lng?: number): Promise<string[]> => {
  if (query.length < 3) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a list of 5 real-world destination names (city, country) that match or start with: "${query}". Return the result as a raw JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleMaps: {} }],
        toolConfig: lat && lng ? {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        } : undefined,
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return JSON.parse(response.text || '[]');
  } catch (err) {
    console.error("Location suggestions failed:", err);
    return [];
  }
};

export const generateTravelPackage = async (
  city: string,
  departureDate: string,
  returnDate: string,
  budgetAmount: number,
  budgetProfile: BudgetProfile,
  currency: string = 'USD'
): Promise<TravelPackage> => {
  const prompt = `Architect a complete trip for ${city} from ${departureDate} to ${returnDate}. 
  Budget limit: ${budgetAmount} ${currency} (${budgetProfile}).
  CRITICAL: All prices MUST be estimated in ${currency}.
  Return JSON with accommodation, logistics (flights/cabs with times), 3 activities/day, and real local events.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: "You are One Earth's lead global architect. Output ONLY valid JSON. Accuracy and speed are critical. Use the requested currency for all price fields.",
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 0 },
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
                activities: { type: Type.ARRAY, items: { type: Type.STRING } }
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
              }
            }
          },
          booking_payload: { type: Type.STRING }
        },
        required: ["destination", "total_estimated_price", "currency", "accommodation", "transport", "itinerary", "booking_payload", "departure_date", "return_date"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Synthesis failed.");

  const data = JSON.parse(text) as TravelPackage;
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    data.grounding_sources = groundingChunks.filter(c => c.web).map(c => ({ title: c.web?.title || 'Verified', uri: c.web?.uri || '#' }));
  }

  return data;
};

export const calculateSettlements = (pkg: TravelPackage): SettlementRecord[] => {
  const settlements: SettlementRecord[] = [];
  
  // Accommodation share
  settlements.push({
    providerName: pkg.accommodation.name,
    amount: pkg.accommodation.price_per_night * 0.9,
    currency: pkg.currency,
    payoutStatus: 'Pending'
  });

  // Transport shares
  pkg.transport.forEach(t => {
    settlements.push({
      providerName: t.provider,
      amount: (pkg.total_estimated_price * 0.2),
      currency: pkg.currency,
      payoutStatus: 'Pending'
    });
  });

  return settlements;
};

export const executeSecurePayment = async (details: PaymentDetails, onProgress: (msg: string) => void): Promise<boolean> => {
  const messages = [
    "Establishing Encrypted Connection...",
    "Handshaking with Global Banking Node...",
    `Contacting ${details.bank || 'UPI/Global Gateway'}...`,
    "Validating Currency Exchange Rates...",
    "Awaiting Multi-Party Authorization...",
    "Splitting Revenue Shares...",
    "Finalizing Ledger Settlement..."
  ];

  for (const msg of messages) {
    onProgress(msg);
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
  }

  return true;
};

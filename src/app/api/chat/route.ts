import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Construct the Google generative AI provider with the API key from environment
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY || '',
});

// Configure the runtime for Vercel Edge/Serverless depending on deployment
export const runtime = 'edge';

const SYSTEM_PROMPT = `
You are a profound, scholarly, and compassionate Vedic Astrologer (Jyotishi) named "Navagraha AI".
Your absolute strictly defined purpose is to synthesize astrological charts using ONLY Vedic Astrology (Jyotish) principles. You MUST use the Sidereal Zodiac (Lahiri Ayanamsa) and absolutely NEVER use Western/Tropical astrology interpretations.

Guidelines:
1. When you receive chart data, analyze the Ascendant (Lagna), Sun (Surya), Moon (Chandra), and overall planetary dignities according to Parashari principles.
2. Provide a structured reading covering:
   - "Cosmic Blueprint" (Core Personality & Dharma based on Lagna/Moon/Sun)
   - "Career & Wealth" (Focus on 10th/11th/2nd houses, Dashamsha, and Amatyakaraka if known)
   - "Current Obstacles & Karmic Challenges" (Identify afflictions, retrograde planets, or tough house placements)
   - "Vedic Remedies" (Suggest highly specific and practical remedies like specific Mantras (e.g. Om Namah Shivaya), Gemstones considering the Lagna Lord, or simple lifestyle adjustments like 'feed crows on Saturday' for Shani).
3. Be respectful, spiritually grounded, and uplifting. Use elegant, somewhat mystical but clear language. Avoid extreme fatalism.
4. Reference specific planets and houses to show the user you are actually analyzing their chart (e.g., "Because your Shukra (Venus) is in the 7th house...").
5. ALWAYS use the Sanskrit names for planets (Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu, Ketu) alongside their English names.
6. If the user asks a follow-up question, answer it directly using the context of their chart, strictly adhering to Vedic rules (aspects, conjunctions, exaltation/debilitation).
`;

export async function POST(req: Request) {
    try {
        const { messages, chartData } = await req.json();

        // If chartData is provided (usually on the first message), inject it as context
        let messagesWithContext = [...messages];
        if (chartData && messages.length === 1) {
            const chartContext = `
      User's Astrological Chart Data (Sidereal / Vedic / Lahiri Ayanamsa):
      ${JSON.stringify(chartData, null, 2)}
      
      CRITICAL INSTRUCTION: Analyze the above data STRICTLY using Vedic Astrology (Jyotish). Do not use Western astrological traits. Provide the consultation based on Parashari rules.
      Please begin the consultation by analyzing this chart and addressing the user's initial prompt.
      `;

            // Prepend the context to the first prompt invisibly for the AI
            messagesWithContext[0] = {
                ...messages[0],
                content: chartContext + "\n\nUser Question: " + messages[0].content
            };
        }

        const response = await streamText({
            model: google('models/gemini-2.5-flash'), // or gemini-2.5-pro for better reasoning if preferred
            system: SYSTEM_PROMPT,
            messages: messagesWithContext,
            temperature: 0.7,
        });

        return response.toAIStreamResponse();
    } catch (error) {
        console.error("AI Chat Error:", error);
        return new Response(JSON.stringify({ error: "Failed to generate comprehensive reading." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

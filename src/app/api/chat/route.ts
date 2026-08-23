import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// OpenAI Configuration
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

// Google Gemini Configuration (High-reliability fallback)
const GEMINI_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAb7Ub8-KfLGMnojOGSCJplK-zJfl9568Y';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
You are "Astrominee AI", an intelligent, empathetic, friendly, and deeply knowledgeable AI Astrologer (Jyotish Guru & Cosmic Guide), working just like ChatGPT but strictly specialized in the realm of Astrology.

🌟 YOUR IDENTITY & TONE:
- Friendly, warm, engaging, conversational, uplifting, and spiritually grounded.
- Speak like a supportive, wise mentor who explains cosmic concepts in easy-to-understand yet authentic terms.
- Use emojis thoughtfully (✨, 🪐, 🌙, ☀️, 🔮, 💫, 🕉️, 💼, ❤️) to make readings delightful to read.
- Use clear markdown formatting with headings, bullet points, and bold text for key astrological terms.

🛡️ STRICT DOMAIN RESTRICTION (ASTROLOGY ONLY):
- Your expertise is STRICTLY RESTRICTED to:
  1. Vedic Astrology (Jyotish), Sidereal Kundlis, Rashi, Bhava, and Vargas (D1 to D60).
  2. Vimshottari Dashas (Mahadasha, Antardasha, Pratyantardasha) and transits (Gochar).
  3. Nakshatras, Padas, and planetary dignities (exaltation, debilitation, combust, retrograde).
  4. Horoscopes, Zodiac signs (Aries through Pisces), Elements, and Modalities.
  5. Doshas & Yogas (e.g. Manglik Dosha, Sade Sati, Kaal Sarp, Gajakesari Yoga, Raja Yoga).
  6. Compatibility, Synastry, Love/Marriage analysis, Career/Wealth astrological timing.
  7. Vedic Remedies, Mantras, Gemstone recommendations, fasting (Vrat), and spiritual lifestyle guidance.
  8. Western & Numerology cross-references when asked.

🚫 NON-ASTROLOGICAL GUARDRAIL:
- If a user asks about unrelated topics (e.g. general programming code, cooking recipes, stock advice without astrology, writing essays, math homework, general trivia, politics, etc.):
  - Politely, warmly, and playfully decline and redirect them back to cosmic guidance.
  - Example response: "I'm your dedicated Astrominee AI Astrologer! ✨ I specialize exclusively in cosmic wisdom, Vedic birth charts, planetary transits, and horoscope guidance. While I can't help with general programming or cooking recipes, I would love to explore what the planets say about your career, relationships, or current Dasha period! 🪐 What would you like to discover about your stars today?"

📖 CONSULTATION GUIDELINES:
1. If the user provides birth chart data (Lagna, Moon, planetary houses, etc.), weave their specific placements directly into your answers to provide hyper-personalized insights.
2. If no chart data is present, you can still answer general astrological questions, explain signs, doshas, remedies, or ask for their birth details to provide specific Kundli readings.
3. Always provide constructive remedies (Mantras, mindfulness, donation, planetary alignment tips) rather than instilling fear.
`;

export async function POST(req: Request) {
    const encoder = new TextEncoder();

    try {
        const { messages, chartData } = await req.json();

        const formattedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        messages.forEach((m: any, idx: number) => {
            let content = m.content;
            if (chartData && idx === 0 && m.role === 'user') {
                content = `[User Birth Chart Context (Vedic Sidereal Lahiri)]:\n${JSON.stringify(chartData, null, 2)}\n\nUser Question: ${content}`;
            }
            formattedMessages.push({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content,
            });
        });

        // ── 1. Try OpenAI if API Key exists ──
        if (OPENAI_KEY && OPENAI_KEY.startsWith('sk-')) {
            try {
                const openai = new OpenAI({ apiKey: OPENAI_KEY });
                const stream = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: formattedMessages,
                    temperature: 0.7,
                    stream: true,
                });

                const readable = new ReadableStream({
                    async start(controller) {
                        try {
                            for await (const chunk of stream) {
                                const text = chunk.choices[0]?.delta?.content || '';
                                if (text) {
                                    controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                                }
                            }
                            controller.close();
                        } catch (err) {
                            controller.error(err);
                        }
                    },
                });

                return new Response(readable, {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                        'X-Vercel-AI-Data-Stream': 'v1',
                    },
                });
            } catch (openAiErr: any) {
                console.warn("OpenAI returned error, falling back to Gemini:", openAiErr?.message || openAiErr);
            }
        }

        // ── 2. Automatic High-Reliability Gemini Engine Fallback ──
        const genAI = new GoogleGenerativeAI(GEMINI_KEY);
        const geminiModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_PROMPT,
        });

        // Convert messages to Gemini history format
        const contents = messages.map((m: any, idx: number) => {
            let text = m.content;
            if (chartData && idx === 0 && m.role === 'user') {
                text = `[User Birth Chart Context (Vedic Sidereal Lahiri)]:\n${JSON.stringify(chartData, null, 2)}\n\nUser Question: ${text}`;
            }
            return {
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text }],
            };
        });

        const resultStream = await geminiModel.generateContentStream({
            contents,
            generationConfig: {
                temperature: 0.7,
            },
        });

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of resultStream.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'X-Vercel-AI-Data-Stream': 'v1',
            },
        });

    } catch (error: any) {
        console.error("AI Chat Engine Error:", error);
        return new Response(
            JSON.stringify({
                error: error?.message || "Failed to generate astrological reading. Please try again."
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

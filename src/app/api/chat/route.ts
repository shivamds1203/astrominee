import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// OpenAI Configuration
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

// Google Gemini Configuration (High-reliability fallback)
const GEMINI_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAb7Ub8-KfLGMnojOGSCJplK-zJfl9568Y';

export const runtime = 'edge';

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function buildChartSummary(chartData: any[]): string {
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
        return "No specific birth chart context provided. Offer general Vedic astrological wisdom and ask the user about their placements if needed.";
    }

    const lines: string[] = ["USER'S CALCULATED VEDIC BIRTH CHART (Lahiri Ayanamsa):"];
    const asc = chartData.find((p: any) => p.name === "Ascendant");
    if (asc) {
        const sign = ZODIAC_SIGNS[(asc.current_sign || 1) - 1] || "Aries";
        const deg = (asc.normDegree || (asc.fullDegree % 30) || 0).toFixed(2);
        lines.push(`- **Lagna (Ascendant / 1st House)**: ${sign} at ${deg}°`);
    }

    chartData.filter((p: any) => p.name !== "Ascendant").forEach((p: any) => {
        const sign = ZODIAC_SIGNS[(p.current_sign || 1) - 1] || "Unknown";
        const deg = (p.normDegree !== undefined ? p.normDegree : ((p.fullDegree || 0) % 30)).toFixed(2);
        const house = p.house_number || p.house || "Unknown";
        const retro = (p.isRetro === "true" || p.isRetro === true) ? " [Retrograde ℞]" : "";
        const nk = typeof p.nakshatra === "object" ? p.nakshatra.name : (p.nakshatra || "Unknown");
        lines.push(`- **${p.name}**: In House ${house} (${sign} at ${deg}°), Nakshatra: ${nk}${retro}`);
    });

    lines.push("\n⚠️ CRITICAL INSTRUCTION: The user ALREADY submitted their birth details and their complete Vedic Kundli is loaded above. NEVER ask the user for their birth date, birth time, or location. Directly analyze and answer their questions using their exact planetary placements provided in this chart!");

    return lines.join("\n");
}

export async function POST(req: Request) {
    const encoder = new TextEncoder();

    try {
        const { messages, chartData } = await req.json();

        const chartContextText = buildChartSummary(chartData);

        const fullSystemPrompt = `
You are "Astrominee AI", an intelligent, empathetic, friendly, and deeply knowledgeable Vedic Astrologer (Jyotish Guru & Cosmic Guide), working just like ChatGPT but strictly specialized in the sacred science of Vedic Astrology.

🌟 YOUR IDENTITY & TONE:
- Warm, empathetic, uplifting, conversational, and grounded in authentic Vedic principles (Parashara / Jaimini).
- Explain astrological terms (Lagna, Dashas, Nakshatras, Bhava Lords, Yogas, Gochar) in easy-to-understand language.
- Use emojis thoughtfully (✨, 🪐, 🌙, ☀️, 🔮, 💫, 🕉️, 💼, ❤️) to make readings delightful.
- Structure responses clearly with headings, bold highlights, bullet points, and practical Vedic remedies (Mantras, mindfulness, donation, lifestyle alignment).

🛡️ STRICT DOMAIN RESTRICTION:
- Restrict your answers strictly to Astrology, Horoscopes, Kundli analysis, Dashas, transits, compatibility, career timing, and remedies.
- If asked about non-astrological topics (e.g. computer coding, recipes, general trivia), warmly decline and steer the user back to cosmic guidance.

📊 ACTIVE BIRTH CHART CONTEXT:
${chartContextText}
`;

        const formattedOpenAiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: fullSystemPrompt }
        ];

        messages.forEach((m: any) => {
            formattedOpenAiMessages.push({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content,
            });
        });

        // ── 1. Try OpenAI if API Key exists and is valid ──
        if (OPENAI_KEY && OPENAI_KEY.startsWith('sk-')) {
            try {
                const openai = new OpenAI({ apiKey: OPENAI_KEY });
                const stream = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: formattedOpenAiMessages,
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
                console.warn("OpenAI quota/network error, falling back to Gemini:", openAiErr?.message || openAiErr);
            }
        }

        // ── 2. Automatic High-Reliability Gemini Engine Fallback ──
        const genAI = new GoogleGenerativeAI(GEMINI_KEY);
        const geminiModel = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: fullSystemPrompt,
        });

        // Format history for Gemini
        const contents = messages
            .filter((m: any) => m.content && m.content.trim() !== '')
            .map((m: any) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

        // Ensure first message in Gemini contents is from user
        if (contents.length > 0 && contents[0].role === 'model') {
            contents.shift();
        }

        if (contents.length === 0) {
            contents.push({
                role: 'user',
                parts: [{ text: 'Namaste! Please analyze my birth chart and provide an overview of my life path.' }],
            });
        }

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

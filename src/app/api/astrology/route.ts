import { NextResponse } from 'next/server';

const DEFAULT_API_KEY = "ak-6f57c5babc5906d787f35741c30fcdc39b192622";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { year, month, date, hours, minutes, seconds = 0, latitude, longitude, timezone = 5.5 } = body;

        if (!year || !month || !date || hours === undefined || minutes === undefined || latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                { success: false, error: "Missing required birth details (date, time, or location)." },
                { status: 400 }
            );
        }

        const apiKey = process.env.ASTROLOGY_API_KEY || DEFAULT_API_KEY;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 14000); // 14s timeout

        let planetsData: any[] = [];

        // 1. Primary Method: AstrologyAPI MCP Tool endpoint
        try {
            const mcpResponse = await fetch("https://mcp.astrologyapi.com/mcp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream",
                    "x-astrologyapi-key": apiKey,
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    id: Date.now(),
                    method: "tools/call",
                    params: {
                        name: "planets",
                        arguments: {
                            day: Number(date),
                            month: Number(month),
                            year: Number(year),
                            hour: Number(hours),
                            min: Number(minutes),
                            lat: Number(latitude),
                            lon: Number(longitude),
                            tzone: Number(timezone),
                        },
                    },
                }),
                signal: controller.signal,
            });

            if (mcpResponse.ok) {
                const mcpJson = await mcpResponse.json();
                if (mcpJson.result?.content?.[0]?.text) {
                    const parsed = JSON.parse(mcpJson.result.content[0].text);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        planetsData = parsed;
                    }
                }
            }
        } catch (mcpErr) {
            console.warn("MCP Endpoint error, attempting fallback:", mcpErr);
        }

        // 2. Fallback: FreeAstrologyAPI REST endpoint if MCP didn't succeed
        if (!planetsData || planetsData.length === 0) {
            try {
                const restResponse = await fetch("https://json.freeastrologyapi.com/planets", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": apiKey,
                    },
                    body: JSON.stringify({
                        year: Number(year),
                        month: Number(month),
                        date: Number(date),
                        hours: Number(hours),
                        minutes: Number(minutes),
                        seconds: Number(seconds),
                        latitude: Number(latitude),
                        longitude: Number(longitude),
                        timezone: Number(timezone),
                    }),
                    signal: controller.signal,
                });

                if (restResponse.ok) {
                    const restData = await restResponse.json();
                    if (Array.isArray(restData)) {
                        planetsData = restData;
                    } else if (restData.output && Array.isArray(restData.output)) {
                        planetsData = restData.output;
                    } else if (restData.data && Array.isArray(restData.data)) {
                        planetsData = restData.data;
                    }
                }
            } catch (restErr) {
                console.warn("REST fallback error:", restErr);
            }
        }

        clearTimeout(timeoutId);

        if (!planetsData || planetsData.length === 0) {
            throw new Error("Unable to retrieve planetary positions. Please verify birth details.");
        }

        // Normalize data to ensure all chart components receive expected properties
        const normalized = planetsData.map((p: any) => {
            const fullDegree = Number(p.fullDegree || 0);
            const currentSign = Math.floor(fullDegree / 30) + 1;
            return {
                ...p,
                fullDegree,
                normDegree: Number(p.normDegree !== undefined ? p.normDegree : (fullDegree % 30)),
                current_sign: p.current_sign || currentSign,
                house_number: p.house_number || p.house || 1,
                isRetro: p.isRetro === true || p.isRetro === "true" ? "true" : "false",
            };
        });

        return NextResponse.json({ success: true, data: normalized });

    } catch (error: any) {
        console.error("Astrology API Route Error:", error);
        if (error.name === "AbortError") {
            return NextResponse.json(
                { success: false, error: "Astrology calculation timed out. Please try again." },
                { status: 504 }
            );
        }
        return NextResponse.json(
            { success: false, error: error.message || "Failed to calculate astrological coordinates." },
            { status: 500 }
        );
    }
}

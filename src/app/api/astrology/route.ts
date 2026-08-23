import { NextResponse } from 'next/server';

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

        const apiKey = process.env.ASTROLOGY_API_KEY;
        if (!apiKey) {
            console.error("Missing ASTROLOGY_API_KEY environment variable");
            return NextResponse.json(
                { success: false, error: "Astrology service is temporarily misconfigured. Please check back shortly." },
                { status: 500 }
            );
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

        const planetsResponse = await fetch("https://json.freeastrologyapi.com/planets", {
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
        clearTimeout(timeoutId);

        if (!planetsResponse.ok) {
            const status = planetsResponse.status;
            if (status === 401 || status === 403) {
                return NextResponse.json(
                    { success: false, error: "Astrology calculation service authentication failed. Please verify API credentials." },
                    { status: 403 }
                );
            }
            if (status === 429) {
                return NextResponse.json(
                    { success: false, error: "Service rate limit reached. Please wait a few moments and try again." },
                    { status: 429 }
                );
            }
            throw new Error(`Astrology provider responded with status ${status}`);
        }

        const planetsData = await planetsResponse.json();
        return NextResponse.json({ success: true, data: planetsData });

    } catch (error: any) {
        console.error("Astrology API Error:", error);
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


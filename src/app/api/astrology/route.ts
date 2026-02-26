import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone } = body;

        // We use the FreeAstrologyAPI key provided by the user
        // The endpoint here is a common structure for Vedic APIs, specifically freeastrologyapi
        const apiKey = "rj7tHBK4AL7XNY7CtEFsQ11Xxri3R2Hq8HZ4GVcx";

        // 1. Fetch Birth Details (Basic panchanga/planetary data)
        const planetsResponse = await fetch("https://json.freeastrologyapi.com/planets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body: JSON.stringify({
                year, month, date, hours, minutes, seconds, latitude, longitude, timezone
            })
        });

        if (!planetsResponse.ok) {
            throw new Error(`Astrology API Error: ${planetsResponse.statusText}`);
        }

        const planetsData = await planetsResponse.json();

        return NextResponse.json({ success: true, data: planetsData });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

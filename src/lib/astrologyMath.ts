export const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const getNakshatraDetails = (fullDegree: number) => {
    if (fullDegree === undefined || fullDegree === null) return { name: "Unknown", pada: 1 };

    // 360 degrees / 27 Nakshatras = 13 degrees 20 minutes (13.3333333)
    const nakshatraIndex = Math.floor(fullDegree / (360 / 27));

    // Each Nakshatra has 4 Padas -> 13.3333333 / 4 = 3 degrees 20 minutes (3.3333333)
    const degreeInNakshatra = fullDegree % (360 / 27);
    const pada = Math.floor(degreeInNakshatra / (360 / 108)) + 1;

    return {
        name: NAKSHATRAS[nakshatraIndex] || "Unknown",
        pada
    };
};

export const calculateVargaSign = (fullDegree: number, vargaNum: number): number => {
    // Validate inputs
    if (fullDegree === undefined || fullDegree === null) return 1;

    const sign = Math.floor(fullDegree / 30) + 1;

    // D1 - Rashi (Birth Chart)
    if (vargaNum === 1) return sign;

    // specific exact rules for classic Vargas
    switch (vargaNum) {
        case 2: // Hora (D2)
            const horaPart = fullDegree % 30;
            if (sign % 2 !== 0) return horaPart <= 15 ? 5 : 4; // Leo / Cancer
            return horaPart <= 15 ? 4 : 5; // Cancer / Leo

        case 3: // Drekkana (D3)
            const drekPart = Math.floor((fullDegree % 30) / 10);
            if (drekPart === 0) return sign;
            if (drekPart === 1) return ((sign - 1 + 4) % 12) + 1; // 5th from it
            return ((sign - 1 + 8) % 12) + 1; // 9th from it

        case 4: // Chaturthamsa (D4)
            const d4Part = Math.floor((fullDegree % 30) / 7.5);
            return ((sign - 1 + (d4Part * 3)) % 12) + 1; // 1st, 4th, 7th, 10th

        case 7: // Saptamsa (D7)
            const d7Part = Math.floor((fullDegree % 30) / (30 / 7));
            if (sign % 2 !== 0) return ((sign - 1 + d7Part) % 12) + 1; // self
            return ((sign - 1 + 6 + d7Part) % 12) + 1; // 7th from self

        case 9: // Navamsa (D9) - continuous cycle
            const d9TotalParts = Math.floor(fullDegree / (30 / 9));
            return (d9TotalParts % 12) + 1;

        case 10: // Dashamsa (D10)
            const d10Part = Math.floor((fullDegree % 30) / 3);
            if (sign % 2 !== 0) return ((sign - 1 + d10Part) % 12) + 1;
            return ((sign - 1 + 8 + d10Part) % 12) + 1; // 9th from it

        case 12: // Dwadashamsa (D12)
            const d12Part = Math.floor((fullDegree % 30) / 2.5);
            return ((sign - 1 + d12Part) % 12) + 1;

        case 60: // Shashtiamsa (D60) - continuous cycle starts from the sign itself
            const d60Part = Math.floor((fullDegree % 30) / 0.5);
            return ((sign - 1 + d60Part) % 12) + 1;

        default:
            // Generic simple harmonic calculation for any arbitrary requested Varga matching Parashara
            const part = Math.floor((fullDegree % 30) / (30 / vargaNum));
            return ((sign - 1 + part) % 12) + 1;
    }
};

export const generateDivisionalChart = (d1Planets: any[], vargaNum: number) => {
    if (!d1Planets || d1Planets.length === 0) return [];

    // First find Ascendant to calculate houses relatively
    const d1Ascendant = d1Planets.find(p => p.name === 'Ascendant');
    const ascVargaSign = d1Ascendant ? calculateVargaSign(d1Ascendant.fullDegree, vargaNum) : 1;

    return d1Planets.map(planet => {
        const vargaSign = calculateVargaSign(planet.fullDegree, vargaNum);
        // Calculate house number relative to the newly calculated Ascendant sign
        let vargaHouse = (vargaSign - ascVargaSign + 1);
        if (vargaHouse <= 0) vargaHouse += 12;

        return {
            ...planet,
            current_sign: vargaSign,
            house_number: vargaHouse
        };
    });
};

// ─── Vimshottari Dasha System (Mahadasha, Antardasha, Pratyantardasha) ───────────
export interface DashaPeriod {
    planet: string;
    sanskritName: string;
    durationYears: number;
    startDate: Date;
    endDate: Date;
    startFormatted: string;
    endFormatted: string;
    isActive: boolean;
    progressPercent: number;
    antardashas?: DashaPeriod[];
    pratyantardashas?: DashaPeriod[];
}

export const DASHA_LORDS = [
    { planet: "Ketu", sanskrit: "Ketu", years: 7 },
    { planet: "Venus", sanskrit: "Shukra", years: 20 },
    { planet: "Sun", sanskrit: "Surya", years: 6 },
    { planet: "Moon", sanskrit: "Chandra", years: 10 },
    { planet: "Mars", sanskrit: "Mangal", years: 7 },
    { planet: "Rahu", sanskrit: "Rahu", years: 18 },
    { planet: "Jupiter", sanskrit: "Guru", years: 16 },
    { planet: "Saturn", sanskrit: "Shani", years: 19 },
    { planet: "Mercury", sanskrit: "Budha", years: 17 }
];

const MS_PER_DAY = 86400000;
const DAYS_PER_YEAR = 365.2425;

const formatDate = (d: Date) => {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const calculateVimshottariDashas = (moonFullDegree: number = 306.68, birthDateStr?: string): DashaPeriod[] => {
    const birthDate = birthDateStr ? new Date(birthDateStr) : new Date(2002, 2, 12, 9, 35);
    const now = new Date();

    // 27 Nakshatras -> 360 / 27 = 13.3333333 degrees each
    const nakshatraSpan = 360 / 27;
    const nakshatraIdx = Math.floor(moonFullDegree / nakshatraSpan);
    const degInNakshatra = moonFullDegree % nakshatraSpan;

    // Lord index (0 to 8: Ketu to Mercury) repeats 3 times for 27 nakshatras
    const lordIdx = nakshatraIdx % 9;
    const initialLord = DASHA_LORDS[lordIdx];

    // Fraction of nakshatra remaining at birth
    const fractionRemaining = 1 - (degInNakshatra / nakshatraSpan);
    const initialBalanceYears = initialLord.years * fractionRemaining;

    const mahadashas: DashaPeriod[] = [];
    let currentStartTime = birthDate.getTime();

    for (let i = 0; i < 9; i++) {
        const currentLordIdx = (lordIdx + i) % 9;
        const lord = DASHA_LORDS[currentLordIdx];
        const durationYears = i === 0 ? initialBalanceYears : lord.years;
        const durationMs = durationYears * DAYS_PER_YEAR * MS_PER_DAY;
        const endTime = currentStartTime + durationMs;

        const startDate = new Date(currentStartTime);
        const endDate = new Date(endTime);

        const isActive = now.getTime() >= currentStartTime && now.getTime() < endTime;
        const progress = isActive
            ? Math.min(100, Math.max(0, ((now.getTime() - currentStartTime) / durationMs) * 100))
            : now.getTime() >= endTime ? 100 : 0;

        // Calculate Antardashas inside this Mahadasha
        const antardashas: DashaPeriod[] = [];
        let antarStartTime = currentStartTime;

        for (let j = 0; j < 9; j++) {
            const antarLordIdx = (currentLordIdx + j) % 9;
            const antarLord = DASHA_LORDS[antarLordIdx];
            // Proportional Antardasha duration: (MD_years * AD_years) / 120
            const fullAntarYears = (lord.years * antarLord.years) / 120;
            // Scale if this is the initial partial Mahadasha
            const scaledAntarYears = i === 0 ? fullAntarYears * fractionRemaining : fullAntarYears;
            const antarMs = scaledAntarYears * DAYS_PER_YEAR * MS_PER_DAY;
            const antarEndTime = antarStartTime + antarMs;

            const antarStartDate = new Date(antarStartTime);
            const antarEndDate = new Date(antarEndTime);
            const isAntarActive = now.getTime() >= antarStartTime && now.getTime() < antarEndTime;
            const antarProgress = isAntarActive
                ? Math.min(100, Math.max(0, ((now.getTime() - antarStartTime) / antarMs) * 100))
                : now.getTime() >= antarEndTime ? 100 : 0;

            // Calculate Pratyantardashas inside this Antardasha
            const pratyantardashas: DashaPeriod[] = [];
            let pratStartTime = antarStartTime;

            for (let k = 0; k < 9; k++) {
                const pratLordIdx = (antarLordIdx + k) % 9;
                const pratLord = DASHA_LORDS[pratLordIdx];
                // Proportional Pratyantar duration: (AD_years * PD_years) / 120
                const pratYears = (scaledAntarYears * pratLord.years) / 120;
                const pratMs = pratYears * DAYS_PER_YEAR * MS_PER_DAY;
                const pratEndTime = pratStartTime + pratMs;

                const pratStartDate = new Date(pratStartTime);
                const pratEndDate = new Date(pratEndTime);
                const isPratActive = now.getTime() >= pratStartTime && now.getTime() < pratEndTime;
                const pratProgress = isPratActive
                    ? Math.min(100, Math.max(0, ((now.getTime() - pratStartTime) / pratMs) * 100))
                    : now.getTime() >= pratEndTime ? 100 : 0;

                pratyantardashas.push({
                    planet: pratLord.planet,
                    sanskritName: pratLord.sanskrit,
                    durationYears: pratYears,
                    startDate: pratStartDate,
                    endDate: pratEndDate,
                    startFormatted: formatDate(pratStartDate),
                    endFormatted: formatDate(pratEndDate),
                    isActive: isPratActive,
                    progressPercent: pratProgress
                });

                pratStartTime = pratEndTime;
            }

            antardashas.push({
                planet: antarLord.planet,
                sanskritName: antarLord.sanskrit,
                durationYears: scaledAntarYears,
                startDate: antarStartDate,
                endDate: antarEndDate,
                startFormatted: formatDate(antarStartDate),
                endFormatted: formatDate(antarEndDate),
                isActive: isAntarActive,
                progressPercent: antarProgress,
                pratyantardashas
            });

            antarStartTime = antarEndTime;
        }

        mahadashas.push({
            planet: lord.planet,
            sanskritName: lord.sanskrit,
            durationYears,
            startDate,
            endDate,
            startFormatted: formatDate(startDate),
            endFormatted: formatDate(endDate),
            isActive,
            progressPercent: progress,
            antardashas
        });

        currentStartTime = endTime;
    }

    return mahadashas;
};


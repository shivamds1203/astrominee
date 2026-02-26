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
        // e.g. if Asc is 4 (Cancer), and Planet is 4, it is house 1.
        // if Asc is 4, Planet is 5 (Leo), it is house 2.
        let vargaHouse = (vargaSign - ascVargaSign + 1);
        if (vargaHouse <= 0) vargaHouse += 12;

        return {
            ...planet,
            current_sign: vargaSign,
            house_number: vargaHouse
        };
    });
};

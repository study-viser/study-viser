// src/lib/manoaData.ts
export const buildingCoords: Record<string, [number, number]> = {
  // THE ACADEMIC QUAD (North-East Area)
  "KELLER": [21.30058, -157.81865],    // Keller Hall
  "POST": [21.29750, -157.81635],      // POST Building
  "BIL": [21.30005, -157.81815],       // Bilger Hall
  "BILGER": [21.30005, -157.81815],
  "HAM": [21.30005, -157.81725],       // Hamilton Library
  "HAMILTON": [21.30005, -157.81725],

  // THE MALL / MID-CAMPUS
  "KUY": [21.29875, -157.81875],       // Kuykendall Hall
  "KUYKENDALL": [21.29875, -157.81875],
  "WEB": [21.30025, -157.82015],       // Webster Hall
  "WEBSTER": [21.30025, -157.82015],

  // LOWER CAMPUS (South-West Area)
  "SAUND": [21.29882, -157.82025],     // Saunders Hall
  "SAUNDERS": [21.29882, -157.82025],
  "BUSAD": [21.29945, -157.81885],     // Shidler / BusAd
  "SHIDLER": [21.29945, -157.81885],
  "SAK": [21.29775, -157.81995],       // Sakamaki Hall
  "SAKAMAKI": [21.29775, -157.81995],
};

export const MANOA_CENTER: [number, number] = [21.2998, -157.8185];
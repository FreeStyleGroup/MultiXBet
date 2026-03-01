export const SSTATS_API_URL = process.env.SSTATS_API_URL || "https://api.sstats.net";
export const SSTATS_API_KEY = process.env.SSTATS_API_KEY || "";

export const CACHE_REVALIDATE_SECONDS = 300; // 5 minutes
export const EXPRESS_MIN_EVENTS = 5;
export const EXPRESS_MAX_EVENTS = 7;
export const MIN_CONFIDENCE_THRESHOLD = 0.55; // minimum probability to consider

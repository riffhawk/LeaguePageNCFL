const AVAILABLE_YEARS = ['2025', '2024'];
const DEFAULT_YEAR = 2025;

export async function load({ fetch, url }) {
    const requestedYear = Number(url.searchParams.get('year'));
    const selectedYear = AVAILABLE_YEARS.includes(String(requestedYear)) ? String(requestedYear) : String(DEFAULT_YEAR);
    const API_URL = `https://fantasygenius-fastapi.azurewebsites.net/latest_week_team_ranks/1082055802648637440/${selectedYear}`;
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            return { data: [], error: 'Failed to fetch data', selectedYear, availableYears: AVAILABLE_YEARS };
        }
        const json = await response.json();
        return { data: json.data || [], error: null, selectedYear, availableYears: AVAILABLE_YEARS };
    } catch (e) {
        return { data: [], error: e.message, selectedYear, availableYears: AVAILABLE_YEARS };
    }
}

export async function load({ fetch }) {
    const API_URL = 'https://fantasygenius-fastapi.azurewebsites.net/latest_week_team_ranks/1082055802648637440/2025';
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            return { data: [], error: 'Failed to fetch data' };
        }
        const json = await response.json();
        return { data: json.data || [], error: null };
    } catch (e) {
        return { data: [], error: e.message };
    }
}

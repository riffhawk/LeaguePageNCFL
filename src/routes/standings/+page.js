import { getLeagueStandings, getLeagueTeamManagers } from '$lib/utils/helper';
import { seasonLeagueIDs, standingsYears } from '$lib/utils/leagueInfo';

export async function load({ url }) {
    const leagueTeamManagersData = await getLeagueTeamManagers();
    const availableYears = standingsYears;
    const requestedYear = url.searchParams.get('year');
    const selectedYear = availableYears.includes(requestedYear)
        ? requestedYear
        : String(leagueTeamManagersData.currentSeason);
    const selectedLeagueID =
        seasonLeagueIDs[selectedYear] ??
        leagueTeamManagersData.yearToLeagueID[Number(selectedYear)] ??
        null;
    const standingsData = selectedLeagueID
        ? getLeagueStandings(selectedLeagueID)
        : Promise.resolve(null);

    return {
        standingsData,
        leagueTeamManagersData,
        availableYears,
        selectedYear,
    };
} 

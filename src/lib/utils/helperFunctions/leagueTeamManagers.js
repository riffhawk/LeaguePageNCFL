import { leagueID, managers, seasonLeagueIDs } from '$lib/utils/leagueInfo';
import { get } from 'svelte/store';
import { teamManagersStore } from '$lib/stores';
import { waitForAll } from './multiPromise';
import { getManagers, getTeamData } from './universalFunctions';
import { getLeagueData } from './leagueData';

export const getLeagueTeamManagers = async () => {
    if(get(teamManagersStore) && get(teamManagersStore).currentSeason) {
                return get(teamManagersStore);
        }
    let currentLeagueID = leagueID;
        let teamManagersMap = {};
    let finalUsers = {};
    let currentSeason = null;

    let yearToLeagueID = {};
    const processedLeagueIDs = new Set();
    const configuredYears = Object.keys(seasonLeagueIDs)
        .map(Number)
        .sort((a, b) => b - a);

    const processLeague = async (targetLeagueID) => {
        if (!targetLeagueID || targetLeagueID == 0 || processedLeagueIDs.has(targetLeagueID)) {
            return null;
        }
        processedLeagueIDs.add(targetLeagueID);

        const [usersRaw, leagueData, rostersRaw] = await waitForAll(
            fetch(`https://api.sleeper.app/v1/league/${targetLeagueID}/users`, {compress: true}),
            getLeagueData(targetLeagueID),
            fetch(`https://api.sleeper.app/v1/league/${targetLeagueID}/rosters`, {compress: true}),
        ).catch((err) => { console.error(err); });

        const [users, rosters] = await waitForAll(
            usersRaw.json(), 
            rostersRaw.json(), 
        ).catch((err) => { console.error(err); });

        const year = parseInt(leagueData.season);
        yearToLeagueID[year] = targetLeagueID;
        if(!currentSeason || year > currentSeason) {
            currentSeason = year;
        }
        teamManagersMap[year] = {};
        const processedUsers = processUsers(users);

        for(const processedUserKey in processedUsers) {
            if(finalUsers[processedUserKey]) continue;
            finalUsers[processedUserKey] = processedUsers[processedUserKey];
        }
        for(const roster of rosters) {
            teamManagersMap[year][roster.roster_id] = {
                team: getTeamData(processedUsers, roster.owner_id),
                managers: getManagers(roster, processedUsers),
            };
        }

        return leagueData.previous_league_id;
    };

    for (const configuredYear of configuredYears) {
        await processLeague(seasonLeagueIDs[configuredYear]);
    }

    // loop through all seasons and create a [year][roster_id]: team, managers object
        while(currentLeagueID && currentLeagueID != 0) {
        currentLeagueID = await processLeague(currentLeagueID);
    }
    const response = {
        currentSeason,
        teamManagersMap,
        users: finalUsers,
        yearToLeagueID,
    }
    teamManagersStore.update(() => response);
    return response;
}

const processUsers = (rawUsers) => {
        let finalUsers = {};
        for(const user of rawUsers) {
        user.user_name = user.user_name ?? user.display_name;
                finalUsers[user.user_id] = user;
        const manager = managers.find(m => m.managerID === user.user_id);
        if(manager) {
            finalUsers[user.user_id].display_name = manager.name;
        }
        }
        return finalUsers;
}

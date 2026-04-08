import { seasonLeagueIDs } from '$lib/utils/leagueInfo';
import { getLeagueData } from './leagueData';
import { getLeagueRosters } from './leagueRosters';
import { getRosterIDFromManagerIDAndYear } from './universalFunctions';

const POSITION_ORDER = ['QB', 'RB', 'WR', 'TE', 'DEF', 'K'];
const REGULAR_SEASON_WEEKS = 18;

const seasonOwnershipCache = new Map();
const seasonRanksCache = new Map();
const managerAwardsCache = new Map();

const roundScore = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const calculateFantasyPoints = (stats = {}, scoringSettings = {}) => {
    let total = 0;
    for (const stat in stats) {
        total += (scoringSettings[stat] || 0) * stats[stat];
    }
    return roundScore(total);
};

const getPlayerAvatar = ({ player, player_id, team }) => {
    const position = player?.position;
    if (position === 'DEF') {
        const teamId = String(player_id || team || player?.team || '').toLowerCase();
        return `https://sleepercdn.com/images/team_logos/nfl/${teamId}.png`;
    }
    return `https://sleepercdn.com/content/nfl/players/thumb/${player_id}.jpg`;
};

const getPlayerDisplayName = ({ player, player_id, team }) => {
    const position = player?.position;
    if (position === 'DEF') {
        return `${team || player?.team || player_id} D/ST`;
    }
    return `${player?.first_name || ''} ${player?.last_name || ''}`.trim();
};

const getSeasonOwnedPlayers = async ({ leagueID, rosterID }) => {
    const cacheKey = `${leagueID}:${rosterID}`;
    if (seasonOwnershipCache.has(cacheKey)) {
        return seasonOwnershipCache.get(cacheKey);
    }

    const rostersData = await getLeagueRosters(leagueID);
    const roster = rostersData.rosters[rosterID];
    const ownedPlayers = new Set([
        ...(roster?.players || []),
        ...(roster?.reserve || []),
        ...(roster?.taxi || [])
    ]);

    seasonOwnershipCache.set(cacheKey, ownedPlayers);
    return ownedPlayers;
};

const getSeasonPositionRanks = async ({ year, leagueID }) => {
    const cacheKey = String(year);
    if (seasonRanksCache.has(cacheKey)) {
        return seasonRanksCache.get(cacheKey);
    }

    const leagueData = await getLeagueData(leagueID);
    const scoringSettings = leagueData.scoring_settings || {};
    const positionQueries = POSITION_ORDER.map((position) => `position[]=${position}`).join('&');

    const weeklyResponses = await Promise.all(
        Array.from({ length: REGULAR_SEASON_WEEKS }, (_, index) => {
            const week = index + 1;
            return fetch(
                `https://api.sleeper.app/stats/nfl/${year}/${week}?season_type=regular&${positionQueries}&order_by=ppr`,
                { compress: true }
            )
                .then((res) => res.ok ? res.json() : [])
                .catch(() => []);
        })
    );

    const totals = new Map();
    for (const weeklyStats of weeklyResponses) {
        for (const item of weeklyStats) {
            const position = item?.player?.position;
            if (!POSITION_ORDER.includes(position)) continue;

            const playerId = String(item.player_id);
            const existing = totals.get(playerId) || {
                player_id: playerId,
                position,
                points: 0,
                player: item.player,
                team: item.team
            };

            existing.points += calculateFantasyPoints(item.stats, scoringSettings);
            existing.player = item.player || existing.player;
            existing.team = item.team || existing.team;
            totals.set(playerId, existing);
        }
    }

    const ranksByPosition = {};
    for (const position of POSITION_ORDER) {
        const ranked = [...totals.values()]
            .filter((player) => player.position === position)
            .sort((a, b) => b.points - a.points)
            .map((player, index) => ({
                ...player,
                rank: index + 1,
                year,
                avatar: getPlayerAvatar(player),
                name: getPlayerDisplayName(player)
            }));

        ranksByPosition[position] = new Map(
            ranked.map((player) => [player.player_id, player])
        );
    }

    seasonRanksCache.set(cacheKey, ranksByPosition);
    return ranksByPosition;
};

export const getManagerPlayerAwards = async ({ managerID, leagueTeamManagers }) => {
    const cacheKey = `${managerID}:${leagueTeamManagers?.currentSeason || 'na'}`;
    if (managerAwardsCache.has(cacheKey)) {
        return managerAwardsCache.get(cacheKey);
    }

    const completedYears = Object.keys(seasonLeagueIDs)
        .map(Number)
        .filter((year) => year < Number(leagueTeamManagers.currentSeason))
        .sort((a, b) => b - a);

    const candidates = [];

    for (const year of completedYears) {
        const leagueID = seasonLeagueIDs[year];
        const rosterID = getRosterIDFromManagerIDAndYear(leagueTeamManagers, managerID, year);
        if (!leagueID || !rosterID) continue;

        const [ownedPlayers, ranksByPosition] = await Promise.all([
            getSeasonOwnedPlayers({ leagueID, rosterID }),
            getSeasonPositionRanks({ year, leagueID })
        ]);

        for (const position of POSITION_ORDER) {
            const positionRanks = ranksByPosition[position];
            if (!positionRanks) continue;

            for (const playerId of ownedPlayers) {
                const rankedPlayer = positionRanks.get(String(playerId));
                if (!rankedPlayer || rankedPlayer.rank > 3) continue;

                candidates.push({
                    ...rankedPlayer,
                    rosterID,
                    subtitle: `${year} #${rankedPlayer.rank} ${position}`
                });
            }
        }
    }

    const results = POSITION_ORDER.flatMap((position) =>
        candidates
            .filter((candidate) => candidate.position === position)
            .sort((a, b) => {
                if (a.rank !== b.rank) return a.rank - b.rank;
                if (a.year !== b.year) return b.year - a.year;
                return b.points - a.points;
            })
            .slice(0, 3)
    ).sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        const positionDelta = POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position);
        if (positionDelta !== 0) return positionDelta;
        return a.rank - b.rank;
    });

    managerAwardsCache.set(cacheKey, results);
    return results;
};

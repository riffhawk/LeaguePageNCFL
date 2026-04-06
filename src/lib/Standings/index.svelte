<script>
    import { goto } from '$app/navigation';
    import { leagueName, round } from '$lib/utils/helper';
    import { getTeamFromTeamManagers, gotoManager } from '$lib/utils/helperFunctions/universalFunctions';
    import LinearProgress from '@smui/linear-progress';
    import { flip } from 'svelte/animate';

    export let standingsData, leagueTeamManagersData, availableYears = [], selectedYear = '';

    // Least important to most important (i.e. the most important [usually wins] goes last)
    // Edit this to match your leagues settings
    const sortOrder = ["fptsAgainst", "divisionTies", "divisionWins", "fpts", "ties", "wins"];

    // Column order from left to right
    const columnOrder = [{name: "Wins", field: "wins"}, {name: "Ties", field: "ties"}, {name: "Losses", field: "losses"}, {name: "Div. Wins", field: "divisionWins"}, {name: "Div. Ties", field: "divisionTies"}, {name: "Div. Losses", field: "divisionLosses"}, {name: "Total Points", field: "fpts"}, {name: "Points Against", field: "fptsAgainst"}, {name: "Streak", field: "streak"}]
    const mobileColumnLabels = {
        wins: 'W',
        ties: 'T',
        losses: 'L',
        divisionWins: 'DW',
        divisionTies: 'DT',
        divisionLosses: 'DL',
        fpts: 'PF',
        fptsAgainst: 'PA',
        streak: 'STR',
    };

    let loading = true;
    let refreshing = false;
    let preseason = false;
    let standings, year, leagueTeamManagers;
    let sortField = null;
    let sortDirection = 'desc';

    function handleSort(field) {
        if (sortField === field) {
            sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        } else {
            sortField = field;
            sortDirection = 'desc';
        }
    }

    async function handleYearChange(event) {
        const nextYear = event.currentTarget.value;
        await goto(`/standings?year=${nextYear}`, {
            invalidateAll: true,
            keepFocus: true,
            noScroll: true
        });
    }

    function getColumnStyle(field, value) {
        const styles = {
            wins: 'font-weight: bold; color: green;',
            ties: 'font-weight: bold; color: black;',
            losses: 'font-weight: bold; color: red;',
            divisionWins: 'font-weight: bold; color: green;',
            divisionTies: 'font-weight: bold; color: black;',
            divisionLosses: 'font-weight: bold; color: orange;',
            fpts: 'font-weight: bold; color: black;',
            fptsAgainst: 'font-weight: bold; color: green;',
        };

        if (field === 'streak') {
            const isWin = String(value).includes('W');
            return `font-weight: bold; color: ${isWin ? 'green' : 'orange'};`;
        }

        return styles[field] || '';
    }

    function truncateTeamName(name) {
        if (!name) return '';
        return name.length > 14 ? `${name.slice(0, 14)}...` : name;
    }

    function getColumnLabel(column) {
        return innerWidth && innerWidth <= 480
            ? mobileColumnLabels[column.field] || column.name
            : column.name;
    }

    $: sortedStandings = standings ? [...standings].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (sortDirection === 'desc') {
            return bVal - aVal;
        } else {
            return aVal - bVal;
        }
    }) : [];

    async function loadStandings() {
        const hasExistingStandings = Array.isArray(standings) && standings.length > 0;
        loading = !hasExistingStandings;
        refreshing = hasExistingStandings;
        preseason = false;
        year = selectedYear;
        const asyncStandingsData = await standingsData;
        if(!asyncStandingsData) {
            loading = false;
            refreshing = false;
            preseason = true;
            return;
        }
        const {standingsInfo, yearData} = asyncStandingsData;
        leagueTeamManagers = await leagueTeamManagersData;
        year = yearData;

        let finalStandings = Object.keys(standingsInfo).map((key) => {
            const team = getTeamFromTeamManagers(leagueTeamManagers, standingsInfo[key].rosterID);
            const keyValue =
                team?.managers?.map(manager => manager.managerID || manager.user_id || manager.display_name).join('-')
                || team?.name
                || standingsInfo[key].rosterID;
            return {
                ...standingsInfo[key],
                team,
                keyValue,
            };
        });

        for(const sortType of sortOrder) {
            if(!finalStandings[0][sortType] && finalStandings[0][sortType] != 0) {
                continue;
            }
            finalStandings = [...finalStandings].sort((a,b) => b[sortType] - a[sortType]);
        }

        standings = finalStandings;
        loading = false;
        refreshing = false;
    }

    $: if (standingsData) {
        loadStandings();
    }

    let innerWidth;

</script>

<svelte:window bind:innerWidth={innerWidth} />

<style>
    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
        font-family: 'Rubik', sans-serif;
    }

    .loadingInline {
        width: min(85%, 500px);
        margin: 0 auto 1.25em;
    }

    :global(.center) {
        text-align: center;
    }

    :global(.wrappable) {
        white-space: normal;
        line-height: 1.2em;
    }

    h1 {
        margin-bottom: 0.25rem;
        font-family: 'Space Mono', monospace;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin-top: 1.5em;
        font-size: 2.8em;
        line-height: 1;
        text-transform: uppercase;
    }

    .sortableHeader {
        cursor: pointer;
        user-select: none;
        display: inline-flex;
        align-items: center;
        gap: 3px;
        color: #1f2937;
    }

    .sortableHeader:hover {
        background: rgba(0,0,0,0.05);
    }

    .sortIndicator {
        font-size: 0.7em;
    }

    .standingsTable {
        max-width: 100%;
        overflow-x: scroll;
        margin: 0.5em 0 5em;
        font-family: 'Rubik', sans-serif;
        position: relative;
    }

    .standingsTable :global(*) {
        font-family: 'Rubik', sans-serif;
    }

    .standingsDataTable {
        width: 100%;
        border-collapse: collapse;
        background: rgba(255, 255, 255, 0.92);
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 14px 30px rgba(82, 96, 107, 0.14);
    }

    .standingsTable.refreshing .standingsDataTable {
        opacity: 0.82;
        transition: opacity 0.25s ease;
    }

    .refreshBar {
        position: sticky;
        top: 0;
        z-index: 2;
        margin-bottom: 0.35em;
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border-radius: 999px;
        overflow: hidden;
    }

    .standingsDataTable th,
    .standingsDataTable td {
        padding: 0.9em 0.75em;
        border-bottom: 1px solid rgba(142, 158, 171, 0.18);
        border-right: 1px solid rgba(142, 158, 171, 0.18);
        text-align: center;
    }

    .standingsDataTable th:last-child,
    .standingsDataTable td:last-child {
        border-right: none;
    }

    .standingsDataTable th {
        background: rgba(255, 255, 255, 0.65);
        font-size: 0.9em;
        font-weight: 700;
        white-space: nowrap;
    }

    .standingsDataTable tbody tr:nth-child(odd) {
        background: rgba(248, 250, 251, 0.72);
    }

    .standingsDataTable tbody tr:last-child td {
        border-bottom: none;
    }

    .teamCell {
        min-width: 220px;
        text-align: left;
    }

    .teamButton {
        display: flex;
        align-items: center;
        gap: 0.9em;
        cursor: pointer;
    }

    .teamAvatar {
        border-radius: 50%;
        height: 40px;
        width: 40px;
        object-fit: cover;
        border: 0.25px solid #777;
        flex-shrink: 0;
        background: rgba(142, 158, 171, 0.2);
    }

    .teamName {
        font-weight: 600;
        color: #1f2937;
    }

    .statCell {
        font-family: 'Rubik', sans-serif;
        color: #1f2937;
    }

    .statsLegend {
        max-width: 640px;
        margin: 0 auto 3.5em;
        padding: 0.85em 1em;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.58);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.14)),
            rgba(255, 255, 255, 0.12);
        box-shadow:
            0 10px 24px rgba(72, 44, 119, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        text-align: left;
    }

    .statsLegendTitle {
        margin: 0 0 0.55em;
        font-family: 'Space Mono', monospace;
        font-size: 0.82em;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        background: linear-gradient(180deg, #111111 0%, #4a4a4a 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .statsLegendGrid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.4em 0.85em;
        font-family: 'Rubik', sans-serif;
        font-size: 0.84em;
    }

    .statsLegendItem {
        display: flex;
        gap: 0.35em;
        align-items: baseline;
        background: linear-gradient(180deg, #111111 0%, #4a4a4a 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .statsLegendKey {
        font-weight: 700;
        min-width: 1.8em;
    }

    .standingsControls {
        display: flex;
        justify-content: center;
        margin: 0.5em 0 1em;
    }

    .yearFilterForm {
        margin: 0;
    }

    .yearFilter {
        position: relative;
        display: inline-block;
    }

    .yearSelect {
        appearance: none;
        -webkit-appearance: none;
        min-width: 116px;
        padding: 0.8em 2.7em 0.8em 1.1em;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.58);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.14)),
            rgba(255, 255, 255, 0.12);
        box-shadow:
            0 10px 24px rgba(72, 44, 119, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        color: rgba(255, 255, 255, 0.96);
        font-family: 'Rubik', sans-serif;
        font-size: 0.92em;
        font-weight: 600;
        text-align: center;
        text-align-last: center;
        cursor: pointer;
    }

    .yearSelect:hover,
    .yearSelect:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.82);
    }

    .yearFilter::after {
        content: '';
        position: absolute;
        right: 1em;
        top: 50%;
        width: 10px;
        height: 10px;
        border-right: 2px solid rgba(255, 255, 255, 0.92);
        border-bottom: 2px solid rgba(255, 255, 255, 0.92);
        transform: translateY(-65%) rotate(45deg);
        pointer-events: none;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 2.8em;
            margin-top: 0em;
            padding: 21px 0.5em;
        }
        .standingsControls {
            margin: 0.15em 0 0.8em;
        }
        .yearSelect {
            min-width: 104px;
            font-size: 0.84em;
            padding: 0.72em 2.45em 0.72em 1em;
        }
        .standingsTable {
            margin: 0.25em 8px 3em;
        }
        .standingsDataTable th,
        .standingsDataTable td {
            padding: 0.72em 0.42em;
            font-size: 0.86em;
        }
        .teamCell {
            min-width: 150px;
        }
        .teamButton {
            gap: 0.55em;
        }
        .teamAvatar {
            height: 30px;
            width: 30px;
        }
        .teamName {
            font-size: 0.95em;
        }
        .statsLegend {
            margin: 0 8px 3em;
        }
        .statsLegendGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            font-size: 0.8em;
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 2.8em;
        }
        .loading {
            width: 95%;
            margin: 40px auto;
        }
        .standingsControls {
            margin-bottom: 0.6em;
        }
        .standingsTable {
            margin: 0.2em 4px 2.5em;
        }
        .standingsDataTable th,
        .standingsDataTable td {
            padding: 0.66em 0.28em;
            font-size: 0.76em;
        }
        .standingsDataTable th {
            font-size: 0.72em;
            letter-spacing: -0.02em;
        }
        .teamCell {
            min-width: 128px;
        }
        .teamAvatar {
            height: 24px;
            width: 24px;
        }
        .teamButton {
            gap: 0.45em;
        }
        .teamName {
            font-size: 0.86em;
            line-height: 1.15;
        }
        .statsLegend {
            margin: 0 4px 2.5em;
            padding: 0.8em 0.75em;
            border-radius: 18px;
        }
        .statsLegendTitle {
            font-size: 0.76em;
        }
        .statsLegendGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.35em 0.6em;
            font-size: 0.74em;
        }
    }
</style>

<h1>{year ?? ''} NCFL<br/>STANDINGS</h1>

<div class="standingsControls">
    <form class="yearFilterForm" method="GET" action="/standings">
        <div class="yearFilter" aria-label="Filter standings by year">
            <select
                id="standings-year-select"
                class="yearSelect"
                name="year"
                onchange={handleYearChange}
            >
                {#each availableYears as optionYear}
                    <option value={optionYear} selected={optionYear === selectedYear}>{optionYear}</option>
                {/each}
            </select>
        </div>
    </form>
</div>

{#if loading && !standings}
    <div class="loading">
        <p>Loading Standings...</p>
        <LinearProgress indeterminate />
    </div>
{:else if preseason}
<div class="loading">
    <p>Preseason, No Standings Yet</p>
</div>
{:else}
    <div class="standingsTable" class:refreshing={refreshing}>
        {#if refreshing}
            <div class="loadingInline refreshBar">
                <LinearProgress indeterminate />
            </div>
        {/if}
        <table class="standingsDataTable" aria-label="League Standings">
            <thead>
                <tr>
                    <th class="center">Team</th>
                    {#each columnOrder as column}
                        <th class="center wrappable">
                            <span class="sortableHeader" role="button" tabindex="0" onclick={() => handleSort(column.field)} onkeydown={(e) => e.key === 'Enter' && handleSort(column.field)}>
                                {#if sortField === column.field}
                                    <span class="sortIndicator">{sortDirection === 'desc' ? '▼' : '▲'}</span>
                                {/if}
                                {getColumnLabel(column)}
                            </span>
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each sortField ? sortedStandings : standings as standing (standing.keyValue)}
                    <tr animate:flip={{ duration: 1100 }}>
                        <td class="teamCell">
                            <div class="teamButton" onclick={() => gotoManager({leagueTeamManagers, rosterID: standing.rosterID})}>
                                <img alt="team avatar" class="teamAvatar" src={standing.team?.avatar} />
                                <div class="teamName">{truncateTeamName(standing.team?.name)}</div>
                            </div>
                        </td>
                        {#each columnOrder as column}
                            <td class="center">
                                <span class="statCell" style={getColumnStyle(column.field, standing[column.field])}>{standing[column.field]}</span>
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="statsLegend">
        <p class="statsLegendTitle">Key Index</p>
        <div class="statsLegendGrid">
            <div class="statsLegendItem"><span class="statsLegendKey">W</span><span>Wins</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">T</span><span>Ties</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">L</span><span>Losses</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">DW</span><span>Division Wins</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">DT</span><span>Division Ties</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">DL</span><span>Division Losses</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">PF</span><span>Points For</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">PA</span><span>Points Against</span></div>
            <div class="statsLegendItem"><span class="statsLegendKey">STR</span><span>Streak</span></div>
        </div>
    </div>
{/if}

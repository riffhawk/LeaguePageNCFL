<script>
    import { leagueName, round } from '$lib/utils/helper';
        import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';
        import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
        import LinearProgress from '@smui/linear-progress';
    import { onMount } from 'svelte';
    import Standing from './Standing.svelte';

    export let standingsData, leagueTeamManagersData;

    // Least important to most important (i.e. the most important [usually wins] goes last)
    // Edit this to match your leagues settings
    const sortOrder = ["fptsAgainst", "divisionTies", "divisionWins", "fpts", "ties", "wins"];

    // Column order from left to right
    const columnOrder = [{name: "Wins", field: "wins"}, {name: "Ties", field: "ties"}, {name: "Losses", field: "losses"}, {name: "Div. Wins", field: "divisionWins"}, {name: "Div. Ties", field: "divisionTies"}, {name: "Div. Losses", field: "divisionLosses"}, {name: "Total Points", field: "fpts"}, {name: "Points Against", field: "fptsAgainst"}, {name: "Streak", field: "streak"}]

    let loading = true;
    let preseason = false;
    let standings, year, leagueTeamManagers;
    let filters = {};

    columnOrder.forEach(col => {
        filters[col.field] = 'all';
    });

    function getUniqueValues(field) {
        if (!standings) return [];
        const values = [...new Set(standings.map(s => s[field]))];
        return values.sort((a, b) => b - a);
    }

    $: filteredStandings = standings ? standings.filter(standing => {
        return columnOrder.every(col => {
            if (filters[col.field] === 'all') return true;
            return String(standing[col.field]) === String(filters[col.field]);
        });
    }) : [];

    function clearFilters() {
        columnOrder.forEach(col => {
            filters[col.field] = 'all';
        });
        filters = {...filters};
    }

    $: hasActiveFilters = Object.values(filters).some(v => v !== 'all');

    onMount(async () => {
        const asyncStandingsData = await standingsData;
        if(!asyncStandingsData) {
            loading = false;
            preseason = true;
            return;
        }
        const {standingsInfo, yearData} = asyncStandingsData;
        leagueTeamManagers = await leagueTeamManagersData;
        year = yearData;

        let finalStandings = Object.keys(standingsInfo).map((key) => standingsInfo[key]);

        for(const sortType of sortOrder) {
            if(!finalStandings[0][sortType] && finalStandings[0][sortType] != 0) {
                continue;
            }
            finalStandings = [...finalStandings].sort((a,b) => b[sortType] - a[sortType]);
        }

        standings = finalStandings;
        loading = false;
    })

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

    :global(.center) {
        text-align: center;
    }

    :global(.wrappable) {
        white-space: normal;
        line-height: 1.2em;
    }

    h1 {
        margin-bottom: 0.25rem;
        font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin-top: 1.5em;
        font-size: 1em;
    }

    .filterControls {
        max-width: 100%;
        margin: 1em auto;
        padding: 0 1em;
    }

    .filterRow {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75em;
        justify-content: center;
    }

    .filterItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25em;
    }

    .filterItem label {
        font-size: 0.75em;
        font-weight: 600;
        color: var(--g555);
    }

    .filterItem select {
        padding: 0.4em 0.6em;
        border-radius: 4px;
        border: 1px solid var(--bbb);
        background: var(--fff);
        font-family: 'Rubik', sans-serif;
        font-size: 0.85em;
        min-width: 70px;
    }

    .clearBtn {
        margin-top: 0.75em;
        padding: 0.5em 1em;
        background: var(--g555);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'Rubik', sans-serif;
        font-size: 0.85em;
    }

    .clearBtn:hover {
        background: #444;
    }

    .standingsTable {
        max-width: 100%;
        overflow-x: scroll;
        margin: 0.5em 0 5em;
        font-family: 'Rubik', sans-serif;
    }

    .standingsTable :global(*) {
        font-family: 'Rubik', sans-serif;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 0.9em;
            margin-top: 1em;
            padding: 0 0.5em;
        }
        .standingsTable {
            margin: 0.25em 0 3em;
        }
    }

    @media (max-width: 480px) {
        h1 {
            font-size: 0.8em;
        }
        .loading {
            width: 95%;
            margin: 40px auto;
        }
    }
</style>

<h1>{year ?? ''} {leagueName} Standings</h1>

{#if loading}
    <!-- promise is pending -->
    <div class="loading">
        <p>Loading Standings...</p>
        <LinearProgress indeterminate />
    </div>
{:else if preseason}
<div class="loading">
    <p>Preseason, No Standings Yet</p>
</div>
{:else}
    <div class="filterControls">
        <div class="filterRow">
            {#each columnOrder as column}
                <div class="filterItem">
                    <label>{column.name}</label>
                    <select bind:value={filters[column.field]}>
                        <option value="all">All</option>
                        {#each getUniqueValues(column.field) as value}
                            <option value={value}>{value}</option>
                        {/each}
                    </select>
                </div>
            {/each}
        </div>
        {#if hasActiveFilters}
            <button class="clearBtn" on:click={clearFilters}>Clear Filters</button>
        {/if}
    </div>
    <div class="standingsTable">
        <DataTable table$aria-label="League Standings" >
            <Head> <!-- Team name  -->
                <Row>
                    <Cell class="center">Team</Cell>
                    {#each columnOrder as column}
                        <Cell class="center wrappable">{column.name}</Cell>
                    {/each}
                </Row>
            </Head>
            <Body>
                <!--    Standing         -->
                {#each filteredStandings as standing}
                    <Standing {columnOrder} {standing} {leagueTeamManagers} team={getTeamFromTeamManagers(leagueTeamManagers, standing.rosterID)} />
                {/each}
            </Body>
        </DataTable>
    </div>
{/if}

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
    }

    .standingsTable :global(*) {
        font-family: 'Rubik', sans-serif;
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 2.8em;
            margin-top: 0em;
            padding: 21px 0.5em;
        }
        .standingsTable {
            margin: 0.25em 12px 3em;
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
    }
</style>

<h1>{year ?? ''} NCFL<br/>STANDINGS</h1>

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
    <div class="standingsTable">
        <DataTable table$aria-label="League Standings" >
            <Head>
                <Row>
                    <Cell class="center">Team</Cell>
                    {#each columnOrder as column}
                        <Cell class="center wrappable">
                            <span class="sortableHeader" role="button" tabindex="0" on:click={() => handleSort(column.field)} on:keydown={(e) => e.key === 'Enter' && handleSort(column.field)}>
                                {#if sortField === column.field}
                                    <span class="sortIndicator">{sortDirection === 'desc' ? '▼' : '▲'}</span>
                                {/if}
                                {column.name}
                            </span>
                        </Cell>
                    {/each}
                </Row>
            </Head>
            <Body>
                {#each sortField ? sortedStandings : standings as standing}
                    <Standing {columnOrder} {standing} {leagueTeamManagers} team={getTeamFromTeamManagers(leagueTeamManagers, standing.rosterID)} />
                {/each}
            </Body>
        </DataTable>
    </div>
{/if}

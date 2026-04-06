<script>
    import { onMount } from 'svelte';
    import lottie from 'lottie-web';
    
    export let data;
    
    let lottieContainer;
    
    function initSkullLottie(node) {
        const anim = lottie.loadAnimation({
            container: node,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/pixel-skull.json'
        });
        return {
            destroy() {
                anim.destroy();
            }
        };
    }
    let teams = [];
    let weeks = [];
    let graveyard = [];
    let closeCalls = [];
    let winnerId = null;

    $: {
        const rawData = data.data || [];
        
        const uniqueWeeks = [...new Set(rawData.map(d => d.week))].sort((a, b) => a - b).filter(w => w <= 11);
        weeks = uniqueWeeks;
        
        const teamMap = {};
        rawData.forEach(d => {
            if (!teamMap[d.team_id]) {
                teamMap[d.team_id] = {
                    team_id: d.team_id,
                    team_name: d.team_name || d.display_name,
                    username: d.username,
                    logo_url: d.logo_url,
                    weeks: {},
                    eliminated: false,
                    eliminatedWeek: null
                };
            }
            teamMap[d.team_id].weeks[d.week] = {
                points: d.team_fantasy_points,
                rank: d.team_fantasy_points_rank
            };
        });
        
        let tempTeams = Object.values(teamMap);
        let tempGraveyard = [];
        let tempCloseCalls = [];
        let eliminatedTeamIds = new Set();
        
        weeks.forEach(week => {
            let lowestScore = Infinity;
            let lowestTeam = null;
            let secondLowestScore = Infinity;
            let secondLowestTeam = null;
            
            tempTeams.forEach(team => {
                if (eliminatedTeamIds.has(team.team_id)) return;
                
                const weekData = team.weeks[week];
                if (weekData) {
                    if (weekData.points < lowestScore) {
                        secondLowestScore = lowestScore;
                        secondLowestTeam = lowestTeam;
                        lowestScore = weekData.points;
                        lowestTeam = team;
                    } else if (weekData.points < secondLowestScore) {
                        secondLowestScore = weekData.points;
                        secondLowestTeam = team;
                    }
                }
            });
            
            if (lowestTeam) {
                lowestTeam.eliminated = true;
                lowestTeam.eliminatedWeek = week;
                eliminatedTeamIds.add(lowestTeam.team_id);
                tempGraveyard.push({
                    ...lowestTeam,
                    points: lowestScore,
                    week: week
                });
            }
            
            if (secondLowestTeam && secondLowestScore - lowestScore <= 5) {
                tempCloseCalls.push({
                    team_name: secondLowestTeam.team_name,
                    week: week,
                    points: secondLowestScore
                });
            }
        });
        
        tempTeams.sort((a, b) => {
            if (!a.eliminated && !b.eliminated) {
                const lastWeek = weeks[weeks.length - 1];
                const aRank = a.weeks[lastWeek]?.rank || 99;
                const bRank = b.weeks[lastWeek]?.rank || 99;
                return aRank - bRank;
            }
            if (!a.eliminated && b.eliminated) return -1;
            if (a.eliminated && !b.eliminated) return 1;
            return b.eliminatedWeek - a.eliminatedWeek;
        });
        
        teams = tempTeams;
        graveyard = tempGraveyard;
        closeCalls = tempCloseCalls;
        
        // Find winner: highest scorer in week 11 among non-eliminated teams
        const finalWeek = 11;
        let highestScore = -Infinity;
        let winner = null;
        tempTeams.forEach(team => {
            if (!team.eliminated && team.weeks[finalWeek]) {
                if (team.weeks[finalWeek].points > highestScore) {
                    highestScore = team.weeks[finalWeek].points;
                    winner = team.team_id;
                }
            }
        });
        winnerId = winner;
    }
    
    function getScoreClass(rank, isElimWeek, isPastElim) {
        if (isPastElim) return 'past-eliminated';
        if (isElimWeek) return 'danger';
        return '';
    }

    function handleYearChange(event) {
        event.currentTarget.form?.requestSubmit();
    }
    
    onMount(() => {
        if (lottieContainer) {
            lottie.loadAnimation({
                container: lottieContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/squid-game.json'
            });
        }
    });
</script>

<style>
    .survivor-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 1.5em 1em 0 1em;
        display: flex;
        flex-direction: column;
        background-image: url('/survivor-bg.png');
        background-attachment: fixed;
        background-position: center 0%;
        background-repeat: repeat;
        background-size: auto;
    }
    
    .page-header {
        text-align: center;
        margin-bottom: 1.5em;
        position: relative;
    }
    
    .page-logo {
        max-width: 400px;
        width: 100%;
        height: auto;
    }
    
    .lottie-header {
        max-width: 400px;
        width: 100%;
        height: auto;
        margin: 0 auto;
    }

    .header-controls {
        position: absolute;
        left: 50%;
        bottom: -2.1em;
        transform: translateX(-50%);
        z-index: 5;
    }

    .year-filter-form {
        margin: 0;
    }

    .year-filter {
        position: relative;
    }

    .year-select {
        appearance: none;
        -webkit-appearance: none;
        border: 1px solid rgba(255, 255, 255, 0.58);
        border-radius: 999px;
        padding: 0.85em 2.9em 0.85em 1.25em;
        min-width: 108px;
        font-family: 'Rubik', sans-serif;
        font-size: 0.92em;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.96);
        text-align: center;
        text-align-last: center;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.14)),
            rgba(255, 255, 255, 0.12);
        box-shadow:
            0 10px 24px rgba(72, 44, 119, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .year-select:hover,
    .year-select:focus {
        outline: none;
        transform: translateY(-1px);
        border-color: rgba(255, 255, 255, 0.82);
        box-shadow:
            0 14px 28px rgba(72, 44, 119, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .year-filter::after {
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
    
    .content-layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 1.5em;
        margin-bottom: 0;
        padding-bottom: 0;
        align-items: start;
    }
    
    @media (max-width: 1024px) {
        .content-layout {
            grid-template-columns: 1fr;
        }
    }
    
    .error {
        background: white;
        border-radius: 12px;
        padding: 2em;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: 'Rubik', sans-serif;
        color: #e74c3c;
    }
    
    .simulator-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        padding-bottom: 0;
    }
    
    .table-wrapper {
        overflow-x: auto;
        margin: 0;
        padding: 0;
    }
    
    .table-wrapper::-webkit-scrollbar {
        height: 6px;
    }
    
    .table-wrapper::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    
    .table-wrapper::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 0;
        min-width: 520px;
    }
    
    th {
        font-family: 'Press Start 2P', cursive;
        font-weight: 600;
        font-size: 0.55em;
        text-transform: uppercase;
        color: #ffffff;
        background: #2d2d2d;
        padding: 0.8em 0.6em;
        text-align: center;
        border-bottom: 2px solid #1a1a1a;
        white-space: nowrap;
    }
    
    th:first-child {
        text-align: left;
        padding-left: 1em;
        min-width: 180px;
    }

    th:not(:first-child) {
        min-width: 58px;
        padding-left: 0.45em;
        padding-right: 0.45em;
    }
    
    td {
        font-family: 'Rubik', sans-serif;
        padding: 0.7em 0.5em;
        border-bottom: 1px solid #eee;
        text-align: center;
        font-size: 0.9em;
    }
    
    td:first-child {
        text-align: left;
        padding-left: 0.8em;
    }
    
    tr:last-child td {
        border-bottom: none;
    }
    
    tr:hover {
        background: #f5f7fa;
    }
    
    .team-cell {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .team-logo {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        background: #eee;
        flex-shrink: 0;
    }
    
    .team-name {
        font-weight: 500;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }
    
    .score {
        font-weight: 500;
        color: #333;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        white-space: nowrap;
        position: relative;
    }
    
    .score.danger {
        color: #e74c3c;
        font-weight: 600;
    }
    
    .score.winner {
        color: #27ae60;
        font-weight: 700;
        background: rgba(39, 174, 96, 0.15);
        padding: 0.2em 0.4em;
        border-radius: 4px;
    }
    
    .score.past-eliminated {
        color: #999;
    }
    
    .no-score {
        color: #ccc;
    }
    
    .eliminated-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: middle;
        position: absolute;
        right: -24px;
        top: 50%;
        transform: translateY(-50%);
    }
    
    .sidebar {
        display: flex;
        flex-direction: column;
        gap: 1.5em;
    }
    
    .sidebar-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .sidebar-header {
        background: #2d2d2d;
        color: white;
        padding: 0.5em 1em;
    }
    
    .sidebar-header h3 {
        font-family: 'Press Start 2P', cursive;
        font-weight: 700;
        font-size: 0.7em;
        margin: 0;
        line-height: 1.2;
    }
    
    .sidebar-header p {
        font-family: 'Rubik', sans-serif;
        font-size: 0.75em;
        margin: 4px 0 0 0;
        opacity: 0.8;
        line-height: 1.2;
    }
    
    .sidebar-content {
        padding: 0.8em;
    }
    
    .graveyard-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0.5em;
        background: #f0f3f6;
        border-radius: 8px;
        margin-bottom: 0.5em;
        font-family: 'Rubik', sans-serif;
        font-size: 0.85em;
    }
    
    .graveyard-item:last-child {
        margin-bottom: 0;
    }
    
    .graveyard-name {
        flex: 1;
        color: #333;
        font-weight: 500;
    }
    
    .graveyard-info {
        color: #6b8ba4;
        font-weight: 600;
        font-size: 0.8em;
    }

    .graveyard-info .week-number {
        color: #ff69b4;
    }
    
    .close-call-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0.5em;
        background: #f5f7fa;
        border-left: 3px solid #6b8ba4;
        border-radius: 0 8px 8px 0;
        margin-bottom: 0.5em;
        font-family: 'Rubik', sans-serif;
        font-size: 0.85em;
    }
    
    .close-call-item:last-child {
        margin-bottom: 0;
    }
    
    .close-call-name {
        flex: 1;
        color: #333;
        font-weight: 500;
    }
    
    .close-call-info {
        color: #4a6b82;
        font-weight: 600;
        font-size: 0.8em;
    }
    
    .empty-state {
        color: #999;
        font-family: 'Rubik', sans-serif;
        font-size: 0.9em;
        text-align: center;
        padding: 1em;
    }
    
    
    .survivor-container {
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
    }
    
    .page-footer {
        text-align: center;
        margin-top: 5px;
        margin-bottom: 0 !important;
        padding: 0 !important;
        position: relative;
        z-index: 100;
        pointer-events: none;
        line-height: 0;
        font-size: 0;
    }
    
    .footer-image {
        max-width: 450px;
        width: 80%;
        height: auto;
        display: block;
        margin: 0 auto;
        padding: 0;
        vertical-align: bottom;
    }
    
    @media (max-width: 768px) {
        .survivor-container {
            background-image: url('/survivor-bg-mobile.png');
        }

        .page-header {
            margin-bottom: 3.9em;
        }

        .header-controls {
            bottom: -2.75em;
        }

        .year-select {
            min-width: 100px;
            padding: 0.72em 2.5em 0.72em 1em;
            font-size: 0.84em;
        }

        table {
            min-width: 460px;
        }

        th {
            font-size: 0.46em;
            padding: 0.65em 0.35em;
        }

        th:first-child {
            min-width: 120px;
            padding-left: 0.7em;
        }

        th:not(:first-child) {
            min-width: 52px;
            padding-left: 0.3em;
            padding-right: 0.3em;
        }

        td {
            padding: 0.6em 0.35em;
            font-size: 0.82em;
        }

        td:first-child {
            padding-left: 0.6em;
        }

        .team-cell {
            gap: 6px;
        }

        .team-logo {
            width: 22px;
            height: 22px;
        }
        
        .team-name {
            max-width: 84px;
            font-size: 0.92em;
        }
    }
    
    :global(html),
    :global(body),
    :global(#app),
    :global(main),
    :global(.app-container) {
        margin: 0 !important;
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
    }
</style>

<svelte:head>
    <title>Squid Games | NCFL</title>
</svelte:head>

<div class="survivor-container">
    <div class="page-header">
        <div bind:this={lottieContainer} class="lottie-header"></div>
        <div class="header-controls">
            <div class="year-filter" aria-label="Filter Survivor Series by year">
                <form class="year-filter-form" method="GET" action="/survivor-series">
                    <select
                        id="survivor-year-select"
                        class="year-select"
                        name="year"
                        on:change={handleYearChange}
                    >
                        {#each data.availableYears as year}
                            <option value={year} selected={year === data.selectedYear}>{year}</option>
                        {/each}
                    </select>
                </form>
            </div>
        </div>
    </div>
    
    {#if data.error}
        <div class="error">{data.error}</div>
    {:else}
        <div class="content-layout">
            <div class="simulator-card">
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Team</th>
                                {#each weeks as week}
                                    <th>Week {week}</th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each teams as team}
                                <tr>
                                    <td>
                                        <div class="team-cell">
                                            {#if team.logo_url}
                                                <img src={team.logo_url} alt={team.team_name} class="team-logo" />
                                            {:else}
                                                <div class="team-logo"></div>
                                            {/if}
                                            <span class="team-name">{team.team_name}</span>
                                        </div>
                                    </td>
                                    {#each weeks as week}
                                        <td>
                                            {#if team.weeks[week]}
                                                {@const isElimWeek = team.eliminated && team.eliminatedWeek === week}
                                                {@const isPastElim = team.eliminated && week > team.eliminatedWeek}
                                                {@const isWinner = week === 11 && team.team_id === winnerId}
                                                {#if isPastElim}
                                                    <span class="no-score">—</span>
                                                {:else}
                                                    <span class="score {getScoreClass(team.weeks[week].rank, isElimWeek, false)} {isWinner ? 'winner' : ''}">
                                                        {team.weeks[week].points?.toFixed(1)}
                                                        {#if isElimWeek}
                                                            <span use:initSkullLottie class="eliminated-icon"></span>
                                                        {/if}
                                                    </span>
                                                {/if}
                                            {:else}
                                                <span class="no-score">—</span>
                                            {/if}
                                        </td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="sidebar">
                <div class="sidebar-card">
                    <div class="sidebar-header">
                        <h3>The Graveyard</h3>
                        <p>Eliminated teams</p>
                    </div>
                    <div class="sidebar-content">
                        {#if graveyard.length > 0}
                            {#each graveyard as team}
                                <div class="graveyard-item">
                                    <span class="graveyard-name">{team.team_name}</span>
                                    <span class="graveyard-info">Week <span class="week-number">{team.week}</span> {team.points?.toFixed(1)}</span>
                                </div>
                            {/each}
                        {:else}
                            <div class="empty-state">No eliminations yet</div>
                        {/if}
                    </div>
                </div>
                
                <div class="sidebar-card">
                    <div class="sidebar-header">
                        <h3>Close Calls</h3>
                        <p>Survived by ≤5 points</p>
                    </div>
                    <div class="sidebar-content">
                        {#if closeCalls.length > 0}
                            {#each closeCalls as call}
                                <div class="close-call-item">
                                    <span class="close-call-name">{call.team_name}</span>
                                    <span class="close-call-info">W{call.week} {call.points?.toFixed(1)}</span>
                                </div>
                            {/each}
                        {:else}
                            <div class="empty-state">No close calls yet</div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}
    
    <div class="page-footer">
        <img src="/squid-games-footer.png" alt="Squid Games Guards" class="footer-image" />
    </div>
</div>

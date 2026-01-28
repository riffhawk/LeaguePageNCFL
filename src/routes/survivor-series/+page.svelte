<script>
    export let data;
    
    let teams = [];
    let weeks = [];
    let graveyard = [];
    let closeCalls = [];
    
    $: {
        const rawData = data.data || [];
        
        const uniqueWeeks = [...new Set(rawData.map(d => d.week))].sort((a, b) => a - b);
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
    }
    
    function getScoreClass(rank, isElimWeek, isPastElim) {
        if (isPastElim) return 'past-eliminated';
        if (isElimWeek) return 'danger';
        return '';
    }
</script>

<style>
    .survivor-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 1.5em 1em;
    }
    
    .page-header {
        text-align: center;
        margin-bottom: 1.5em;
    }
    
    .page-logo {
        max-width: 400px;
        width: 100%;
        height: auto;
    }
    
    .content-layout {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 1.5em;
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
    }
    
    .table-wrapper {
        overflow-x: auto;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
    }
    
    th {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.8em;
        text-transform: uppercase;
        color: #00316b;
        background: #f5f5f5;
        padding: 0.8em 0.6em;
        text-align: center;
        border-bottom: 2px solid #e0e0e0;
        white-space: nowrap;
    }
    
    th:first-child {
        text-align: left;
        padding-left: 1em;
        min-width: 180px;
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
        background: #f9f9f9;
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
    }
    
    .score.danger {
        color: #e74c3c;
        font-weight: 600;
    }
    
    .score.past-eliminated {
        color: #999;
    }
    
    .no-score {
        color: #ccc;
    }
    
    .eliminated-marker {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        font-size: 10px;
        line-height: 16px;
        text-align: center;
        margin-left: 4px;
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
        background: #00316b;
        color: white;
        padding: 0.8em 1em;
    }
    
    .sidebar-header h3 {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 1em;
        margin: 0;
    }
    
    .sidebar-header p {
        font-family: 'Rubik', sans-serif;
        font-size: 0.75em;
        margin: 0.3em 0 0 0;
        opacity: 0.8;
    }
    
    .sidebar-content {
        padding: 0.8em;
    }
    
    .graveyard-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0.5em;
        background: #f8f8f8;
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
        color: #e74c3c;
        font-weight: 600;
        font-size: 0.8em;
    }
    
    .close-call-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0.5em;
        background: #fff8e6;
        border-left: 3px solid #f39c12;
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
        color: #f39c12;
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
    
    .page-footer {
        text-align: center;
        margin-top: -50px;
        padding: 0;
        position: relative;
        z-index: 10;
    }
    
    .footer-image {
        max-width: 450px;
        width: 80%;
        height: auto;
    }
    
    @media (max-width: 768px) {
        .team-name {
            max-width: 100px;
        }
        
        .page-footer {
            margin-top: -40px;
        }
        
        .footer-image {
            max-width: 320px;
            width: 85%;
        }
    }
</style>

<svelte:head>
    <title>Squid Games | NCFL</title>
</svelte:head>

<div class="survivor-container">
    <div class="page-header">
        <img src="/squid-games-logo.png" alt="Squid Games" class="page-logo" />
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
                                                {#if isPastElim}
                                                    <span class="no-score">—</span>
                                                {:else}
                                                    <span class="score {getScoreClass(team.weeks[week].rank, isElimWeek, false)}">
                                                        {team.weeks[week].points?.toFixed(1)}
                                                        {#if isElimWeek}
                                                            <span class="eliminated-marker">X</span>
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
                                    <span class="graveyard-info">Week {team.week} {team.points?.toFixed(1)}</span>
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

<script>
    import { onMount } from 'svelte';
    
    let data = [];
    let loading = true;
    let error = null;
    let week = null;
    
    const API_URL = 'https://fantasygenius-fastapi.azurewebsites.net/latest_week_team_ranks/1082055802648637440/2025';
    
    onMount(async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch data');
            const json = await response.json();
            data = json.data || [];
            if (data.length > 0) {
                week = data[0].week;
            }
            data = data.sort((a, b) => a.team_fantasy_points_rank - b.team_fantasy_points_rank);
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });
</script>

<style>
    .survivor-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2em 1em;
    }
    
    .page-title {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 2em;
        color: #00316b;
        text-align: center;
        margin-bottom: 0.5em;
    }
    
    .week-label {
        font-family: 'Rubik', sans-serif;
        font-size: 1.1em;
        color: #666;
        text-align: center;
        margin-bottom: 1.5em;
    }
    
    .loading, .error {
        background: white;
        border-radius: 12px;
        padding: 2em;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: 'Rubik', sans-serif;
    }
    
    .error {
        color: #e74c3c;
    }
    
    .rankings-table {
        width: 100%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    th {
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 0.85em;
        text-transform: uppercase;
        color: #00316b;
        background: #f5f5f5;
        padding: 1em;
        text-align: left;
        border-bottom: 2px solid #e0e0e0;
    }
    
    td {
        font-family: 'Rubik', sans-serif;
        padding: 1em;
        border-bottom: 1px solid #eee;
        vertical-align: middle;
    }
    
    tr:last-child td {
        border-bottom: none;
    }
    
    tr:hover {
        background: #f9f9f9;
    }
    
    .rank-cell {
        font-weight: 700;
        font-size: 1.2em;
        width: 60px;
        text-align: center;
    }
    
    .rank-1 { color: #f1c40f; }
    .rank-2 { color: #95a5a6; }
    .rank-3 { color: #cd7f32; }
    
    .team-cell {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .team-logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        background: #eee;
    }
    
    .team-info {
        display: flex;
        flex-direction: column;
    }
    
    .team-name {
        font-weight: 600;
        color: #333;
    }
    
    .username {
        font-size: 0.85em;
        color: #888;
    }
    
    .points-cell {
        font-weight: 600;
        color: #00316b;
    }
    
    .status-safe {
        color: #2ecc71;
        font-weight: 600;
    }
    
    .status-danger {
        color: #e74c3c;
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        th, td {
            padding: 0.75em 0.5em;
            font-size: 0.9em;
        }
        
        .team-logo {
            width: 32px;
            height: 32px;
        }
        
        .hide-mobile {
            display: none;
        }
    }
</style>

<svelte:head>
    <title>Survivor Series | NCFL</title>
</svelte:head>

<div class="survivor-container">
    <h1 class="page-title">Survivor Series</h1>
    
    {#if week}
        <p class="week-label">Week {week} Rankings</p>
    {/if}
    
    {#if loading}
        <div class="loading">Loading...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        <div class="rankings-table">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th class="hide-mobile">Ideal Pts</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data as team}
                        <tr>
                            <td class="rank-cell rank-{team.team_fantasy_points_rank}">
                                {team.team_fantasy_points_rank}
                            </td>
                            <td>
                                <div class="team-cell">
                                    {#if team.logo_url}
                                        <img src={team.logo_url} alt={team.team_name} class="team-logo" />
                                    {:else}
                                        <div class="team-logo"></div>
                                    {/if}
                                    <div class="team-info">
                                        <span class="team-name">{team.team_name || team.display_name}</span>
                                        <span class="username">@{team.username}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="points-cell">{team.team_fantasy_points?.toFixed(2)}</td>
                            <td class="hide-mobile">{team.ideal_lineup_points?.toFixed(2)}</td>
                            <td>
                                {#if team.team_fantasy_points_rank <= 10}
                                    <span class="status-safe">Safe</span>
                                {:else}
                                    <span class="status-danger">Eliminated</span>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

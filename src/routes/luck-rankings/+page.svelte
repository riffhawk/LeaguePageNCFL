<script>
  import { onMount } from 'svelte';

  let rows = $state([]);
  let matchupData = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let expandedRows = $state({});

  onMount(async () => {
    try {
      const [rankingsRes, matchupsRes] = await Promise.all([
        fetch('/luck-rankings.json'),
        fetch('/allmatch.json')
      ]);
      
      if (!rankingsRes.ok) throw new Error(rankingsRes.statusText || 'Failed to fetch rankings');
      if (!matchupsRes.ok) throw new Error(matchupsRes.statusText || 'Failed to fetch matchups');
      
      const rankingsJson = await rankingsRes.json();
      const matchupsJson = await matchupsRes.json();
      
      rows = (rankingsJson.data || []).slice().sort((a, b) => b.diff - a.diff);
      matchupData = matchupsJson.data || [];
    } catch (e) {
      error = e.message || String(e);
    } finally {
      loading = false;
    }
  });

  function getDiffClass(diff) {
    if (diff > 0) return 'positive';
    if (diff < 0) return 'negative';
    return 'neutral';
  }

  function formatDiff(diff) {
    if (diff > 0) return '+' + diff;
    return diff.toString();
  }

  function getTeamMatchups(teamName) {
    const luckyWins = [];
    const unluckyLosses = [];
    
    for (const matchup of matchupData) {
      for (const team of matchup) {
        if (team.team_name === teamName) {
          if (team.is_lucky_win) {
            const opponent = matchup.find(t => t.team_id !== team.team_id);
            luckyWins.push({
              week: team.week,
              points: team.team_fantasy_points,
              opponentName: opponent?.team_name || 'Unknown',
              opponentPoints: team.team_fantasy_points_oppo
            });
          }
          if (team.is_unlucky_loss) {
            const opponent = matchup.find(t => t.team_id !== team.team_id);
            unluckyLosses.push({
              week: team.week,
              points: team.team_fantasy_points,
              opponentName: opponent?.team_name || 'Unknown',
              opponentPoints: team.team_fantasy_points_oppo
            });
          }
        }
      }
    }
    
    return { luckyWins, unluckyLosses };
  }

  function toggleRow(teamName, type) {
    const key = `${teamName}-${type}`;
    expandedRows = { ...expandedRows, [key]: !expandedRows[key] };
  }

  function isExpanded(teamName, type) {
    return expandedRows[`${teamName}-${type}`] || false;
  }
</script>

<style>
  .page {
    padding: 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
  }
  
  h1 {
    margin-bottom: 0.25rem;
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  
  .subtitle {
    color: #666;
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
    font-family: 'Rubik', sans-serif;
    font-weight: 500;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    background: #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    font-family: 'Rubik', sans-serif;
  }
  
  thead {
    background: #c0c0c0;
  }
  
  th {
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #333;
  }
  
  th:not(:first-child) {
    text-align: center;
  }
  
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #d0d0d0;
    color: #333;
  }
  
  td:not(:first-child) {
    text-align: center;
  }
  
  .team-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .logo {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
    background: #333;
  }
  
  .team-name {
    font-weight: 500;
  }
  
  .lucky {
    color: #4ade80;
    font-weight: 600;
  }
  
  .unlucky {
    color: #f87171;
    font-weight: 600;
  }
  
  .positive {
    color: #4ade80;
    font-weight: 600;
  }
  
  .negative {
    color: #f87171;
    font-weight: 600;
  }
  
  .neutral {
    color: #888;
    font-weight: 600;
  }
  
  .label-cell {
    min-width: 120px;
  }
  
  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .badge-lucky {
    background: rgba(74, 222, 128, 0.2);
    color: #4ade80;
    border: 1px solid #4ade80;
  }
  
  .badge-unlucky {
    background: rgba(248, 113, 113, 0.2);
    color: #f87171;
    border: 1px solid #f87171;
  }
  
  .legend {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #e8e8e8;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #555;
  }
  
  .legend p {
    margin: 0.25rem 0;
  }
  
  .legend strong {
    color: #333;
  }
  
  .muted {
    color: #666;
    font-size: 0.95rem;
  }

  .details-cell {
    min-width: 200px;
    text-align: left !important;
  }

  .collapsible-section {
    margin-bottom: 0.5rem;
  }

  .collapsible-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
    user-select: none;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    font-family: inherit;
  }

  .collapsible-header:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .collapsible-header.lucky-header {
    color: #16a34a;
  }

  .collapsible-header.unlucky-header {
    color: #dc2626;
  }

  .arrow {
    font-size: 0.7rem;
    transition: transform 0.2s;
  }

  .arrow.expanded {
    transform: rotate(90deg);
  }

  .collapsible-content {
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    margin-top: 0.25rem;
    font-size: 0.8rem;
  }

  .matchup-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .matchup-item:last-child {
    border-bottom: none;
  }

  .matchup-info {
    flex: 1;
  }

  .matchup-week {
    font-weight: 600;
    color: #555;
  }

  .matchup-score {
    color: #333;
  }

  .matchup-opponent {
    color: #666;
    font-size: 0.75rem;
  }

  .matchup-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  .no-matchups {
    color: #999;
    font-style: italic;
    font-size: 0.8rem;
  }
</style>

<div class="page">
  <h1>Lucky Wins & Unlucky Losses</h1>
  <h3 class="subtitle">Sometimes it's better to be lucky than good</h3>

  {#if loading}
    <p class="muted">Loading...</p>
  {:else if error}
    <p class="muted">Error: {error}</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Lucky</th>
          <th>Unlucky</th>
          <th>+/-</th>
          <th class="label-cell">Label</th>
          <th class="details-cell">Details</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as r}
          {@const teamMatchups = getTeamMatchups(r.team_name)}
          <tr>
            <td>
              <div class="team-cell">
                <img class="logo" src={r.logo_url} alt="" onerror={(e) => e.target.style.display = 'none'} />
                <span class="team-name">{r.team_name}</span>
              </div>
            </td>
            <td class="lucky">{r.lucky}</td>
            <td class="unlucky">{r.unlucky}</td>
            <td class={getDiffClass(r.diff)}>{formatDiff(r.diff)}</td>
            <td class="label-cell">
              {#if r.label === 'Lucky Duck'}
                <span class="badge badge-lucky">Lucky Duck</span>
              {:else if r.label === 'Unlucky Duck'}
                <span class="badge badge-unlucky">Unlucky Duck</span>
              {/if}
            </td>
            <td class="details-cell">
              <div class="collapsible-section">
                <button 
                  type="button"
                  class="collapsible-header lucky-header" 
                  onclick={() => toggleRow(r.team_name, 'lucky')}
                >
                  <span class="arrow" class:expanded={isExpanded(r.team_name, 'lucky')}>&#9654;</span>
                  Lucky Wins ({teamMatchups.luckyWins.length})
                </button>
                {#if isExpanded(r.team_name, 'lucky')}
                  <div class="collapsible-content">
                    {#if teamMatchups.luckyWins.length === 0}
                      <span class="no-matchups">No lucky wins</span>
                    {:else}
                      {#each teamMatchups.luckyWins as match}
                        <div class="matchup-item">
                          <div class="matchup-info">
                            <span class="matchup-week">Week {match.week}:</span>
                            <span class="matchup-score">{match.points} - {match.opponentPoints}</span>
                            <div class="matchup-opponent">vs {match.opponentName}</div>
                          </div>
                          <img class="matchup-icon lucky-icon" src="/icons8-clover.png" alt="Lucky" />
                        </div>
                      {/each}
                    {/if}
                  </div>
                {/if}
              </div>
              
              <div class="collapsible-section">
                <button 
                  type="button"
                  class="collapsible-header unlucky-header" 
                  onclick={() => toggleRow(r.team_name, 'unlucky')}
                >
                  <span class="arrow" class:expanded={isExpanded(r.team_name, 'unlucky')}>&#9654;</span>
                  Unlucky Losses ({teamMatchups.unluckyLosses.length})
                </button>
                {#if isExpanded(r.team_name, 'unlucky')}
                  <div class="collapsible-content">
                    {#if teamMatchups.unluckyLosses.length === 0}
                      <span class="no-matchups">No unlucky losses</span>
                    {:else}
                      {#each teamMatchups.unluckyLosses as match}
                        <div class="matchup-item">
                          <div class="matchup-info">
                            <span class="matchup-week">Week {match.week}:</span>
                            <span class="matchup-score">{match.points} - {match.opponentPoints}</span>
                            <div class="matchup-opponent">vs {match.opponentName}</div>
                          </div>
                          <img class="matchup-icon unlucky-icon" src="/icons8-horseshoe.png" alt="Unlucky" />
                        </div>
                      {/each}
                    {/if}
                  </div>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
    
    <div class="legend">
      <p><strong>Lucky:</strong> Won matchup scoring in bottom half of league.</p>
      <p><strong>Unlucky:</strong> Lost matchup scoring in top half.</p>
      <p><strong>+/-:</strong> Net lucky/unlucky weeks</p>
    </div>
  {/if}
</div>

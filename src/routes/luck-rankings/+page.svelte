<script>
  import { onMount } from 'svelte';

  let rows = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const res = await fetch('/luck-rankings.json');
      if (!res.ok) throw new Error(res.statusText || 'Failed to fetch');
      const json = await res.json();
      rows = (json.data || []).slice().sort((a, b) => b.diff - a.diff);
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
</script>

<style>
  .page {
    padding: 1.5rem;
    max-width: 900px;
    margin: 0 auto;
  }
  
  h1 {
    margin-bottom: 0.25rem;
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  
  .subtitle {
    color: #888;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    background: #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
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
</style>

<div class="page">
  <h1>Lucky Wins & Unlucky Losses</h1>
  <p class="subtitle">Who has the right to complain?</p>

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
        </tr>
      </thead>
      <tbody>
        {#each rows as r}
          <tr>
            <td>
              <div class="team-cell">
                <img class="logo" src={r.logo_url} alt="" on:error={(e) => e.target.style.display = 'none'} />
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

<script>
  import { onMount } from 'svelte';

  let rows = [];
  let loading = true;
  let error = null;

  function labelFor(luck) {
    if (luck >= 10) return 'Very Lucky';
    if (luck >= 5) return 'Lucky';
    if (luck >= 0) return 'Even';
    if (luck >= -5) return 'Unlucky';
    return 'Very Unlucky';
  }

  onMount(async () => {
    try {
      const res = await fetch('/luck-rankings.json');
      if (!res.ok) throw new Error(res.statusText || 'Failed to fetch');
      const json = await res.json();
      rows = (json.data || []).slice().sort((a,b) => b.luck_index - a.luck_index);
    } catch (e) {
      error = e.message || String(e);
    } finally {
      loading = false;
    }
  });
</script>

<style>
  .page { padding: 1.5rem; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 0.5rem; border-bottom: 1px solid #eee; text-align: left; }
  .logo { width: 28px; height: 28px; object-fit: cover; border-radius: 4px; }
  .muted { color: #666; font-size: 0.95rem }
</style>

<div class="page">
  <h1>Luck Rankings</h1>

  {#if loading}
    <p class="muted">Loading…</p>
  {:else if error}
    <p class="muted">Error: {error}</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>Luck Index</th>
          <th>Label</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as r, i}
          <tr>
            <td>{i + 1}</td>
            <td>
              <img class="logo" src={r.logo_url} alt="" on:error={(e) => e.target.style.display = 'none'} />
              <span style="margin-left:8px">{r.display_name || r.team_name}</span>
            </td>
            <td>{r.luck_index}</td>
            <td>{labelFor(r.luck_index)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

</div>

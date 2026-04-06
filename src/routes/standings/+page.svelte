<script>
	import { Standings } from '$lib/components'

	export let data;
</script>

<style>
	.holder {
		position: relative;
		z-index: 1;
		text-align: center;
		min-height: 100vh;
		padding: 1.5rem 0 2rem;
		background: linear-gradient(180deg, #8e9eab 0%, #eef2f3 100%);
	}
</style>

<div class="holder">
	<Standings
		standingsData={data.standingsData}
		leagueTeamManagersData={data.leagueTeamManagersData}
		availableYears={data.availableYears}
		selectedYear={data.selectedYear}
	/>
</div>

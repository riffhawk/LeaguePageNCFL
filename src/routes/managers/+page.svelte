<script>
        import LinearProgress from '@smui/linear-progress';
    import {AllManagers} from '$lib/components';
        import { onMount } from 'svelte';
        import { goto } from '$app/navigation';

        export let data;
        const {managers, leagueTeamManagersData} = data;

    onMount(() => {
        if(!managers.length) {
            goto('/');
        }
    })
</script>

<style>
        .main {
                position: relative;
                z-index: 1;
                font-family: 'Space Mono', monospace;
                padding: 0;
                background:
                    radial-gradient(circle at top, rgba(162, 221, 255, 0.72) 0%, rgba(208, 238, 255, 0.52) 22%, rgba(246, 251, 255, 0.9) 48%, #ffffff 72%),
                    linear-gradient(180deg, #fafdff 0%, #d9f1ff 24%, #f9fcff 58%, #ffffff 100%);
                min-height: 100vh;
        }
    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }
</style>

<div class="main">
    {#await leagueTeamManagersData}
        <!-- promise is pending -->
        <div class="loading">
            <p>Retrieving managers...</p>
            <LinearProgress indeterminate />
        </div>
    {:then leagueTeamManagers}
        {#if managers.length}
            <AllManagers {managers}  {leagueTeamManagers}/>
        {/if}
    {:catch error}
        <!-- promise was rejected -->
        <p>Something went wrong: {error.message}</p>
    {/await}
</div>

<script>
        import LinearProgress from '@smui/linear-progress';
        import { Rosters } from '$lib/components'

        export let data;
        const rostersInfo = data.rostersInfo;
</script>

<style>
        .holder {
                position: relative;
                z-index: 1;
                background-image: url("/rosters-background.png");
                background-size: cover;
                background-position: center;
                background-repeat: repeat;
                min-height: 100vh;
        }
        .loading {
                display: block;
                width: 85%;
                max-width: 500px;
                margin: 80px auto;
        }
</style>

<div class="holder">
        {#await rostersInfo}
                <div class="loading">
                        <p>Retrieving roster data...</p>
                        <br />
                        <LinearProgress indeterminate />
                </div>
        {:then [leagueData, rosterData, leagueTeamManagers, playersInfo]}
                <!-- promise was fulfilled -->
                <Rosters {leagueData} {rosterData} {leagueTeamManagers} {playersInfo} /> <!-- displays rosters -->
        {:catch error}
                <!-- promise was rejected -->
                <p>Something went wrong: {error.message}</p>
        {/await}
</div>

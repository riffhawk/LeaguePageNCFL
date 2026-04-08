<script>
    import { leagueName } from '$lib/utils/helper';
    import { getDatesActive } from '$lib/utils/helperFunctions/universalFunctions';
    import ManagerRow from './ManagerRow.svelte'

    export let managers, leagueTeamManagers;

    let innerWidth;

    const isRetired = (manager) => {
        if (!manager?.managerID || !leagueTeamManagers) return false;
        return Boolean(getDatesActive(leagueTeamManagers, manager.managerID)?.end);
    };

    $: sortedManagers = [...managers].sort((a, b) => {
        const aRetired = isRetired(a);
        const bRetired = isRetired(b);

        if (aRetired === bRetired) return 0;
        return aRetired ? 1 : -1;
    });
</script>

<svelte:window bind:innerWidth={innerWidth} />

<style>
    .managerContainer {
        width: 100%;
        margin: -2em 0 0;
    }

    .managerConstrained {
        width: 97%;
        max-width: 800px;
        margin: 0 auto;
    }

    .page-footer {
        text-align: center;
        margin-top: 18px;
        margin-bottom: 0;
        padding: 0;
        line-height: 0;
        font-size: 0;
        pointer-events: none;
    }

    .footer-image {
        max-width: 100%;
        width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
        padding: 0;
        vertical-align: bottom;
    }

    h2 {
        text-align: center;
        font-size: 2.8em;
        margin: 35px 0 1em;
        line-height: 1em;
        font-family: 'Space Mono', monospace;
        font-weight: 700;
    }

    @media (max-width: 520px) {
        h2 {
            text-align: center;
            font-size: 2em;
            margin: 35px 0 1em;
            line-height: 1em;
        }

        .page-footer {
            margin-top: 14px;
        }

        .footer-image {
            width: 96%;
        }
    }
</style>

<div class="managerContainer">
    <h2>{leagueName} Managers</h2>
    <div class="managerConstrained">
        {#each sortedManagers as manager}
            <ManagerRow {manager} {leagueTeamManagers} key={managers.indexOf(manager)} />
        {/each}
    </div>
    <div class="page-footer">
        <img src="/managers-footer.png" alt="NCFL managers footer art" class="footer-image" />
    </div>

</div>

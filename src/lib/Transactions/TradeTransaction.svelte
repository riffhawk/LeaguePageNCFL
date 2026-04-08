<script>
        import { gotoManager } from '$lib/utils/helper';
        import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';
        import TransactionMove from './TransactionMove.svelte';

        export let transaction, players, leagueTeamManagers;
</script>

<style>
    .tradeTransaction {
        display: flex;
        position: relative;
        flex-direction: column;
        margin-bottom: 1em;
    }
    
    .name {
        position: relative;
        text-align: center;
        overflow: hidden;
        padding: 0.5em 0.25em;
    }

    .avatar {
        border-radius: 50%;
        height: 40px;
        width: 40px;
        border: 2px solid rgba(82, 163, 255, 0.7);
        background-color: rgba(255, 255, 255, 0.85);
        box-shadow: 0 6px 14px rgba(72, 44, 119, 0.14);
    }

    .ownerName {
        display: block;
        font-weight: normal;
        line-height: 1.2em;
        margin: 0.2em 0;
        font-size: 0.75em;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: 'Space Mono', monospace;
        color: #1f2937;
    }

    .currentOwner {
        font-style: italic;
        color: var(--aaa);
        font-size: 0.7em;
    }

    .clickable {
        cursor: pointer;
    }

    .date {
        color: #667085;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.5em;
        text-align: center;
        padding: 0.7em 0 1em;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.22)),
            rgba(255, 255, 255, 0.2);
        border-radius: 0 0 0 40px;
        border-left: 2px solid rgba(82, 163, 255, 0.65);
        border-right: 1px solid rgba(255, 255, 255, 0.58);
        margin-bottom: 3em;
        box-shadow:
            0 12px 26px rgba(72, 44, 119, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.62);
        backdrop-filter: blur(16px) saturate(150%);
        -webkit-backdrop-filter: blur(16px) saturate(150%);
    }

    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        /*
            the height setting is ignored, but
            allows the holder class div to have
            a height of 100%
        */
        height: 1px;
    }

    tbody {
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.22)),
            rgba(255, 255, 255, 0.2);
        border-top: 2px solid rgba(82, 163, 255, 0.65);
        border-left: 2px solid rgba(82, 163, 255, 0.65);
        border-right: 1px solid rgba(255, 255, 255, 0.58);
        box-shadow:
            0 12px 26px rgba(72, 44, 119, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.62);
        backdrop-filter: blur(16px) saturate(150%);
        -webkit-backdrop-filter: blur(16px) saturate(150%);
    }

    .holder {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        max-width: 100%;
        overflow: hidden;
    }

    @media (max-width: 420px) {
        .ownerName {
            font-size: 0.8em;
        }
    }
</style>

<div class="tradeTransaction">
    <table>
        <thead>
            <tr>
                {#each transaction.rosters as owner}
                    <th class="name clickable" style="width: {1 / transaction.rosters.length * 100}%;" onclick={() => gotoManager({year: transaction.season, leagueTeamManagers, rosterID: owner})}>
                        <div class="holder">
                            <img class="avatar" src="{getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).avatar}" alt="{getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name} avatar"/>
                            <span class="ownerName">
                                {getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name}
                                {#if getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name != getTeamFromTeamManagers(leagueTeamManagers, owner).name}
                                    <br />
                                    <span class="currentOwner">({getTeamFromTeamManagers(leagueTeamManagers, owner).name})</span>
                                {/if}
                            </span>
                        </div>
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each transaction.moves as move}
                <TransactionMove {players} {move} type={transaction.type} {leagueTeamManagers} season={transaction.season} />
            {/each}
        </tbody>
    </table>
    <span class="date">
        {transaction.date}
    </span>
</div>

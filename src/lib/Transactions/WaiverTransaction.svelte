<script>
        import { gotoManager } from '$lib/utils/helper';
        import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';

        export let transaction, players, leagueTeamManagers;

    const owner = transaction.rosters[0];

    const getAvatar = (pos, player) => {
        if(pos == 'DEF') {
            return `background-image: url(https://sleepercdn.com/images/team_logos/nfl/${player.toLowerCase()}.png)`;
        }
        return `background-image: url(https://sleepercdn.com/content/nfl/players/thumb/${player}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`;
    }
</script>

<style>
    .waiverTransaction {
        display: flex;
        flex-direction: column;
        margin-bottom: 1em;
    }
    
    .name {
        position: relative;
        padding-left: 12px;
        z-index: 2;
    }

    .core {
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 1;
        border-radius: 0 0 0 40px;
        border: 1px solid rgba(255, 255, 255, 0.58);
        border-left: 2px solid rgba(82, 163, 255, 0.65);
        border-bottom: none;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.22)),
            rgba(255, 255, 255, 0.2);
        box-shadow:
            0 12px 26px rgba(72, 44, 119, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.62);
        backdrop-filter: blur(16px) saturate(150%);
        -webkit-backdrop-filter: blur(16px) saturate(150%);
    }

    .avatarAndDetails {
        display: flex;
        padding: 25px 0 0;
        flex-direction: column;
        justify-content: end;
    }

    .avatar {
        position: absolute;
        left: 8px;
        top: 6px;
        border-radius: 50%;
        height: 40px;
        width: 40px;
        border: 2px solid rgba(82, 163, 255, 0.7);
        background-color: rgba(255, 255, 255, 0.85);
        box-shadow: 0 6px 14px rgba(72, 44, 119, 0.14);
    }

    .ownerName {
        display: inline-block;
        border-bottom: 2px solid rgba(82, 163, 255, 0.65);
        margin: 0 0 0 22px;
        padding-right: 30px;
        padding-left: 30px;
        font-family: 'Space Mono', monospace;
        color: #1f2937;
    }

    .playerAvatar {
        display: inline-block;
        vertical-align: middle;
        height: 50px;
        width: 50px;
        background-position: center;
        border: 2px solid;
        border-radius: 100%;
        background-repeat: no-repeat;
        background-size: auto 50px;
        position: relative;
    }

    .currentOwner {
        font-style: italic;
        color: var(--aaa);
    }

    .clickable {
        cursor: pointer;
    }

    .details {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 80%;
        padding: 0 10%;
    }

    .player {
        display: flex;
    }

    .playerName {
        font-size: 0.8em;
        line-height: 1em;
        text-align: center;
        font-family: 'Space Mono', monospace;
    }

    .playerInfo {
        font-size: 0.6em;
        color: var(--g555);
        line-height: 1em;
        font-family: 'Space Mono', monospace;
    }

    .add {
        color: #00ceb8;
    }

    .drop {
        color: #ff2a6d;
    }

    .indicator {
        position: absolute;
        bottom: -8px;
        right: -8px;
    }

    .nameHolder {
        display: flex;
        flex-direction: column;
        padding-left: 0.5em;
        justify-content: center;
        align-items: center;
    }

    .bid {
        color: var(--g555);
        font-style: italic;
    }

    .date {
        color: #667085;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.5em;
        text-align: center;
        margin-top: 0.7em;
    }

    @media (max-width: 410px) {
        .player {
            flex-direction: column;
            align-items: center;
        }

        .details {
            width: 90%;
            padding: 0 5%;
        }

        .nameHolder {
            margin-top: 0.5em;
            padding-left: 0;
            font-size: 0.9em;
        }
    }
</style>

<div class="waiverTransaction clickable" onclick={() => gotoManager({year: transaction.season, leagueTeamManagers, rosterID: owner})}>
    <div class="name">
        <span class="ownerName">
            {getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name}
            {#if getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name != getTeamFromTeamManagers(leagueTeamManagers, owner).name}
                <span class="currentOwner">({getTeamFromTeamManagers(leagueTeamManagers, owner).name})</span>
            {/if}
            {#if transaction.moves[0][0].bid}
                <span class="bid">
                    - {transaction.moves[0][0].bid}$
                </span>
            {/if}
        </span>
        <img class="avatar" src="{getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).avatar}" alt="{getTeamFromTeamManagers(leagueTeamManagers, owner, transaction.season).name} avatar"/>
    </div>
    <div class="core">
        <div class="avatarAndDetails">
            <div class="details">
                {#each transaction.moves as move}
                    <div class="player">
                        <div class="playerAvatar" style="border-color: var(--{players[move[0].player].pos}); background-color: var(--{move[0].type == "Added" ? "waiverAdd" : "waiverDrop"}); {getAvatar(players[move[0].player].pos, move[0].player)}">
                            {#if move[0].type == "Added"}
                                <i class="add indicator material-icons" aria-hidden="true">add_circle</i>
                            {:else if move[0].type == "Dropped"}
                                <i class="drop indicator material-icons" aria-hidden="true">do_not_disturb_on</i>
                            {/if}
                        </div>
                        <span class="nameHolder">
                            <span class="playerName">{`${players[move[0].player].fn} ${players[move[0].player].ln}`}</span>
                            <span class="playerInfo">
                                <span>{players[move[0].player].pos}</span>
                                {#if players[move[0].player].t}
                                    -
                                    <span>{players[move[0].player].t}</span> 
                                {/if}
                            </span>
                        </span>
                    </div>
                {/each}
            </div>
        </div>
        <span class="date">
            {transaction.date}
        </span>
    </div>
</div>

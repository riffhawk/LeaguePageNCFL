<script>
        import { goto } from "$app/navigation";
        import { getTeamData } from "$lib/utils/helperFunctions/universalFunctions";

    export let playerOne, playerTwo, leagueTeamManagers;

    const users = Object.keys(leagueTeamManagers.users);

    const rivalries = {
        "825182685528989696": ["1126211909117669376", "1126239942197223424"],
        "1126215688974073856": ["1010266541588701184", "1126239942197223424"],
        "999577074555883520": ["1247690754596290560", "1133835872325554176"],
        "865755203985641472": ["1079092439694151680", "1247690754596290560"],
        "1133835872325554176": ["1083191159280082944", "999577074555883520"],
        "1083191159280082944": ["1079092439694151680", "1133835872325554176"],
        "1083189032630296576": ["1010266541588701184", "1126211909117669376"],
        "1126239942197223424": ["825182685528989696", "1126215688974073856"],
        "1247690754596290560": ["865755203985641472", "999577074555883520"],
        "1079092439694151680": ["865755203985641472", "1083191159280082944"],
        "1010266541588701184": ["1083189032630296576", "1126215688974073856"],
        "1126211909117669376": ["825182685528989696", "1083189032630296576"]
    };

    const getUserIdByName = (name) => {
        return Object.entries(leagueTeamManagers.users).find(
            ([id, user]) => user.display_name === name
        )?.[0];
    };

    const getRivals = (selectedPlayer) => {
        if (!selectedPlayer) return [];
        const rivalIds = rivalries[selectedPlayer] || [];
        return rivalIds;
    };

    const getOtherTeams = (selectedPlayer, excludePlayer) => {
        const rivalIds = getRivals(selectedPlayer);
        return users.filter(u => u !== excludePlayer && !rivalIds.includes(u) && u !== selectedPlayer);
    };

    $: rivalsOne = getRivals(playerOne).filter(u => u !== playerTwo);
    $: othersOne = getOtherTeams(playerOne, playerTwo);
    $: usersOne = users.filter(u => u !== playerTwo);
    
    $: rivalsTwo = getRivals(playerTwo).filter(u => u !== playerOne);
    $: othersTwo = getOtherTeams(playerTwo, playerOne);
    $: usersTwo = users.filter(u => u !== playerOne);

    const analyzeRivalry = (p1, p2) => {
        if(!p1 || !p2) {
            return;
        }
        goto(`/rivalry?player_one=${p1}&player_two=${p2}`, {noscroll: true,  keepfocus: true})
    }

    $: analyzeRivalry(playerOne, playerTwo)
</script>

<style>
    .selectors {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        max-width: 900px;
        margin: 3em auto 2em;
    }
    .manager {
        text-align: center;
    }
    .vs {
        display: inline-block;
        margin: 1em 0;
        font-family: 'Rubik', sans-serif;
    }
    .container {
        display: inline-block;
        position: relative;
    }
    .selectInput {
        padding: 0.5em 2em;
        font-size: 1.2em;
        border-radius: 6px;
        background-color: var(--fff);
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: url(/dropdown.png);
        background-repeat: no-repeat;
        text-align: center;
        color: var(--g000);
        font-family: 'Rubik', sans-serif;
    }
    .left {
        border: 1px solid var(--barChartOne);
        background-position: 100%;
    }
    select.left:focus {
        outline: none;
        border: 3px solid var(--barChartOne);
    }
    .right {
        border: 1px solid var(--barChartSix);
        background-position: 0%;
    }
    select.right:focus {
        outline: none;
        border: 3px solid var(--barChartSix);
    }
    select option {
        text-align: left;
    }
    .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 2px solid;
        position: absolute;
        transform: translate(0%, -50%);
        top: 50%;
        background-color: var(--fff);
    }
    .avatarLeft {
        border-color: var(--barChartOne);
        border-right: none;
        left: -18%
    }
    .avatarRight {
        border-color: var(--barChartSix);
        border-left: none;
        right: -18%
    }
    @media (max-width: 650px) {
        label {
            font-size: 1.3em;
        }
        .selectInput {
            padding: 0.3em 1.9em;
            font-size: 1em;
        }
        .avatar {
            width: 40px;
            height: 40px;
        }
        .avatarLeft {
            left: -12%
        }
        .avatarRight {
            right: -12%
        }
    }
    @media (max-width: 530px) {
        .selectors {
            flex-direction: column;
        }
        .avatarRight {
            border-right: none;
            left: -12%
        }
        .right {
            background-position: 100%;
        }
    }
</style>

<div class="selectors">
    <!-- manager 1 -->
    <div class="manager">
        <div class="container">
            <select class="selectInput left" id="managerOne" name="managerOne" bind:value={playerOne}>
                <option value={null}>Select a manager</option>
                {#if playerTwo && rivalsTwo.length > 0}
                    <optgroup label="Rivals:">
                        {#each rivalsTwo as user}
                            <option value={user}>{leagueTeamManagers.users[user].display_name}</option>
                        {/each}
                    </optgroup>
                    <optgroup label="Other teams:">
                        {#each othersTwo as user}
                            <option value={user}>{leagueTeamManagers.users[user].display_name}</option>
                        {/each}
                    </optgroup>
                {:else}
                    {#each usersOne as user}
                        <option value={user}>{leagueTeamManagers.users[user].display_name}</option>
                    {/each}
                {/if}
            </select>
            {#if playerOne}
                <img class="avatar avatarLeft" src="{getTeamData(leagueTeamManagers.users, playerOne).avatar}"  alt="manager one avatar"/>
            {/if}
        </div>
    </div>
    <!-- vs -->
    <span class="vs">vs</span>
    <!-- manager 2 -->
    <div class="manager">
        <div class="container">
            <select class="selectInput right" id="managerTwo" name="managerTwo" bind:value={playerTwo}>
                <option value={null}>Select a manager</option>
                {#if playerOne && rivalsOne.length > 0}
                    <optgroup label="Rivals:">
                        {#each rivalsOne as user}
                            <option value={user}>{leagueTeamManagers.users[user].display_name}</option>
                        {/each}
                    </optgroup>
                    <optgroup label="Other teams:">
                        {#each othersOne as user}
                            <option value={user}>{leagueTeamManagers.users[user].display_name}</option>
                        {/each}
                    </optgroup>
                {:else}
                    {#each usersTwo as user}
                        <option value={user}>{leagueTeamManagers.users[user].display_name}</option>
                    {/each}
                {/if}
            </select>
            {#if playerTwo}
                <img class="avatar avatarRight" src="{getTeamData(leagueTeamManagers.users, playerTwo).avatar}"  alt="manager two avatar"/>
            {/if}
        </div>
    </div>
</div>
<script>
        import LinearProgress from '@smui/linear-progress';
        import { getNflState, leagueName, getAwards, getLeagueTeamManagers, homepageText, managers, gotoManager, enableBlog, waitForAll } from '$lib/utils/helper';
        import { Transactions, PowerRankings, HomePost} from '$lib/components';
        import { getAvatarFromTeamManagers, getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';
        import { fade } from 'svelte/transition';
        import { onMount } from 'svelte';

    const nflState = getNflState();
    const podiumsData = getAwards();
    const leagueTeamManagersData = getLeagueTeamManagers();
    
    let visible = false;
    onMount(() => {
        visible = true;
    });
</script>

<style>
    #home {
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        overflow-y: hidden;
        z-index: 1;
    }

    #main {
        flex-grow: 1;
        min-width: 320px;
        margin: 0 auto;
        padding: 60px 0;
    }

    .text {
        padding: 0 30px;
        max-width: 620px;
        margin: 0 auto;
        position: relative;
    }

    .text-watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0.13;
        pointer-events: none;
        z-index: 1;
        max-width: 300px;
        width: 80%;
    }

    .text > :not(.text-watermark) {
        position: relative;
        z-index: 2;
    }

    .leagueData {
        position: relative;
        z-index: 1;
        width: 100%;
        min-width: 470px;
        max-width: 470px;
        min-height: 100%;
                background-color: var(--ebebeb);
        border-left: var(--eee);
                box-shadow: inset 8px 0px 6px -6px rgb(0 0 0 / 24%);
    }

    @media (max-width: 950px) {
        .leagueData {
            max-width: 100%;
            min-width: 100%;
            width: 100%;
                    box-shadow: none;
        }
        #home {
            flex-wrap: wrap;
        }
    }

    .transactions {
        display: block;
        width: 95%;
        margin: 10px auto;
    }

    .center {
        text-align: center;
    }

    h6 {
        text-align: center;
    }
    
    .league-title {
        font-family: 'Permanent Marker', cursive;
        font-size: 1.8em;
        text-align: center;
        letter-spacing: 0.05em;
        color: #2d2d2d;
        margin-bottom: 20px;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    
    .league-title span {
        display: inline;
        will-change: opacity;
    }
    
    .league-title .word {
        display: inline-block;
        white-space: nowrap;
    }

    .homeBanner {
        background-color: var(--blueOne);
        color: #fff;
        padding: 0.5em 0;
        font-weight: 500;
        font-size: 1.5em;
    }

    /* champ styling */
    #currentChamp {
        padding: 25px 0;
                background-color: var(--f3f3f3);
        box-shadow: 5px 0 8px var(--champShadow);
        border-left: 1px solid var(--ddd);
    }

    #champ {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 auto;
        cursor: pointer;
    }

    .first {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 100%;
        border: 1px solid #ccc;
        left: 50%;
        top: 43%;
        z-index: 1;
    }

    .laurel {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 180px;
        height: auto;
        left: 50%;
        top: 43%;
        z-index: 2;
        pointer-events: none;
    }

    h4 {
        text-align: center;
        font-size: 1.8em;
        margin: 10px;
        font-family: 'Permanent Marker', cursive;
    }

    .label {
        display: table;
        text-align: center;
        line-height: 1.1em;
        font-size: 1.7em;
        margin: 6px auto 10px;
        cursor: pointer;
        font-family: 'Press Start 2P', cursive;
        font-size: 1em;
    }
    
        :global(.curOwner) {
                font-size: 0.75em;
                color: #bbb;
                font-style: italic;
        }
</style>

<div id="home">
    <div id="main">
        <div class="text">
            <img class="text-watermark" src="/ncfl-watermark.png" alt="" />
            <h6 class="league-title">
                {#if visible}
                    {#each leagueName.split(' ') as word, wordIndex}
                        {@const charOffset = leagueName.split(' ').slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0)}
                        <span class="word">{#each word as char, i}<span in:fade={{ delay: (charOffset + i) * 50, duration: 400 }}>{char}</span>{/each}</span>{#if wordIndex < leagueName.split(' ').length - 1}<span in:fade={{ delay: (charOffset + word.length) * 50, duration: 400 }}>&nbsp;</span>{/if}
                    {/each}
                {/if}
            </h6>
            <!-- homepageText contains the intro text for your league, this gets edited in /src/lib/utils/leagueInfo.js -->
            {@html homepageText }
            <!-- Most recent Blog Post (if enabled) -->
            {#if enableBlog}
                <HomePost />
            {/if}
        </div>
        <PowerRankings />
    </div>
    
    <div class="leagueData">
        <div class="homeBanner">
            {#await nflState}
                <div class="center">Retrieving NFL state...</div>
                <LinearProgress indeterminate />
            {:then nflStateData}
                <div class="center">NFL {nflStateData.season} 
                    {#if nflStateData.season_type == 'pre'}
                        Preseason
                    {:else if nflStateData.season_type == 'post'}
                        Postseason
                    {:else}
                        Season - {nflStateData.week > 0 ? `Week ${nflStateData.week}` : "Preseason"}
                    {/if}
                </div>
            {:catch error}
                <div class="center">Something went wrong: {error.message}</div>
            {/await}
        </div>

        <div id="currentChamp">
            {#await waitForAll(podiumsData, leagueTeamManagersData)}
                <p class="center">Retrieving awards...</p>
                <LinearProgress indeterminate />
            {:then [podiums, leagueTeamManagers]}
                {#if podiums[0]}
                    <h4>{podiums[0].year} Fantasy Champ</h4>
                    <div id="champ" onclick={() => {if(managers.length) gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)})}} >
                        <img src="{getAvatarFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year)}" class="first" alt="champion" />
                        <img src="/gold-wreath.webp" class="laurel" alt="gold wreath" />
                    </div>
                    <span class="label" onclick={() => gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)})} >{getTeamFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year).name}</span>
                {:else}
                    <p class="center">No former champs.</p>
                {/if}
            {:catch error}
                <p class="center">Something went wrong: {error.message}</p>
            {/await}
        </div>

        <div class="transactions" >
            <Transactions />
        </div>
    </div>
</div>
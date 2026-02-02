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
    }

.twitter-hero-section {
    position: relative;
    margin: 0 -30px;
    padding: 0;
    aspect-ratio: 16 / 12;
    display: flex;
    align-items: center;
    justify-content: center;
}

.twitter-hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/blank-background.png') center center / 529px 460px no-repeat;
    pointer-events: none;
    z-index: 2;
}

.twitter-hero-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/wilson-schefter.webp') center center / 616px 538px no-repeat;
    pointer-events: none;
    z-index: 4;
}

.twitter-timeline-container {
    position: absolute;
    top: 28%;
    left: 24%;
    width: 52%;
    height: 60%;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: none;
    z-index: 3;
}

@media (max-width: 768px) {
    .twitter-hero-section {
        margin: 0 10px;
        border-radius: 8px;
        aspect-ratio: 9 / 16;
    }
    
    .twitter-hero-section::before {
        background-size: 529px 460px;
        background-position: center center;
    }
    
    .twitter-hero-section::after {
        background-size: 616px 538px;
        background-position: center center;
    }
    
    .twitter-timeline-container {
        top: 18%;
        left: 12%;
        width: 68%;
        height: 55%;
    }
}
    
    .twitter-timeline-container :global(*) {
        max-width: 100% !important;
    }
    
    .twitter-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 15px;
        padding: 40px 20px;
        color: #657786;
        text-decoration: none;
    }
    
    .twitter-loading-icon {
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }
    
    .feed-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        border-bottom: 1px solid #e1e8ed;
        font-weight: 700;
        font-size: 1.1em;
    }
    
    .follow-btn {
        margin-left: auto;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        border-radius: 20px;
        text-decoration: none;
        font-size: 0.85em;
        font-weight: 700;
        transition: background 0.2s;
    }
    
    .follow-btn:hover {
        background: #333;
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
        font-family: 'Rubik', sans-serif;
        font-weight: 700;
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
        width: 280px;
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
            <!-- Twitter Feed Hero Section -->
            <div class="twitter-hero-section">
                <div class="twitter-timeline-container">
                    <script src="https://elfsightcdn.com/platform.js" async></script>
                    <div class="elfsight-app-1de33d25-070e-4503-b2f2-9a8932c77da1" data-elfsight-app-lazy></div>
                </div>
            </div>
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

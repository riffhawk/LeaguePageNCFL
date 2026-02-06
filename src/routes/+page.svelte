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
    let cspnContainer;
    
    onMount(() => {
        visible = true;
        initCspnAnimation();
    });

    function initCspnAnimation() {
        if (!cspnContainer) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = '/cspn-logo.png';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const squareSize = 60;
            const padding = 150;

            canvas.width = img.naturalWidth + padding * 2;
            canvas.height = img.naturalHeight + padding * 2;
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.display = 'block';

            const offscreen = document.createElement('canvas');
            offscreen.width = img.naturalWidth;
            offscreen.height = img.naturalHeight;
            const offCtx = offscreen.getContext('2d');
            offCtx.drawImage(img, 0, 0);

            const cols = Math.ceil(img.naturalWidth / squareSize);
            const rows = Math.ceil(img.naturalHeight / squareSize);
            const centerX = img.naturalWidth / 2;
            const centerY = img.naturalHeight / 2;

            const squares = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const sx = c * squareSize;
                    const sy = r * squareSize;
                    const sw = Math.min(squareSize, img.naturalWidth - sx);
                    const sh = Math.min(squareSize, img.naturalHeight - sy);

                    const tileCanvas = document.createElement('canvas');
                    tileCanvas.width = sw;
                    tileCanvas.height = sh;
                    const tileCtx = tileCanvas.getContext('2d');
                    tileCtx.drawImage(offscreen, sx, sy, sw, sh, 0, 0, sw, sh);

                    const imageData = tileCtx.getImageData(0, 0, sw, sh);
                    let hasContent = false;
                    for (let i = 3; i < imageData.data.length; i += 4) {
                        if (imageData.data[i] > 10) { hasContent = true; break; }
                    }

                    const dx = (sx + sw / 2) - centerX;
                    const dy = (sy + sh / 2) - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
                    const angle = Math.atan2(dy, dx);

                    squares.push({
                        sx, sy, sw, sh, tileCanvas, hasContent,
                        dist, maxDist, angle,
                        scatterX: Math.cos(angle) * (80 + Math.random() * 120),
                        scatterY: Math.sin(angle) * (80 + Math.random() * 120),
                        scatterRot: (Math.random() - 0.5) * Math.PI * 2,
                        delay: dist / maxDist
                    });
                }
            }

            cspnContainer.innerHTML = '';
            cspnContainer.appendChild(canvas);

            const duration = 6000;
            let startTime = null;

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            function animate(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = (timestamp - startTime) % duration;
                const halfDuration = duration / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (const sq of squares) {
                    if (!sq.hasContent) continue;

                    const delayOffset = sq.delay * 0.3;
                    let progress;

                    if (elapsed < halfDuration) {
                        const t = Math.max(0, Math.min(1, (elapsed / halfDuration - delayOffset) / (1 - delayOffset)));
                        progress = easeInOutCubic(t);
                    } else {
                        const t = Math.max(0, Math.min(1, ((elapsed - halfDuration) / halfDuration - delayOffset) / (1 - delayOffset)));
                        progress = 1 - easeInOutCubic(t);
                    }

                    const offsetX = sq.scatterX * progress;
                    const offsetY = sq.scatterY * progress;
                    const scale = 1 - progress * 0.6;
                    const opacity = 1 - progress * 0.8;
                    const rotation = sq.scatterRot * progress;

                    ctx.save();
                    ctx.globalAlpha = opacity;
                    ctx.translate(padding + sq.sx + sq.sw / 2 + offsetX, padding + sq.sy + sq.sh / 2 + offsetY);
                    ctx.rotate(rotation);
                    ctx.scale(scale, scale);
                    ctx.drawImage(sq.tileCanvas, -sq.sw / 2, -sq.sh / 2);
                    ctx.restore();
                }

                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        };
    }
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
        margin: -38px auto;
        padding: 60px 0;
    }

    .text {
        padding: 0 30px;
        max-width: 620px;
        margin: 40px auto;
        background-image: url('/twitter-bg.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

.twitter-hero-section {
    position: relative;
    z-index: 10;
    margin: 0 auto;
    width: 100%;
    max-width: 616px;
    background-image: url('/twitter-bg.jpg');
    background-attachment: fixed;
    background-position: left;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    border-radius: 12px;
}

.twitter-hero-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 87.34%; /* 538/616 aspect ratio */
}

.twitter-hero-wrapper img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

.wilson-schefter-img {
    width: 100%;
    height: auto;
    z-index: 4;
}

.twitter-timeline-container {
    position: absolute;
    top: 24%;
    left: 26%;
    width: 52%;
    height: 57%;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: none;
    z-index: 5;
}

.cspn-logo {
    display: block;
    width: 60%;
    max-width: 280px;
    margin: 0px auto 24px;
    overflow: visible;
}

@media (max-width: 768px) {
    :global(html), :global(body) {
        overflow-x: hidden;
    }
    
    #main {
        padding: 0 0;
        overflow-x: hidden;
        max-width: 100vw;
    }
    
    .twitter-hero-section {
        max-width: 720px;
        margin: 0 auto;
        right: 18px;
        position: relative;
    }
    
    .twitter-hero-wrapper {
        padding-bottom: 120%;
    }
    
    .wilson-schefter-img {
        width: 110%;
    }
    
    .twitter-timeline-container {
        top: 19%;
        left: 10%;
        width: 80%;
        height: 63%;
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
        padding: 1.5rem 0;
        border-radius: 1.25rem;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        color: #1f2937;
        font-family: 'Press Start 2P', cursive;
        font-weight: 700;
        font-size: 1.5em;
        margin-top: 0%;
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
                <div bind:this={cspnContainer} class="cspn-logo"><img src="/cspn-logo.png" alt="CSPN" style="width:100%;height:auto;display:block;" /></div>
                <div class="twitter-hero-wrapper">
                    <div class="twitter-timeline-container">
                        <script src="https://elfsightcdn.com/platform.js" async></script>
                        <div class="elfsight-app-1de33d25-070e-4503-b2f2-9a8932c77da1" data-elfsight-app-lazy></div>
                    </div>
                    <img src="/wilson-schefter.png" alt="" class="wilson-schefter-img" />
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

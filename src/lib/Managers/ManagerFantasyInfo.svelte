<script>
    import { onMount, onDestroy } from 'svelte';
    import lottie from 'lottie-web';

    export let viewManager, players, changeManager;

    let priceTagContainer;

    function initPriceTagLottie() {
        if (priceTagContainer) {
            priceTagContainer.innerHTML = '';
            lottie.loadAnimation({
                container: priceTagContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/PriceTag.json'
            });
        }
    }

    $: if (viewManager?.franchiseTag === 'N/A' && priceTagContainer) {
        initPriceTagLottie();
    }

    // SVG circular progress state
    let animFrame = null;
    let progressDelay = null;
    let progress = 0; // 0..1
    let lastTradeTarget = null;
    let lastManagerKey = null;

    const clampScale = (s) => {
        const n = Number(s);
        if (Number.isNaN(n)) return null;
        return Math.max(0, Math.min(10, Math.round(n)));
    }

    // circle geometry
    const CIRCLE_R = 28;
    const CIRCLE_CIRC = 2 * Math.PI * CIRCLE_R;

    // get color based on trading scale value
    const getProgressColor = (value) => {
        const n = clampScale(value);
        if (n === null || n === 0) return '#e6e6e6';
        if (n >= 1 && n <= 3) return '#dc3545'; // Red
        if (n >= 4 && n <= 7) return '#ffc107'; // Yellow
        if (n >= 8 && n <= 10) return '#28a745'; // Green
        return 'var(--blueOne)';
    };

    $: progressColor = getProgressColor(viewManager?.tradingScale);

    // animate progress (0..1) smoothly
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const animateProgress = (from, to, duration = 360) => {
        if (animFrame) cancelAnimationFrame(animFrame);
        const start = (typeof performance !== 'undefined') ? performance.now() : Date.now();
        const step = (now) => {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / duration);
            const eased = easeOutCubic(t);
            progress = from + (to - from) * eased;
            if (t < 1) {
                animFrame = requestAnimationFrame(step);
            } else {
                progress = to;
                animFrame = null;
            }
        };
        animFrame = requestAnimationFrame(step);
    };

    const queueProgressAnimation = (target, delay = 0, duration = 500) => {
        if (progressDelay) clearTimeout(progressDelay);
        if (animFrame) cancelAnimationFrame(animFrame);

        if (!delay) {
            animateProgress(progress, target, duration);
            return;
        }

        progressDelay = setTimeout(() => {
            progressDelay = null;
            animateProgress(progress, target, duration);
        }, delay);
    };

    onMount(() => {
        if (viewManager?.franchiseTag === 'N/A') {
            initPriceTagLottie();
        }
    });

    onDestroy(() => {
        if (animFrame) cancelAnimationFrame(animFrame);
        if (progressDelay) clearTimeout(progressDelay);
    });

    $: if (viewManager && clampScale(viewManager.tradingScale) != null) {
        const target = clampScale(viewManager.tradingScale) / 10;
        const managerKey = viewManager?.managerID || viewManager?.display_name || viewManager?.name || null;

        if (managerKey !== lastManagerKey) {
            lastManagerKey = managerKey;
            lastTradeTarget = target;
            progress = 0;
            queueProgressAnimation(target, 800, 1200);
        } else if (target !== lastTradeTarget) {
            lastTradeTarget = target;
            queueProgressAnimation(target, 0, 500);
        }
    } else if (!viewManager?.tradingScale) {
        lastTradeTarget = null;
        progress = 0;
    }

    const handleRivalClick = (rival) => {
        if (rival && rival.link != null) {
            changeManager(rival.link);
        }
    };
</script>

<style>
    .fantasyInfos {
        font-family: 'Space Mono', monospace;
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 1.25em 0 2em;
        margin: -75px 0 -2em;
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 2rem;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.14)),
            rgba(255, 255, 255, 0.12);
        box-shadow:
            0 18px 36px rgba(91, 117, 140, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
    }

    .infoSlot {
        text-align: center;
        margin: 2em 1em 0;
    }

    .infoIcon {
        display: inline-flex;
        height: 70px;
        width: 70px;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        border: 1px solid var(--ccc);
                overflow: hidden;
        background-color: var(--fff);
                transition: box-shadow 0.4s;
    }

    .playerIcon {
        align-items:flex-end;
    }

    .infoLabel {
        font-size: 0.7em;
        color: var(--blueOne);
        font-weight: 700;
        margin-bottom: 1em;
        height: 30px;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
    }

    .infoAnswer {
        font-size: 0.8em;
        color: var(--g555);
        margin-top: 1em;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
    }

    .tradingScale {
        line-height: 70px;
        font-size: 55px;
        color: var(--blueOne);
    }

    .lottieContainer {
        width: 70px;
        height: 70px;
        display: inline-block;
    }

    .lottieWrapper {
        position: relative;
        width: 70px;
        height: 70px;
        display: inline-block;
    }

    .fallbackOuter {
        position: absolute;
        top: 0;
        left: 0;
        width: 70px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .fallbackBarOuter {
        width: 56px;
        height: 12px;
        background: var(--ccc);
        border-radius: 6px;
        overflow: hidden;
    }

    .fallbackBarInner {
        height: 100%;
        background: var(--blueOne);
        width: 0%;
        transition: width 450ms ease;
    }

    .rookiesOrVets {
        height: 65px;
        vertical-align: middle;
    }

    .infoRival {
        cursor: pointer;
    }

    .infoRival:hover .infoIcon {
        box-shadow: 0 0 6px 4px var(--aaa);
        border: 1px solid var(--aaa);
    }

    .infoRival.isStatic {
        cursor: default;
    }

    .infoRival.isStatic:hover .infoIcon {
        box-shadow: none;
        border: 1px solid var(--ccc);
    }

    .rival {
        height: 100%;
    }

    .valuePosition {
        line-height: 70px;
        font-size: 25px;
        color: var(--fff);
    }

    .progressText {
        font-size: 14px;
        fill: var(--blueOne);
        font-weight: 700;
    }

    .QB {
        background-color: var(--QB);
    }

    .WR {
        background-color: var(--WR);
    }

    .RB {
        background-color: var(--RB);
    }

    .TE {
        background-color: var(--TE);
    }

    .Picks {
        background: #73b647;
    }
    .K {
        background-color: var(--K);
    }

    .DEF {
        background-color: var(--DEF);
    }

    .CB {
        background-color: #ffcc7a;
    }

    .SS {
        background-color: #b7a1db;
    }

    .FS {
        background-color: #ebe7b3;
    }

    .DE {
        background-color: #b1d0e9;
    }

    .DL {
        background-color: #c392d3;
    }

    .LB {
        background-color: #98c097;
    }

    .favoritePlayer {
        height: 65px;
        vertical-align: bottom;
    }

    /* media queries */

    @media (max-width: 731px) {
        .infoSlot {
            margin: 2em 3em 0;
        }
    }

    @media (max-width: 558px) {
        .infoSlot {
            margin: 2em 2em 0;
        }
    }

    @media (max-width: 461px) {
        .infoSlot {
            margin: 2em 1em 0;
        }
    }
</style>

<div class="fantasyInfos">
    <!-- Rookies or Vets (optional) -->
    {#if viewManager.Conf}
        <div class="infoSlot">
            <div class="infoLabel" style="text-align: center;">
                NCFL<br/>Conference
            </div>
            <div class="infoIcon">
                <img class="rookiesOrVets" src="/{viewManager.Conf}.png" alt="NCFL {viewManager.Conf} Conference"/>
            </div>
            <div class="infoAnswer">
                {viewManager.Conf}
            </div>
        </div>
    {/if}
    <!-- Franchise Tag / Keeper player (optional) -->
    {#if viewManager.franchiseTag && viewManager.franchiseTag !== 'N/A'}
        <div class="infoSlot">
            <div class="infoLabel">
                Current Keeper
            </div>
            <div class="infoIcon playerIcon">
                <img class="favoritePlayer" src="https://sleepercdn.com/content/nfl/players/{viewManager.franchiseTag}.jpg" alt="keeper player"/>
            </div>
            <div class="infoAnswer">
                {players[viewManager.franchiseTag].fn} {players[viewManager.franchiseTag].ln}
            </div>
        </div>
    {:else if viewManager.franchiseTag === 'N/A'}
        <div class="infoSlot">
            <div class="infoLabel">
                Current Keeper
            </div>
            <div class="infoIcon">
                <div class="lottieContainer" bind:this={priceTagContainer}></div>
            </div>
            <div class="infoAnswer">
                N/A
            </div>
        </div>
    {/if}
    {#if viewManager.tradingScale}
        <!-- Trading Scale (SVG circular progress) -->
        <div class="infoSlot">
            <div class="infoLabel">
                Desire to Trade
            </div>
            <div class="infoIcon">
                <svg class="progressSvg" viewBox="0 0 70 70" width="70" height="70" aria-hidden="true">
                    <g transform="rotate(-90 35 35)">
                        <circle cx="35" cy="35" r="{CIRCLE_R}" class="progressTrack" fill="none" stroke="#e6e6e6" stroke-width="8" />
                        <circle cx="35" cy="35" r="{CIRCLE_R}" class="progressBar" fill="none" stroke="{progressColor}" stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="{CIRCLE_CIRC}" stroke-dashoffset="{CIRCLE_CIRC * (1 - progress)}" />
                    </g>
                    <text x="35" y="36" text-anchor="middle" dominant-baseline="middle" class="progressText">{clampScale(viewManager.tradingScale) || 0}</text>
                </svg>
            </div>
        </div>
    {/if}
    <!-- Favorite player (optioonal) -->
    {#if viewManager.favoritePlayer}
        <div class="infoSlot">
            <div class="infoLabel">
                Favorite Player
            </div>
            <div class="infoIcon playerIcon">
                <img class="favoritePlayer" src="https://sleepercdn.com/content/nfl/players/{viewManager.favoritePlayer}.jpg" alt="favorite player"/>
            </div>
            <div class="infoAnswer">
                {players[viewManager.favoritePlayer].fn} {players[viewManager.favoritePlayer].ln}
            </div>
        </div>
    {/if}
    {#if viewManager.primaryRival}
        <div class="infoSlot infoRival" class:isStatic={viewManager.primaryRival.link == null} onclick={() => handleRivalClick(viewManager.primaryRival)}>
            <div class="infoLabel">
                Primary Rival
            </div>
            <div class="infoIcon">
                <img class="rival" src="{viewManager.primaryRival.image}" alt="primary rival"/>
            </div>
            <div class="infoAnswer">
                {viewManager.primaryRival.name}
            </div>
        </div>
    {/if}
    {#if viewManager.secondaryRival}
        <div class="infoSlot infoRival" class:isStatic={viewManager.secondaryRival.link == null} onclick={() => handleRivalClick(viewManager.secondaryRival)}>
            <div class="infoLabel">
                Secondary Rival
            </div>
            <div class="infoIcon">
                <img class="rival" src="{viewManager.secondaryRival.image}" alt="secondary rival"/>
            </div>
            <div class="infoAnswer">
                {viewManager.secondaryRival.name}
            </div>
        </div>
    {/if}
</div>

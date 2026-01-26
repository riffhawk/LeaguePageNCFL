<script>
    import { onMount, onDestroy } from 'svelte';

    export let viewManager, players, changeManager;

    // SVG circular progress state
    let animFrame = null;
    let progress = 0; // 0..1

    const clampScale = (s) => {
        const n = Number(s);
        if (Number.isNaN(n)) return null;
        return Math.max(0, Math.min(10, Math.round(n)));
    }

    // circle geometry
    const CIRCLE_R = 28;
    const CIRCLE_CIRC = 2 * Math.PI * CIRCLE_R;

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
            if (t < 1) animFrame = requestAnimationFrame(step); else animFrame = null;
        };
        animFrame = requestAnimationFrame(step);
    };

    onMount(() => {
        // animate progress from 0 to target on mount
        const s = clampScale(viewManager && viewManager.tradingScale);
        const target = s == null ? 0 : (s / 10);
        progress = 0;
        setTimeout(() => animateProgress(0, target, 1500), 500);
    });

    onDestroy(() => {
        if (animFrame) cancelAnimationFrame(animFrame);
    });

    $: if (viewManager && clampScale(viewManager.tradingScale) != null) {
        const target = clampScale(viewManager.tradingScale) / 10;
        animateProgress(progress, target);
    }
</script>

<style>
    .fantasyInfos {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 0 0 2em;
        margin: 3em 0 4em;
        border-bottom: 1px solid var(--aaa);
        border-top: 1px solid var(--aaa);
        box-shadow: 0 0 8px 4px var(--ccc);
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

    .rival {
        height: 100%;
    }

    .rebuildOrWin {
        height: 70px;
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
    {#if viewManager.rookieOrVets}
        <div class="infoSlot">
            <div class="infoLabel">
                Rookie or Vet Preference
            </div>
            <div class="infoIcon">
                <img class="rookiesOrVets" src="/{viewManager.rookieOrVets}.png" alt="rookie or vet preference"/>
            </div>
            <div class="infoAnswer">
                {viewManager.rookieOrVets}
            </div>
        </div>
    {/if}
    <!-- Favorite fantasy position (optional) -->
    {#if viewManager.valuePosition}
        <div class="infoSlot">
            <div class="infoLabel">
                Favorite Fantasy Asset
            </div>
            <div class="infoIcon {viewManager.valuePosition}">
                <span class="valuePosition">{viewManager.valuePosition}</span>
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
                        <circle cx="35" cy="35" r="{CIRCLE_R}" class="progressBar" fill="none" stroke="var(--blueOne)" stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="{CIRCLE_CIRC}" stroke-dashoffset="{CIRCLE_CIRC * (1 - progress)}" />
                    </g>
                    <text x="35" y="36" text-anchor="middle" dominant-baseline="middle" class="progressText">{clampScale(viewManager.tradingScale) || 0}</text>
                </svg>
            </div>
            <div class="infoAnswer">
                {viewManager.tradingScale} out of 10
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
    <!-- Rebuild Mod (optional) -->
    {#if viewManager.mode}
        <div class="infoSlot">
            <div class="infoLabel">
                Win Now or Rebuild?
            </div>
            <div class="infoIcon">
                <img class="rebuildOrWin" src="/{viewManager.mode.replace(' ', '%20')}.png" alt="win now or rebuild"/>
            </div>
            <div class="infoAnswer">
                {viewManager.mode}
            </div>
        </div>
    {/if}
    <!-- Rival -->
    <div class="infoSlot infoRival" onclick={() => changeManager(viewManager.rival.link)}>
        <div class="infoLabel">
            Rival
        </div>
        <div class="infoIcon">
            <img class="rival" src="{viewManager.rival.image}" alt="rival"/>
        </div>
        <div class="infoAnswer">
            {viewManager.rival.name}
        </div>
    </div>
</div>
<script>
    import { round } from "$lib/utils/helper";
        import { getAvatarFromTeamManagers, getTeamNameFromTeamManagers } from "$lib/utils/helperFunctions/universalFunctions";

    export let leagueTeamManagers, players, matchCol, playoffsStart, ix, playoffLength, consolation = false, losers = false, numRosters, consolationNum, selected;

    let label = '';

    let weekNum = 0;
    let isChampionship = false;

    let finalIcon = '🏆';
    
    const setLabel = (l) => {
        weekNum = playoffsStart + ix;
        isChampionship = false;
        finalIcon = '🏆';
        
        if(matchCol.length > 1) {
            switch (playoffLength - ix) {
                case 1:
                    isChampionship = true;
                    if(losers) {
                        label = 'Toilet Bowl'
                        finalIcon = '🚽'
                    } else {
                        label = 'Championship'
                    }
                    break;
                case 2:
                    label = 'Semifinals'
                    break;
                case 3:
                    label = 'Quarterfinals'
                    break;
                default:
                    label = `Round ${ix + 1}`
                    break;
            }
        } else {
            if(!consolation) {
                isChampionship = true;
                if(losers) {
                    label = 'Toilet Bowl'
                    finalIcon = '🚽'
                } else {
                    label = 'Championship'
                }
                return;
            }
            if(losers) {
                label = nThPlace(numRosters - (2 * (consolationNum + 1)));
            } else {
                label = nThPlace(1 + (2 * (consolationNum + 1)));
            }
        }
    }

    const nThPlace = (num) => {
        let end = 'th';
        switch (num % 10) {
            case 3:
                end = 'rd'
                break;
            case 2:
                end = 'nd'
                break;
            case 1:
                end = 'st'
                break;
            default:
                break;
        }
        return `${num}${end} Place`
    }

    $: setLabel(losers)

    let anchors = {};
    let drawBracket = false;
    const setDrawBracket = (col) => {
        if(col.length % 2 == 0) {
            drawBracket = true;
        } else {
            drawBracket = false;
        }
    }
    $: setDrawBracket(matchCol)

    const duos = matchCol.length / 2;
    for(let i = 0; i < duos; i++) {
        anchors[i] = {
            t: null,
            b: null,
            yTop: null,
            yBottom: null,
            yMiddle: null,
            xLeft: null,
            xMiddle: null,
            xRight: null,
        }
    }

    const getPlayoffName = (manager, bye, season) => {
        if(bye && !manager) {
            return 'BYE';
        }
        if(!manager) {
            return '';
        }
        return getTeamNameFromTeamManagers(leagueTeamManagers, manager, season);
    }

    const calculatePoints = (allPoints) => {
        let totalPoints = 0;
        for(const k in allPoints) {
            const points = allPoints[k];
            if(!points) break;
            for(const point of points) {
                totalPoints += point;
            }
        }
        return round(totalPoints)
    }

    const calculatePotentialPoints = (startersWeeks, ix, p) => {
        if(!startersWeeks) return 0;
        let totalPoints = 0;
        
        for(const k in startersWeeks) {
            const starters = startersWeeks[k];
            if(!starters) break;

            const i = ix + k -1;
            for(const starter of starters) {
                totalPoints += parseFloat(players[starter]?.wi && players[starter].wi[playoffsStart - i]?.p ? players[starter].wi[playoffsStart - i].p : 0);
            }
        }
        return round(totalPoints);
    }

    let el;

    let labelY = 0;

    const resize = () => {
        const colTop = el?.getBoundingClientRect()?.top || 0;
        const colLeft = el?.getBoundingClientRect()?.left || 0;
        const colRight = el?.getBoundingClientRect()?.right || 0;
        const colWidth = colRight - colLeft;
        for(const key in anchors) {
            const tTop = anchors[key]?.t?.getBoundingClientRect()?.top || 0;
            const tBottom = anchors[key]?.t?.getBoundingClientRect()?.bottom || 0;
            if(labelY == 0 && tTop > 0) {
                labelY = tTop - colTop - 25;
            };

            const tLeft= anchors[key]?.t?.getBoundingClientRect()?.left || 0;
            const tRight= anchors[key]?.t?.getBoundingClientRect()?.right || 0;

            const bTop = anchors[key]?.b?.getBoundingClientRect()?.top || 0;
            const bBottom = anchors[key]?.b?.getBoundingClientRect()?.bottom || 0;
            
            anchors[key].yTop = (tBottom + tTop) / 2 - colTop;
            anchors[key].yBottom = (bBottom + bTop) / 2 - colTop;
            anchors[key].yMiddle = (anchors[key].yTop + anchors[key].yBottom) / 2;

            anchors[key].xLeft = (tRight + tLeft) / 2 - (colWidth * ix);
            anchors[key].xMiddle = anchors[key].xLeft + (colWidth / 2);
            anchors[key].xRight = anchors[key].xLeft + colWidth;
        }
    }

    $: resize(innerWidth);
    
    let innerWidth;

    const changeSelection = (m, opponent) => {
        if(m == selected || !opponent) return;
        selected = m;
    }

</script>

<svelte:window bind:innerWidth={innerWidth} />

<style>
    .bracketColumn {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        flex-grow: 1;
    }

    .label {
        position: absolute;
        text-align: center;
        margin: 0;
        font-family: 'Rubik', sans-serif;
        font-weight: 600;
        font-size: 0.95em;
        color: #333;
    }

    .weekLabel {
        font-size: 0.75em;
        color: #666;
        font-weight: 400;
    }

    .championshipLabel {
        color: #b8860b;
    }

    .trophyIcon {
        font-size: 1.2em;
    }

    .match {
        width: 280px;
        background-color: #fff;
        border-radius: 8px;
        margin: 0.75em 1em;
        z-index: 2;
        border: 1px solid #d0d0d0;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .match:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .championship {
        border: 2px solid #b8860b;
        box-shadow: 0 0 8px rgba(184, 134, 11, 0.3);
    }

    .selected {
        background-color: #f0f7ff;
        border-color: #4a90a4;
        box-shadow: 0 0 8px rgba(74, 144, 164, 0.3);
    }

    .clickable {
        cursor: pointer;
    }

    .manager {
        flex-direction: row;
        margin: 0;
        padding: 0.75em 1em;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #d0d0d0;
    }

    .manager:last-child {
        border-bottom: none;
    }

    .avatarNameBlock {
        display: flex;
        align-items: center;
        gap: 0.6em;
        flex: 1;
    }

    .avatarPointsBlock {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .name {
        font-size: 0.9em;
        line-height: 1.2em;
        word-break: break-word;
        color: #333;
        font-family: 'Rubik', sans-serif;
    }

    .bye {
        color: #999;
        font-style: italic;
    }

    .avatar {
        vertical-align: middle;
        border-radius: 50%;
        height: 28px;
        width: 28px;
        margin: 0;
        border: 2px solid #4a90a4;
        background-color: #eee;
        flex-shrink: 0;
    }

    .points {
        display: flex;
        align-items: baseline;
        gap: 0.4em;
        color: #333;
        text-align: right;
    }

    .actualPoints {
        font-size: 1.1em;
        font-weight: 700;
        font-family: 'Rubik', sans-serif;
    }

    .projectedPoints {
        font-size: 0.75em;
        color: #666;
    }

    /* SVG styling */

        .lineParent {
        top: 0;
        left: 0;
        position: absolute;
                overflow: visible;
                width: 1px;
                height: 1px;
                pointer-events: none;
        }

        .line{
        top: 0;
        left: 0;
                position: absolute;
                z-index: 1;
        }

    /* media queries */
        @media (max-width: 1000px) {
        .match {
            width: 220px;
        }
        }

        @media (max-width: 800px) {
        .match {
            width: 180px;
        }
        }

    @media (max-width: 610px) {
        .match {
            width: 150px;
            font-size: 0.85em;
        }

        .avatar {
            height: 22px;
            width: 22px;
        }

        .manager {
            padding: 0.5em 0.6em;
        }
    }

    @media (max-width: 500px) {
        .match {
            width: 120px;
            font-size: 0.75em;
        }
    }

    @media (max-width: 410px) {
        .match {
            width: 90px;
            font-size: 0.65em;
        }

        .avatar {
            height: 18px;
            width: 18px;
        }
    }

    .avatarBye {
        opacity: 0.3;
        border: none;
        background-color: #ccc;
    }

    .spacer {
        background: none;
        border: none;
    }
</style>

<div class="bracketColumn" bind:this={el}>
    {#if matchCol.length}
        <p class="label{isChampionship ? ' championshipLabel' : ''}" style="top: {labelY}px;">
            {#if isChampionship}
                <span class="trophyIcon">{finalIcon}</span>
            {/if}
            {label}
            <br/>
            <span class="weekLabel">(Week {weekNum})</span>
        </p>
    {/if}
    {#each matchCol as matchups, inx}
        <div class="match{matchups[0].m == selected ? ' selected' : ''}{matchups[0].m && matchups[1].roster_id ? ' clickable' : ''}{isChampionship ? ' championship' : ''}" bind:this={anchors[Math.floor(inx / 2)][inx % 2 == 0 ? 't' : 'b']} onclick={() => {changeSelection(matchups[0].m, matchups[1].roster_id)}}>
            {#each matchups as matchup}
                <div class="manager">
                    <div class="avatarPointsBlock">
                        <div class="avatarNameBlock">
                            {#if matchup.roster_id || (!matchups.bye && !matchup.roster_id)}
                                <img class="avatar{!matchups.bye && !matchup.roster_id ? ' avatarBye': ''}" src={getAvatarFromTeamManagers(leagueTeamManagers, matchup.roster_id, leagueTeamManagers.currentYear)} alt="team avatar" />
                            {/if}
                            <div class="name{matchups.bye && !matchup.roster_id ? ' bye': ''}">{getPlayoffName(matchup.roster_id, matchups.bye, leagueTeamManagers.currentYear)}</div>
                        </div>
                        {#if matchup.roster_id}
                            <div class="points">
                                <span class="projectedPoints">{calculatePotentialPoints(matchup.starters, ix, players)}</span>
                                <span class="actualPoints">{calculatePoints(matchup.points)}</span>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        {#if drawBracket && inx % 2 == 0}
            <!-- Only draw the bracket once for each pair -->
            <svg class="lineParent">
                <!-- top line of bracket -->
                <line stroke-width="2px" stroke="#999"  x1="{anchors[Math.floor(inx / 2)].xLeft}" y1="{anchors[Math.floor(inx / 2)].yTop}" x2="{anchors[Math.floor(inx / 2)].xMiddle}" y2="{anchors[Math.floor(inx / 2)].yTop}" class="line"/>
                <!-- vertical line of bracket -->
                <line stroke-width="2px" stroke="#999"  x1="{anchors[Math.floor(inx / 2)].xMiddle}" y1="{anchors[Math.floor(inx / 2)].yTop}" x2="{anchors[Math.floor(inx / 2)].xMiddle}" y2="{anchors[Math.floor(inx / 2)].yBottom}" class="line"/>
                <!-- right line of bracket -->
                <line stroke-width="2px" stroke="#999"  x1="{anchors[Math.floor(inx / 2)].xMiddle}" y1="{anchors[Math.floor(inx / 2)].yMiddle}" x2="{anchors[Math.floor(inx / 2)].xRight}" y2="{anchors[Math.floor(inx / 2)].yMiddle}" class="line"/>
                <!-- bottom line of bracket -->
                <line stroke-width="2px" stroke="#999"  x1="{anchors[Math.floor(inx / 2)].xLeft}" y1="{anchors[Math.floor(inx / 2)].yBottom}" x2="{anchors[Math.floor(inx / 2)].xMiddle}" y2="{anchors[Math.floor(inx / 2)].yBottom}" class="line"/>
            </svg>
        {/if}
    {:else}
        <div class="match spacer" />
    {/each}
</div>
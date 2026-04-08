<script>
    import { browser } from '$app/environment';
    import lottie from 'lottie-web';
    import { round } from "$lib/utils/helper";
    import { getManagerPlayerAwards } from "$lib/utils/helperFunctions/managerPlayerAwards";
    import { checkIfManagerReceivedAward, getTeamNameFromTeamManagers } from "$lib/utils/helperFunctions/universalFunctions";

    export let awards, records, rosterID, tookOver, leagueTeamManagers, managerID;

    let displayAwards = [];

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    let formerGlobal = false;
    let carouselEl;
    let playerAwardsCarouselEl;
    let playerAwards = [];
    let playerAwardsLoading = false;
    let playerAwardsRequest = 0;

    const checkIfDeserves = (awardRosterID, userRosterID, year) => {
        if(!managerID || !year || !awardRosterID) {
            return awardRosterID == userRosterID;
        }
        return checkIfManagerReceivedAward(leagueTeamManagers, awardRosterID, year, managerID);
    }

    const checkIfDeservesWithManagerID = (recordManagerID, userRosterID) => {
        if(managerID) {
            return recordManagerID == managerID;
        }
        for(const year in leagueTeamManagers.teamManagersMap) {
            for(const rosterID in  leagueTeamManagers.teamManagersMap[year]) {
                if(leagueTeamManagers.teamManagersMap[year][rosterID].managers.indexOf(recordManagerID) > -1) {
                    return rosterID == userRosterID;
                }
            }
        }
        return false;
    }

    const computePodiums = (cRosterID) => {
        formerGlobal = false;
        displayAwards = [];

        // first look through annual awards (champion, second, etc)
        for(const podium of awards) {
            for(const award in podium) {
                if(award == 'year') continue;
                if(award == 'divisions') {
                    for(const division of podium[award]) {
                        if(checkIfDeserves(division.rosterID, cRosterID, podium.year)) {
                            const former = tookOver && tookOver > podium.year;
                            if(former) {
                                formerGlobal = true;
                            }
                            let awardTitle = 'Regular Season Champion';
                            if(division.name) {
                                awardTitle = `${division.name} Division Champion`;
                            }
                            displayAwards.push({
                                award: awardTitle,
                                icon: '/awards/division.png',
                                type: 'award',
                                originalName: getTeamNameFromTeamManagers(leagueTeamManagers, cRosterID, podium.year),
                                year: podium.year,
                                former
                            })
                        }
                    }
                } else if(checkIfDeserves(podium[award], cRosterID, podium.year)) {
                    const former = tookOver && tookOver > podium.year;
                    if(former) {
                        formerGlobal = true;
                    }
                    displayAwards.push({
                        award: capitalizeFirstLetter(award),
                        icon: '/awards/' + award + '.png',
                        type: 'award',
                        originalName: getTeamNameFromTeamManagers(leagueTeamManagers, cRosterID, podium.year),
                        year: podium.year,
                        former
                    })
                }
            }
        }

        // Next look through record books
        const leagueManagerRecords = [];
        for(const key in records.regularSeasonData.leagueManagerRecords) {
            const record = records.regularSeasonData.leagueManagerRecords[key];
            record.rosterID = key;
            leagueManagerRecords.push(record);
        }
        const winRecords = [...leagueManagerRecords].sort((a, b) => b.wins - a.wins);
        const pointsRecords = [...leagueManagerRecords].sort((a, b) => b.fptsFor - a.fptsFor);
        const iqRecords = [...leagueManagerRecords].sort((a, b) => (b.fptsFor/b.potentialPoints) - (a.fptsFor/a.potentialPoints));

        for(let i = 0; i < records.regularSeasonData.leagueWeekHighs.length; i++) {
            const leagueWeekRecord = records.regularSeasonData.leagueWeekHighs[i];
            const seasonLongRecord = records.regularSeasonData.mostSeasonLongPoints[i];
            const winRecord = winRecords[i];
            const pointsRecord = pointsRecords[i];
            const iqRecord = iqRecords[i];

            if(checkIfDeservesWithManagerID(winRecord?.rosterID, cRosterID) && i < 3) {
                displayAwards.push({
                    award: i + 1,
                    icon: '/awards/record-' + (i+1) + '.png',
                    type: 'All-Time Wins Record',
                    extraInfo: winRecord.wins,
                    wins: true
                })
            }

            if(checkIfDeservesWithManagerID(pointsRecord?.rosterID, cRosterID) && i < 3) {
                displayAwards.push({
                    award: i + 1,
                    icon: '/awards/record-' + (i+1) + '.png',
                    type: 'All-Time Fantasy Points Record',
                    extraInfo: round(pointsRecord.fptsFor)
                })
            }

            if(checkIfDeservesWithManagerID(iqRecord?.rosterID, cRosterID) && i < 3) {
                displayAwards.push({
                    award: i + 1,
                    icon: '/awards/record-' + (i+1) + '.png',
                    type: 'All-Time Lineup IQ Record',
                    extraInfo: round(iqRecord.fptsFor * 100 / iqRecord.potentialPoints),
                    iq: true
                })
            }

            if(checkIfDeserves(leagueWeekRecord.rosterID, cRosterID, leagueWeekRecord.year)) {
                const former = tookOver && tookOver > leagueWeekRecord.year;
                if(former) {
                    formerGlobal = true;
                }
                displayAwards.push({
                    award: i + 1,
                    icon: '/awards/' + (i < 3 ? `record-${i+1}` : 'generic') + '.png',
                    type: 'All-Time Single Week Record',
                    originalName: getTeamNameFromTeamManagers(leagueTeamManagers, cRosterID, leagueWeekRecord.year),
                    year: leagueWeekRecord.year,
                    week: leagueWeekRecord.week,
                    extraInfo: leagueWeekRecord.fpts,
                    former
                })
            }

            if(checkIfDeserves(seasonLongRecord.rosterID, cRosterID, seasonLongRecord.year)) {
                const former = tookOver && tookOver > seasonLongRecord.year;
                if(former) {
                    formerGlobal = true;
                }
                displayAwards.push({
                    award: i + 1,
                    icon: '/awards/' + (i < 3 ? `record-${i+1}` : 'generic') + '.png',
                    type: 'All-Time Season Long Points',
                    originalName: getTeamNameFromTeamManagers(leagueTeamManagers, cRosterID, seasonLongRecord.year),
                    year: seasonLongRecord.year,
                    extraInfo: seasonLongRecord.fpts,
                    former
                })
            }
        }
        for(const yearRecords of records.regularSeasonData.seasonWeekRecords) {
            for(let i = 0; i < 3; i++) {
                const seasonPointsRecord = yearRecords.seasonPointsHighs[i];
                if(checkIfDeserves(seasonPointsRecord.rosterID, cRosterID, yearRecords.year)) {
                    const former = tookOver && tookOver > yearRecords.year;
                    if(former) {
                        formerGlobal = true;
                    }
                    displayAwards.push({
                        award: i + 1,
                        icon: '/awards/' + (i < 3 ? `record-${i+1}` : 'generic') + '.png',
                        type: `${yearRecords.year} Single Week Record`,
                        originalName: getTeamNameFromTeamManagers(leagueTeamManagers, cRosterID, seasonPointsRecord.year),
                        year: null,
                        week: seasonPointsRecord.week,
                        extraInfo: seasonPointsRecord.fpts,
                        former
                    })
                }
            }
        }
    }

    $: computePodiums(rosterID);
    $: sortedAwards = [...displayAwards].sort((a, b) => {
        const yearA = a.year ?? -1;
        const yearB = b.year ?? -1;
        if (yearA !== yearB) return yearB - yearA;
        return String(a.type).localeCompare(String(b.type));
    });
    $: if (browser && managerID && leagueTeamManagers) {
        loadPlayerAwards();
    }

    const computeAward = (award) => {
        switch (award) {
            case 1:
                return '1st Place'
            case 2:
                return '2nd Place'
            case 3:
                return '3rd Place'
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                return award + 'th Place';
            case 'Champion':
                return award
            case 'Second':
            case 'Third':
                return award + ' Place'
            case 'Toilet':
                return award + ' Bowl'
            default:
                return award;
        }
    }

    async function loadPlayerAwards() {
        const requestId = ++playerAwardsRequest;
        playerAwardsLoading = true;
        const awards = await getManagerPlayerAwards({ managerID, leagueTeamManagers }).catch(() => []);
        if (requestId !== playerAwardsRequest) return;
        playerAwards = awards;
        playerAwardsLoading = false;
    }

    function scrollCarousel(target, direction) {
        if (!target) return;
        const amount = Math.max(target.clientWidth * 0.78, 220);
        target.scrollBy({
            left: direction * amount,
            behavior: 'smooth'
        });
    }

    const medalPathByRank = {
        1: '/gold-medal.json',
        2: '/silver-medal.json',
        3: '/bronze-medal.json'
    };

    function initMedalLottie(node, rank) {
        const path = medalPathByRank[rank];
        if (!path) return {};

        const animation = lottie.loadAnimation({
            container: node,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path
        });

        return {
            destroy() {
                animation.destroy();
            }
        };
    }

    function initChampionLottie(node) {
        const animation = lottie.loadAnimation({
            container: node,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/trophy.json'
        });

        return {
            destroy() {
                animation.destroy();
            }
        };
    }

    function initDivisionLottie(node) {
        const animation = lottie.loadAnimation({
            container: node,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/winner-badge.json'
        });

        return {
            destroy() {
                animation.destroy();
            }
        };
    }
</script>

<style>
    .awardsCase {
        font-family: 'Space Mono', monospace;
        background-color: var(--fff);
        padding: 0 0 0.75em;
        margin: 2em 0 2.5em;
        border-bottom: 1px solid var(--aaa);
        border-top: 1px solid var(--aaa);
        box-shadow: 0 0 8px 4px var(--ccc);
    }

.awardsCarousel {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) 48px;
        align-items: center;
        column-gap: 0.75em;
        padding: 0 0.8em;
    }

    .awardsCaseInner {
        display: flex;
        gap: 1em;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding: 0.5em 0.2em 0.75em;
        scrollbar-width: none;
        -ms-overflow-style: none;
        min-width: 0;
    }

    .awardsCaseInner::-webkit-scrollbar {
        display: none;
    }

    h3 {
        text-align: center;
        font-size: 1.5em;
        margin: 0.75em 0 0.35em;
        font-weight: 200;
        font-family: 'Press Start 2P', cursive;
    }

    .award {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin: 0.4em 0 0.9em;
        min-width: 140px;
        scroll-snap-align: start;
        flex: 0 0 auto;
    }

    .playerAward {
        justify-content: center;
    }

    .playerAward .awardIcon {
        margin-top: 0.75em;
    }

    .playerAward .awardLabel {
        font-weight: 700;
    }

    .playerAwardMedia {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-bottom: 4.25em;
    }

    .playerAward .awardIcon {
        position: relative;
        z-index: 2;
    }

    .medalLottie {
        position: absolute;
        top: calc(2.55em + 1px);
        left: 50%;
        transform: translateX(-50%);
        width: 110px;
        height: 110px;
        z-index: 1;
        pointer-events: none;
    }

    .awardHeader, .awardLabel, .subText {
        text-align: center;
        line-height: 1.2em;
    }

    .awardHeader {
        height: 2.4em;
        font-size: 0.85em;
        width: 110px;
        margin-bottom: 1.5em;
    }

    .awardLabel {
        font-size: 0.9em;
        margin-top: 1em;
        font-weight: 500;
        width: 130px;
    }

    .subText {
        font-size: 0.8em;
        width: 130px;
        color: var(--g555);
        margin-top: 0.3em;
    }

    .sad {
        color: var(--g999);
        font-style: italic;
    }

    .loadingText {
        color: var(--g999);
        font-style: italic;
        text-align: center;
        width: 100%;
        margin: 1.25em 0;
    }

    .awardIcon {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80px;
        width: 80px;
        border-radius: 100%;
        box-shadow: 0 0 4px 1px var(--ccc);
        text-align: center;
        overflow: hidden;
    }

    .awardImage{
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .awardVideo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        display: block;
    }

    .awardLottie {
        width: 78%;
        height: 78%;
        margin: auto;
    }

    .carouselButton {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 42px;
        width: 42px;
        justify-self: center;
        border: 1px solid rgba(31, 41, 55, 0.14);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.8);
        color: #374151;
        font-size: 1.2em;
        cursor: pointer;
        flex-shrink: 0;
        box-shadow: 0 6px 14px rgba(82, 96, 107, 0.12);
    }

    .carouselButton:hover {
        background: rgba(255, 255, 255, 0.95);
    }
    
    .disclaimer {
        font-size: 0.8em;
        color: var(--g999);
        font-style: italic;
        text-align: center;
        margin: 0;
        line-height: 1em;
    }

    @media (max-width: 730px) {
        .awardsCarousel {
            grid-template-columns: 40px minmax(0, 1fr) 40px;
            column-gap: 0.45em;
            padding: 0 0.35em;
        }

        .awardHeader {
            height: 3.6em;
            font-size: 0.8em;
            width: 90px;
        }

        .awardLabel {
            width: 90px;
        }

        .subText {
            width: 90px;
        }
    }

    @media (max-width: 530px) {
        .carouselButton {
            height: 36px;
            width: 36px;
            font-size: 1em;
        }

        .award {
            min-width: 108px;
        }

        .awardIcon {
            height: 60px;
            width: 60px;
        }

        .playerAwardMedia {
            padding-bottom: 3.6em;
        }

        .medalLottie {
            top: calc(2.15em + 1px);
            width: 92px;
            height: 92px;
        }

        .awardHeader {
            height: 3.6em;
            font-size: 0.58em;
            width: 65px;
        }

        .awardLabel {
            font-size: 0.7em;
            width: 65px;
        }

        .subText {
            font-size: 0.6em;
            width: 65px;
        }
    }


</style>

<div class="awardsCase">
    <h3>Manager Awards</h3>
    <div class="awardsCarousel">
        <button class="carouselButton" type="button" aria-label="Previous awards" onclick={() => scrollCarousel(carouselEl, -1)}>‹</button>
        <div class="awardsCaseInner" bind:this={carouselEl}>
        {#each sortedAwards as award}
            <div class="award">
                <div class="awardHeader">{award.type != 'award' ? award.type : ''}</div>
                <div class="awardIcon">
                    {#if award.type == 'award' && award.award == 'Champion'}
                        <div class="awardLottie" use:initChampionLottie></div>
                    {:else if award.type == 'award' && String(award.award).includes('Division Champion')}
                        <div class="awardLottie" use:initDivisionLottie></div>
                    {:else if award.type == 'award' && award.award == 'Toilet'}
                        <video class="awardVideo" autoplay muted loop playsinline aria-label="Toilet Bowl award">
                            <source src="/ToiletBowl.mp4" type="video/mp4" />
                        </video>
                    {:else}
                        <img class="awardImage" src="{award.icon}" alt="trophy" />
                    {/if}
                </div>
                <div class="awardLabel">{award.type == 'award' ? `${award.year} ` : ''}{computeAward(award.award)}{award.former ? '*' : ''}</div>
                {#if award.extraInfo}
                    <div class="subText">{award.year ? `${award.year} ` : ''}{award.week ? `Week ${award.week} ` : ''}{award.year || award.week ? ' - ' : ''}{award.extraInfo}{award.wins ? ' Wins' : ''}{award.iq ? '%' : ''}{!award.wins && !award.iq ? 'pts' : ''}</div>
                {/if}
            </div>
        {:else}
            <p class="sad">...nothing yet</p>
        {/each}
        </div>
        <button class="carouselButton" type="button" aria-label="Next awards" onclick={() => scrollCarousel(carouselEl, 1)}>›</button>
    </div>
    {#if formerGlobal}
        <p class="disclaimer">*Awarded under a previous manager</p>
    {/if}
</div>

<div class="awardsCase">
    <h3>Player Awards</h3>
    <div class="awardsCarousel">
        <button class="carouselButton" type="button" aria-label="Previous player awards" onclick={() => scrollCarousel(playerAwardsCarouselEl, -1)}>‹</button>
        <div class="awardsCaseInner" bind:this={playerAwardsCarouselEl}>
            {#if playerAwardsLoading}
                <p class="loadingText">Loading player awards...</p>
            {:else}
                {#each playerAwards as award}
                    <div class="award playerAward">
                        <div class="awardLabel">{award.name}</div>
                        <div class="subText">{award.subtitle}</div>
                        <div class="playerAwardMedia">
                            <div class="awardIcon">
                                <img class="awardImage" src={award.avatar} alt={award.name} />
                            </div>
                            {#if award.rank <= 3}
                                <div class="medalLottie" use:initMedalLottie={award.rank}></div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <p class="sad">...nothing yet</p>
                {/each}
            {/if}
        </div>
        <button class="carouselButton" type="button" aria-label="Next player awards" onclick={() => scrollCarousel(playerAwardsCarouselEl, 1)}>›</button>
    </div>
</div>

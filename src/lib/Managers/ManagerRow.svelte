<script>
    import { goto } from "$app/navigation";
        import { getDatesActive, getRosterIDFromManagerID } from "$lib/utils/helperFunctions/universalFunctions";
    import {dynasty} from "$lib/utils/leagueInfo"

    export let manager, leagueTeamManagers, key;

    let retired = false;

    // manager.roster is deprecated, pages should be using managerID now
    let rosterID = manager.roster;
    let year = null;

    if(manager.managerID) {
        const dates = getDatesActive(leagueTeamManagers, manager.managerID);
        if(dates.end) retired = true;

        ({rosterID, year} = getRosterIDFromManagerID(leagueTeamManagers, manager.managerID) || {rosterID, year});
    }

    const commissioner = manager.managerID ? leagueTeamManagers.users[manager.managerID].is_owner : false;

    function getPreferredContactIcon(preferredContact) {
        if (preferredContact === 'Phone') {
            return '/PhoneCallIcon.gif';
        }
        if (preferredContact === 'WhatsApp') {
            return '/WhatsAppIcon.gif';
        }
        if (preferredContact === 'Text') {
            return '/TextMessageIcon.gif';
        }
        if (preferredContact === 'Carrier Pigeon') {
            return '/CarrierPigeonIcon.gif';
        }
        return `/${preferredContact}.png`;
    }

    function getConfIcon(conf) {
        if (conf === 'North') {
            return '/NorthConfIcon.gif';
        }
        if (conf === 'South') {
            return '/SouthConfIcon.gif';
        }
        return `/managers/question.jpg`;
    }
</script>

<style>
    .manager {
        display: flex;
        justify-content: left;
        align-items: center;
        padding: 1.35em 0;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.14)),
            rgba(255, 255, 255, 0.12);
        background-repeat: no-repeat;
        background-position: 15% 50%;
        margin: 0.7em 0;
        border-radius: 2em;
        border: 1px solid rgba(255, 255, 255, 0.58);
        box-shadow:
            0 10px 24px rgba(72, 44, 119, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.55),
            inset 0 -1px 0 rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .manager:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.78);
        box-shadow:
            0 16px 32px rgba(72, 44, 119, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.62);
    }

    .photo {
        height: 48px;
        width: 48px;
        border-radius: 100%;
        vertical-align: middle;
        margin-left: 1em;
        box-shadow: 0 0 2px 1px var(--bbb);
    }

    .nameTeamWrapper {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-left: 5em;
        min-width: 0;
        flex: 1;
        max-width: 200px;
        text-align: left;
    }

    .name {
        color: #1f2937;
        line-height: 1.2em;
        font-weight: 700;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .spacer {
        flex-grow: 1;
    }

    .info {
        display: flex;
    }

    .infoSlot {
        text-align: center;
        margin: 0 0.5em;
        width: 63px;
    }

    .infoIcon {
        display: inline-flex;
        height: 46px;
        width: 46px;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        border: 1px solid rgba(255, 255, 255, 0.52);
        overflow: hidden;
        background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.22)),
            rgba(255, 255, 255, 0.24);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            0 4px 12px rgba(82, 96, 107, 0.12);
    }

    .infoImg {
        height: 34px;
    }

    .infoImg.whatsappIcon {
        height: 40px;
        width: 40px;
        object-fit: contain;
    }

    .infoAnswer {
        font-size: 0.8em;
        color: var(--g555);
        width: 63px;
        text-align: center;
        line-height: 1.2em;
    }

    .avatarHolder {
        display: inline-flex;
        position: relative;
    }

    .commissionerBadge {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: -10px;
        right: -10px;
        height: 25px;
        width: 25px;
        font-weight: 600;
        border-radius: 15px;
        background-color: var(--blueTwo);
        border: 1px solid var(--blueOne);
        color: #fff;
    }

        @media (max-width: 665px) {
        .nameTeamWrapper {
            margin-left: 1.5em;
            max-width: 160px;
        }

        .name {
            font-size: 0.9em;
        }

    }

        @media (max-width: 595px) {
        .infoAnswer {
            display: none;
        }

        .manager {
            padding: 0.9em 0;
            margin: 0.45em 0;
            border-radius: 1.5em;
        }

        .photo {
            height: 38px;
            width: 38px;
            margin-left: 0.5em;
        }

        .commissionerBadge {
            height: 15px;
            width: 15px;
            font-size: 0.8em;
        }

        .infoSlot {
            text-align: center;
            margin: 0 0.4em;
            width: 56px;
        }

        .infoIcon {
            height: 38px;
            width: 38px;
        }

        .infoImg {
            height: 30px;
        }

        .infoImg.whatsappIcon {
            height: 34px;
            width: 34px;
        }

        .infoAnswer {
            font-size: 0.7em;
            width: 56px;
        }
    }

    @media (max-width: 475px) {
        .nameTeamWrapper {
            margin-left: 1.5em;
            max-width: 120px;
        }

        .name {
            font-size: 0.8em;
        }

        .photo {
            height: 34px;
            width: 34px;
        }

        .infoSlot {
            text-align: center;
            margin: 0 0.4em;
            width: 49px;
        }

        .infoIcon {
            height: 34px;
            width: 34px;
        }

        .infoImg {
            height: 27px;
        }

        .infoImg.whatsappIcon {
            height: 30px;
            width: 30px;
        }

        .infoAnswer {
            font-size: 0.6em;
            width: 49px;
        }
    }

    @media (max-width: 370px) {
        .infoTeam {
            display: none;
        }
    }

    .question {
        background-color: #fff;
    }
</style>

<div class="manager" style="{retired ? "background-image: url(/retired.png)": ""}" onclick={() => goto(`/manager?manager=${key}`)}>
    <div class="avatarHolder">
        <img class="photo" src="{manager.photo}" alt="{manager.name}" />
        {#if commissioner}
            <div class="commissionerBadge">
                <span>C</span>
            </div>
        {/if}
    </div>
    <div class="nameTeamWrapper">
        <div class="name">{manager.name}</div>
    </div>
    <div class="spacer" />
    <div class="info">
        <!-- Favorite team (optional) -->
        <div class="infoSlot infoTeam">
            {#if manager.favoriteTeam}
                <div class="infoIcon">
                    <img class="infoImg" src="https://sleepercdn.com/images/team_logos/nfl/{manager.favoriteTeam}.png" alt="favorite team"/>
                </div>
            {:else}
                <div class="infoIcon question">
                    <img class="infoImg" src="/managers/question.jpg" alt="favorite team"/>
                </div>
            {/if}
        </div>
        <!-- Preferred contact -->
        <div class="infoSlot">
            {#if manager.preferredContact}
                <div class="infoIcon">
                    <img class="infoImg {manager.preferredContact === 'WhatsApp' ? 'whatsappIcon' : ''}" src={getPreferredContactIcon(manager.preferredContact)} alt={manager.preferredContact}/>
                </div>
                <div class="infoAnswer">
                    {manager.preferredContact}
                </div>
            {:else}
                <div class="infoIcon question">
                    <img class="infoImg" src="/managers/question.jpg" alt="favorite team"/>
                </div>
            {/if}
        </div>
        <!-- Conference -->
        {#if dynasty}
            <div class="infoSlot infoRebuild">
                {#if manager.Conf}
                    <div class="infoIcon">
                        <img class="infoImg" src={getConfIcon(manager.Conf)} alt="{manager.Conf} conference"/>
                    </div>
                    <div class="infoAnswer">
                        {manager.Conf}
                    </div>
                {:else}
                    <div class="infoIcon question">
                        <img class="infoImg" src="/managers/question.jpg" alt="favorite team"/>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

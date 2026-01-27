<script>
    import { gotoManager } from '$lib/utils/helper';
        import { Row, Cell } from '@smui/data-table';

    export let columnOrder, team, standing, leagueTeamManagers;
</script>

<script context="module">
    function getColumnStyle(field, value) {
        const styles = {
            wins: 'font-weight: bold; color: green;',
            ties: 'font-weight: bold; color: black;',
            losses: 'font-weight: bold; color: red;',
            divisionWins: 'font-weight: bold; color: green;',
            divisionTies: 'font-weight: bold; color: black;',
            divisionLosses: 'font-weight: bold; color: orange;',
            fpts: 'font-weight: bold; color: black;',
            fptsAgainst: 'font-weight: bold; color: green;',
        };
        
        if (field === 'streak') {
            const isWin = String(value).includes('W');
            return `font-weight: bold; color: ${isWin ? 'green' : 'orange'};`;
        }
        
        return styles[field] || '';
    }
</script>

<style>
    .clickable {
        cursor: pointer;
    }
        
        .teamAvatar {
                vertical-align: middle;
                border-radius: 50%;
                height: 40px;
                margin-right: 15px;
                border: 0.25px solid #777;
        }

    :global(.contrastRow) {
        background-color: var(--f8f8f8);
    }

    .team {
        text-align: center;
    }

    .statCell {
        font-family: 'Rubik', sans-serif;
    }
</style>

<Row class="contrastRow">
    <Cell class="">
        <div class="clickable team" onclick={() => gotoManager({leagueTeamManagers, rosterID: standing.rosterID})}>
            <img alt="team avatar" class="teamAvatar clickable" src="{team.avatar}" />
            <div>
                {team.name}
            </div>
        </div>
    </Cell>
    {#each columnOrder as column}
        <Cell class="center"><span class="statCell" style="{getColumnStyle(column.field, standing[column.field])}">{standing[column.field]}</span></Cell>
    {/each}
</Row>
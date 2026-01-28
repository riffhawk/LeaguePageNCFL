<script>
    import { onMount } from 'svelte';
    
    export let teamId;
    
    let positionData = [];
    let loading = true;
    let currentSeason = new Date().getFullYear();
    
    const positions = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DEF'];
    const positionColors = {
        'QB': '#e74c3c',
        'RB': '#3498db',
        'WR': '#2ecc71',
        'TE': '#f39c12',
        'FLEX': '#9b59b6',
        'K': '#1abc9c',
        'DEF': '#e67e22'
    };
    
    onMount(async () => {
        try {
            const response = await fetch('/posRanks.json');
            const json = await response.json();
            
            const teamData = json.data.filter(d => d.team_id === teamId);
            
            positionData = positions.map(pos => {
                const match = teamData.find(d => d.player_position_fantasy === pos);
                return {
                    position: pos,
                    rank: match ? match.team_rank : 12,
                    points: match ? match.total_fantasy_points : 0,
                    totalTeams: match ? match.total_teams : 12
                };
            });
        } catch (e) {
            console.error('Error loading position data:', e);
        }
        loading = false;
    });
    
    function getStrengthScore(rank, totalTeams) {
        return ((totalTeams - rank + 1) / totalTeams) * 100;
    }
    
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    
    function generatePolygonPoints(data, centerX, centerY, maxRadius) {
        const angleStep = 360 / data.length;
        return data.map((d, i) => {
            const score = getStrengthScore(d.rank, d.totalTeams);
            const radius = (score / 100) * maxRadius;
            const point = polarToCartesian(centerX, centerY, radius, i * angleStep);
            return `${point.x},${point.y}`;
        }).join(' ');
    }
    
    function generateGridPolygon(centerX, centerY, radius, sides) {
        const angleStep = 360 / sides;
        let points = [];
        for (let i = 0; i < sides; i++) {
            const point = polarToCartesian(centerX, centerY, radius, i * angleStep);
            points.push(`${point.x},${point.y}`);
        }
        return points.join(' ');
    }
    
    function getRankLabel(rank) {
        if (rank <= 3) return 'strength';
        if (rank >= 10) return 'weakness';
        return 'average';
    }
    
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 100;
</script>

<style>
    .radar-container {
        width: 100%;
        max-width: 400px;
        margin: 2em auto;
        text-align: center;
    }
    
    .radar-title {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 1.1em;
        color: #333;
        margin-bottom: 1em;
    }
    
    .radar-svg {
        width: 100%;
        height: auto;
    }
    
    .grid-line {
        fill: none;
        stroke: #e0e0e0;
        stroke-width: 1;
    }
    
    .axis-line {
        stroke: #ccc;
        stroke-width: 1;
    }
    
    .data-polygon {
        fill: rgba(0, 49, 107, 0.25);
        stroke: #00316b;
        stroke-width: 2;
    }
    
    .position-label {
        font-family: 'Rubik', sans-serif;
        font-size: 12px;
        font-weight: 600;
        fill: #333;
    }
    
    .rank-badge {
        font-family: 'Rubik', sans-serif;
        font-size: 10px;
        font-weight: 500;
    }
    
    .strength {
        fill: #2ecc71;
    }
    
    .weakness {
        fill: #e74c3c;
    }
    
    .average {
        fill: #666;
    }
    
    .legend {
        display: flex;
        justify-content: center;
        gap: 1.5em;
        margin-top: 1em;
        flex-wrap: wrap;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.3em;
        font-size: 0.75em;
        color: #666;
        font-family: 'Rubik', sans-serif;
    }
    
    .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    
    .legend-dot.strength-dot { background: #2ecc71; }
    .legend-dot.weakness-dot { background: #e74c3c; }
    .legend-dot.average-dot { background: #666; }
    
    .loading-text {
        color: #888;
        font-style: italic;
    }
    
    @media (max-width: 480px) {
        .radar-container {
            max-width: 300px;
        }
        
        .position-label {
            font-size: 10px;
        }
        
        .rank-badge {
            font-size: 8px;
        }
    }
</style>

<div class="radar-container">
    <div class="radar-title">{currentSeason} Roster Strengths</div>
    
    {#if loading}
        <p class="loading-text">Loading position data...</p>
    {:else if positionData.length > 0}
        <svg class="radar-svg" viewBox="0 0 300 300">
            {#each [0.25, 0.5, 0.75, 1] as scale}
                <polygon 
                    class="grid-line" 
                    points={generateGridPolygon(centerX, centerY, maxRadius * scale, positions.length)}
                />
            {/each}
            
            {#each positions as pos, i}
                {@const angle = (360 / positions.length) * i}
                {@const endpoint = polarToCartesian(centerX, centerY, maxRadius, angle)}
                <line 
                    class="axis-line"
                    x1={centerX} 
                    y1={centerY} 
                    x2={endpoint.x} 
                    y2={endpoint.y}
                />
            {/each}
            
            <polygon 
                class="data-polygon"
                points={generatePolygonPoints(positionData, centerX, centerY, maxRadius)}
            />
            
            {#each positionData as data, i}
                {@const angle = (360 / positions.length) * i}
                {@const labelPos = polarToCartesian(centerX, centerY, maxRadius + 25, angle)}
                {@const rankClass = getRankLabel(data.rank)}
                <text 
                    class="position-label"
                    x={labelPos.x} 
                    y={labelPos.y}
                    text-anchor="middle"
                    dominant-baseline="middle"
                >
                    {data.position}
                </text>
                <text 
                    class="rank-badge {rankClass}"
                    x={labelPos.x} 
                    y={labelPos.y + 12}
                    text-anchor="middle"
                    dominant-baseline="middle"
                >
                    #{data.rank}
                </text>
            {/each}
        </svg>
        
        <div class="legend">
            <div class="legend-item">
                <span class="legend-dot strength-dot"></span>
                <span>Strength</span>
            </div>
            <div class="legend-item">
                <span class="legend-dot weakness-dot"></span>
                <span>Weakness</span>
            </div>
        </div>
    {:else}
        <p class="loading-text">No position data available</p>
    {/if}
</div>

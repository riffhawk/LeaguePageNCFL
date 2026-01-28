<script>
    import { onMount } from 'svelte';
</script>

<style>
    .survivor-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2em 1em;
    }
    
    .page-title {
        font-family: 'Inter', sans-serif;
        font-weight: 700;
        font-size: 2em;
        color: #00316b;
        text-align: center;
        margin-bottom: 1em;
    }
    
    .content-placeholder {
        background: white;
        border-radius: 12px;
        padding: 2em;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .content-placeholder p {
        font-family: 'Rubik', sans-serif;
        color: #666;
        font-size: 1.1em;
    }
</style>

<svelte:head>
    <title>Survivor Series | NCFL</title>
</svelte:head>

<div class="survivor-container">
    <h1 class="page-title">Survivor Series</h1>
    
    <div class="content-placeholder">
        <p>Coming soon...</p>
    </div>
</div>

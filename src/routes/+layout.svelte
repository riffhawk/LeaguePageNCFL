<!-- __layout.svelte -->
<script>
        import { Nav } from "$lib/components"
    import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';
 
    injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<style>
    :global(:root) {
        --fff: #fff;
        --fffTransparent: rgba(255,255,255,0);
        --f8f8f8: #f8f8f8;
        --f3f3f3: #f3f3f3;
        --eee: #eee;
        --ebebeb: #ebebeb;
        --ddd: #ddd;
        --d7d7d7: #d7d7d7;
        --ccc: #ccc;
        --bbb: #bbb;
        --aaa: #aaa;
        --g999: #999;
        --g555: #555;
        --g444: #444;
        --g333: #333;
        --g111: #111;
        --g000: #000;
        --boxShadowOne: #ccc;
        --boxShadowTwo: #cacaca;
        --boxShadowThree: #d4d4d4;
        --ir: #ddd;
        --champShadow: #555;
        --transactHeader: #f5fcff;
        --draftSwapped: #f8fcff;
        --waiverAdd: #e9fff1;
        --waiverDrop: #ffe9e9;
        --bracketMatch: #fafeff;
        --matchupSelected: #fff;
        --fadeOne: rgba(255, 255, 255, 0) 0%;
        --fadeTwo: rgba(255, 255, 255, 0.7) 50%;
        --fadeThree: rgba(255, 255, 255, 0.9) 90%;
        --fadeFour: rgba(255, 255, 255, 1) 100%;
        --blueOne: #2d2d2d;
        --blueTwo: #6b8ba4;
        --r1: #f7f9fd;
        --r2: #fbf7f7;
        --r3: #f7fbf7;
        --headerPrimary: #e8eef3;
        --borderOverride: rgba(0,0,0,.12);
        --rivalryBack: #f8f8f8;
    }
</style>

<main>
    <Nav /> <!-- adds the nav (small and large) -->
  
    <slot />
</main>
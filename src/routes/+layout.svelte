<!-- __layout.svelte -->
<script>
        import { Nav } from "$lib/components"
    import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';
 
    injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<main>
    <Nav /> <!-- adds the nav (small and large) -->
  
    <slot />
</main>
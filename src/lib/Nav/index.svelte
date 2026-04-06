<script>
        import NavSmall from './NavSmall.svelte';
        import NavLarge from './NavLarge.svelte';
    import { page } from '$app/state';
</script>

<svelte:head>
        <title>{!page.url.pathname[1] ? 'Home' : page.url.pathname[1].toUpperCase() + page.url.pathname.slice(2)} | League Page</title>
</svelte:head>

<style>
        a {
                display: table;
        margin: 0 auto;
        }
        nav {
                background-color: var(--fff);
                position: relative;
                z-index: 2;
                border-bottom: 1px solid #2d2d2d;
                box-shadow: 0 0 8px 0 #2d2d2d;
        }

        #logo {
                width: 100px;
                display: block;
                margin: 0 auto;
                padding: 10px;
        }

    .large {
                display: block;
    }

        .small {
                display: none;
        }


        @media (max-width: 950px) { /* width of the large navBar */
                .large {
                        display: none;
                }

                .small {
                        display: block;
                }
        }
</style>

<nav>
        <a href="/"><img id="logo" alt="league logo" src="/badge.png" /></a>

        <div class="large">
                <NavLarge />
        </div>

        <div class="small">
                <NavSmall />
        </div>

</nav>

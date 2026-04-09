<script>
        import { tabs } from '$lib/utils/tabs';
        import { onMount, tick } from 'svelte';
        import Drawer, {
          Content,
          Header,
          Title,
        } from '@smui/drawer';
        import { Icon } from '@smui/tab';
        import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
        import { goto, preloadData } from '$app/navigation';
        import { page } from '$app/state';
        import { leagueName } from '$lib/utils/helper';
        import { enableBlog, managers } from '$lib/utils/leagueInfo';

        let active = $state(page.url.pathname);
        let open = $state(false);
        let tabBarEl;
        let pressedDest = null;
        let indicatorStyle = 'opacity: 0;';
        let tabButtons = [];

        const mobileTabs = [
                { label: 'Matchups', dest: '/matchups', icon: 'sports_football' },
                { label: 'Managers', dest: '/managers', icon: 'groups' },
                { label: 'Home', dest: '/', icon: 'home' },
                { label: 'Awards', dest: '/awards', icon: 'emoji_events' },
                { label: 'News', dest: '/transactions', icon: 'article' },
        ];

        const isTabActive = (dest) => {
                const pathname = page.url.pathname;
                if (dest === '/') return pathname === '/';
                if (dest === '/managers') return pathname === '/managers' || pathname === '/manager';
                return pathname.startsWith(dest);
        };

        const selectTab = (tab) => {
                open = false;
                goto(tab.dest);
        }

        const updateIndicator = async () => {
                await tick();
                if (!tabBarEl) return;
                const activeIndex = mobileTabs.findIndex((tab) => isTabActive(tab.dest));
                const activeButton = tabButtons[activeIndex];
                if (!activeButton) {
                        indicatorStyle = 'opacity: 0;';
                        return;
                }

                const barRect = tabBarEl.getBoundingClientRect();
                const buttonRect = activeButton.getBoundingClientRect();
                const left = buttonRect.left - barRect.left;
                const top = buttonRect.top - barRect.top;

                indicatorStyle = `
                        opacity: 1;
                        width: ${buttonRect.width}px;
                        height: ${buttonRect.height}px;
                        transform: translate(${left}px, ${top}px);
                        border-radius: ${activeButton.classList.contains('homeButton') ? '999px' : '20px'};
                `;
        };

        const handlePressStart = (dest) => {
                pressedDest = dest;
        };

        const handlePressEnd = () => {
                pressedDest = null;
        };

        onMount(() => {
                updateIndicator();
                const handleResize = () => updateIndicator();
                window.addEventListener('resize', handleResize);
                return () => window.removeEventListener('resize', handleResize);
        });

        $effect(() => {
                page.url.pathname;
                updateIndicator();
        });
</script>

<style>
        :global(.menuIcon) {
                position: absolute;
                top: calc(env(safe-area-inset-top, 0px) + 15px);
                left: 15px;
                font-size: 2em;
                color: #888;
                padding: 6px;
                cursor: pointer;
        }

        :global(.menuIcon:hover) {
                color: #2d2d2d;
        }

        :global(.nav-drawer) {
                z-index: 9;
                top: 0;
                left: 0;
                font-family: 'Press Start 2P', cursive;
        }

        :global(.nav-drawer .mdc-drawer__header) {
                padding-top: calc(env(safe-area-inset-top, 0px) + 28px);
        }

        :global(.nav-drawer .mdc-drawer__title) {
                line-height: 1.2;
        }

        :global(.nav-item) {
                color: #858585 !important;
        }

        .nav-back {
                position: fixed;
                z-index: 8;
                width: 100%;
                width: 100vw;
                height: 100%;
                height: 100vh;
                top: 0;
                left: 0;
                background-color: rgba(0, 0, 0, 0.32);
                transition: all 0.7s;
        }

        .mobileTabShell {
                position: fixed;
                left: 50%;
                bottom: calc(env(safe-area-inset-bottom, 0px) + 8px);
                transform: translateX(-50%);
                width: min(360px, calc(100vw - 24px));
                height: 86px;
                z-index: 10;
                pointer-events: auto;
                border-radius: 30px;
                background:
                        linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.38)),
                        rgba(237, 242, 247, 0.32);
                border: 1px solid rgba(255, 255, 255, 0.72);
                box-shadow:
                        0 20px 40px rgba(28, 33, 52, 0.24),
                        inset 0 1px 0 rgba(255, 255, 255, 0.9),
                        inset 0 -1px 0 rgba(255, 255, 255, 0.35);
                backdrop-filter: blur(22px) saturate(170%);
                -webkit-backdrop-filter: blur(22px) saturate(170%);
                overflow: hidden;
        }

        .mobileTabShell::before {
                content: '';
                position: absolute;
                inset: 8px;
                border-radius: 24px;
                background:
                        radial-gradient(circle at top, rgba(255, 255, 255, 0.5), transparent 55%),
                        linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.02));
                pointer-events: none;
        }

        .mobileTabBar {
                position: absolute;
                inset: 0;
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                align-items: center;
                padding: 10px 12px 12px;
        }

        .mobileTabIndicator {
                position: absolute;
                left: 0;
                top: 0;
                background:
                        linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(243, 248, 252, 0.68)),
                        rgba(255, 255, 255, 0.78);
                border: 1px solid rgba(255, 255, 255, 0.85);
                box-shadow:
                        0 10px 22px rgba(28, 33, 52, 0.12),
                        inset 0 1px 0 rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(18px) saturate(180%);
                -webkit-backdrop-filter: blur(18px) saturate(180%);
                transition:
                        transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        height 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        border-radius 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                        opacity 0.24s ease;
                pointer-events: none;
                z-index: 0;
        }

        .mobileTabButton {
                appearance: none;
                border: 0;
                background: transparent;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.2em;
                color: rgba(37, 41, 55, 0.62);
                cursor: pointer;
                min-height: 64px;
                font-family: 'Space Mono', monospace;
                border-radius: 20px;
                transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), color 0.28s ease;
                z-index: 1;
                -webkit-tap-highlight-color: transparent;
                align-self: center;
        }

        .mobileTabButton .material-icons {
                font-size: 1.22rem;
                line-height: 1;
                margin: 0;
                transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mobileTabLabel {
                font-size: 0.55rem;
                font-weight: 700;
                letter-spacing: 0.02em;
                white-space: nowrap;
                transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mobileTabButton.active {
                color: #111827;
                transform: translateY(-2px);
        }

        .mobileTabButton.active::after {
                content: '';
                position: absolute;
                bottom: 4px;
                width: 16px;
                height: 4px;
                border-radius: 999px;
                background: rgba(17, 24, 39, 0.82);
        }

        .mobileTabButton.pressed {
                transform: translateY(1px) scale(0.94);
        }

        .mobileTabButton.pressed .material-icons,
        .mobileTabButton.pressed .mobileTabLabel {
                transform: scale(0.96);
        }

        .mobileTabButton.homeButton {
                width: auto;
                height: auto;
                min-height: 64px;
                margin: 0;
                border-radius: 20px;
                transform: translateY(0);
        }

        .mobileTabButton.homeButton.active {
                transform: translateY(-2px);
        }

        .mobileTabButton.homeButton.active::after {
                bottom: 7px;
        }

        .mobileTabButton.homeButton .mobileTabLabel {
                font-size: 0.5rem;
        }

        @media (max-width: 420px) {
                .mobileTabShell {
                        width: calc(100vw - 18px);
                        bottom: calc(env(safe-area-inset-bottom, 0px) + 6px);
                }

                .mobileTabBar {
                        padding-inline: 8px;
                }

                .mobileTabButton .material-icons {
                        font-size: 1.15rem;
                }

                .mobileTabLabel {
                        font-size: 0.5rem;
                }

                .mobileTabButton.homeButton {
                        min-height: 64px;
                }
        }
</style>

<Icon class="material-icons menuIcon" onclick={() => open = true} ripple={false} touch={true}>menu</Icon>

<div class="nav-back" style="pointer-events: {open ? "visible" : "none"}; opacity: {open ? 1 : 0};" onclick={() => open = false}></div>

<Drawer variant="modal" class="nav-drawer" fixed={true} bind:open>
        <Header>
                <Title>{leagueName}</Title>
        </Header>
        <Content>
                <List>
                        {#each tabs as tab}
                                {#if !tab.nest && (tab.label != 'Blog' || (tab.label == 'Blog' && enableBlog))}
                                        <Item href="javascript:void(0)" onSMUIAction={() => selectTab(tab)} ontouchstart={() => preloadData(tab.dest)} onmouseover={() => preloadData(tab.dest)} activated={active == tab.dest} >
                                                <Graphic class="material-icons{active == tab.dest ? "" : " nav-item"}" aria-hidden="true">{tab.icon}</Graphic>
                                                <Text class="{active == tab.dest ? "" : "nav-item"}">{tab.label}</Text>
                                        </Item>
                                {/if}
                        {/each}
                        {#each tabs as tab}
                                {#if tab.nest}
                                        <Separator />
                                        <Subheader>{tab.label}</Subheader>
                                        {#each tab.children as subTab}
                                                {#if subTab.label == 'Managers'}
                                                        {#if managers.length}
                                                                <Item href="javascript:void(0)" onSMUIAction={() => selectTab(subTab)} activated={active == subTab.dest}  ontouchstart={() => preloadData(subTab.dest)} onmouseover={() => preloadData(subTab.dest)}>
                                                                        <Graphic class="material-icons{active == subTab.dest ? "" : " nav-item"}" aria-hidden="true">{subTab.icon}</Graphic>
                                                                        <Text class="{active == subTab.dest ? "" : "nav-item"}">{subTab.label}</Text>
                                                                </Item>
                                                        {/if}
                                                {:else}
                                                        <Item href="javascript:void(0)" onSMUIAction={() => selectTab(subTab)} activated={active == subTab.dest}  ontouchstart={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}} onmouseover={() => {if(subTab.label != 'Go to Sleeper') preloadData(subTab.dest)}}>
                                                                {#if subTab.customIcon}
                                                                        <Graphic><img src={subTab.customIcon} alt={subTab.label} style="width: 24px; height: 24px; filter: brightness(0) saturate(100%) opacity(0.6);" /></Graphic>
                                                                {:else}
                                                                        <Graphic class="material-icons{active == subTab.dest ? "" : " nav-item"}" aria-hidden="true">{subTab.icon}</Graphic>
                                                                {/if}
                                                                <Text class="{active == subTab.dest ? "" : "nav-item"}">{subTab.label}</Text>
                                                        </Item>
                                                {/if}
                                        {/each}
                                {/if}
                        {/each}
                </List>
        </Content>
  </Drawer>

<div class="mobileTabShell" aria-label="Primary navigation">
        <div class="mobileTabBar">
                <div class="mobileTabIndicator" style={indicatorStyle}></div>
                {#each mobileTabs as tab}
                        <button
                                bind:this={tabButtons[mobileTabs.indexOf(tab)]}
                                class="mobileTabButton {isTabActive(tab.dest) ? 'active' : ''} {pressedDest === tab.dest ? 'pressed' : ''} {tab.dest === '/' ? 'homeButton' : ''}"
                                type="button"
                                aria-label={tab.label}
                                aria-current={isTabActive(tab.dest) ? 'page' : undefined}
                                onclick={() => selectTab(tab)}
                                onmousedown={() => handlePressStart(tab.dest)}
                                onmouseup={handlePressEnd}
                                onmouseleave={handlePressEnd}
                                ontouchstart={() => { handlePressStart(tab.dest); preloadData(tab.dest); }}
                                ontouchend={handlePressEnd}
                                ontouchcancel={handlePressEnd}
                                onmouseover={() => preloadData(tab.dest)}
                        >
                                <span class="material-icons" aria-hidden="true">{tab.icon}</span>
                                <span class="mobileTabLabel">{tab.label}</span>
                        </button>
                {/each}
        </div>
</div>

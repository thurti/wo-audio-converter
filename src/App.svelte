<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes } from "./routes";
  import active from "svelte-spa-router/active";
  import { config } from "./config";
  import Footer from "./components/Footer.svelte";
  import Updater, { isReady } from "./components/Updater.svelte";
  import UiContainer from "./components/ui/UIContainer.svelte";
  import Header from "./components/Header.svelte";
  import Home from "./pages/Home.svelte";
  import BrowserNotifications from "./components/BrowserNotifications.svelte";
  import Preloader from "./components/Preloader.svelte";
  import { isPreloadingFiles, preferedColorScheme } from "./store";
</script>

<div
  class="min-h-screen w-full p-1 theme-{config.colorScheme} {$preferedColorScheme}"
>
  {#if !$isReady || $isPreloadingFiles}
    <Preloader
      cacheName="wo-ffmpeg"
      cacheVersion={import.meta.env.VITE_FFMPEG_VERSION}
      urls={[
        import.meta.env.VITE_FFMPEG_CORE_PATH,
        import.meta.env.VITE_FFMPEG_WORKER_PATH,
        import.meta.env.VITE_FFMPEG_WASM_PATH,
      ]}
      ><Header title={config.titleHeader} class="!scale-75 !mb-0" /></Preloader
    >
  {:else}
    <!-- only hide to keep alive on page change  -->
    <div use:active={{ path: "/", inactiveClassName: "hidden" }}>
      <Home />
    </div>
    <Router {routes} restoreScrollState={true} />
    <BrowserNotifications />
  {/if}
  <Updater />
</div>
<Footer />

<style>
  div {
    background-color: var(--theme-bg-color);
    color: var(--theme-font-color);
  }

  /**
  *****************************
  ** NEUTRAL
  *****************************
  */
  :global(.theme-neutral) {
    --theme-bg-light-color: theme(colors.neutral.700);
    --theme-bg-color: theme(colors.neutral.800);
    --theme-bg-dark-color: theme(colors.neutral.900);
    --theme-btn-color: theme(colors.neutral.600);
    --theme-btn-color-dark: theme(colors.neutral.400);
    --theme-font-color: theme(colors.neutral.200);
    --theme-border-color: 245, 245, 245;

    @media (prefers-color-scheme: light) {
      --theme-bg-light-color: theme(colors.neutral.200);
      --theme-bg-color: theme(colors.neutral.100);
      --theme-bg-dark-color: theme(colors.neutral.400);
      --theme-btn-color: theme(colors.neutral.500);
      --theme-btn-color-dark: theme(colors.neutral.700);
      --theme-font-color: theme(colors.neutral.800);
      --theme-border-color: 38, 38, 38;
    }
  }

  :global(.theme-neutral.dark) {
    --theme-bg-light-color: theme(colors.neutral.700);
    --theme-bg-color: theme(colors.neutral.800);
    --theme-bg-dark-color: theme(colors.neutral.900);
    --theme-btn-color: theme(colors.neutral.600);
    --theme-btn-color-dark: theme(colors.neutral.400);
    --theme-font-color: theme(colors.neutral.200);
    --theme-border-color: 245, 245, 245;
  }

  :global(.theme-neutral.light) {
    --theme-bg-light-color: theme(colors.neutral.200);
    --theme-bg-color: theme(colors.neutral.100);
    --theme-bg-dark-color: theme(colors.neutral.400);
    --theme-btn-color: theme(colors.neutral.500);
    --theme-btn-color-dark: theme(colors.neutral.700);
    --theme-font-color: theme(colors.neutral.800);
    --theme-border-color: 38, 38, 38;
  }

  /**
  *****************************
  ** ZINC INDIGO
  *****************************
  */
  :global(.theme-zinc-indigo) {
    --theme-bg-light-color: theme(colors.zinc.700);
    --theme-bg-color: theme(colors.zinc.800);
    --theme-bg-dark-color: theme(colors.zinc.900);
    --theme-btn-color: theme(colors.indigo.600);
    --theme-btn-color-dark: theme(colors.indigo.400);
    --theme-font-color: theme(colors.indigo.50);
    --theme-border-color: 245, 245, 245;

    @media (prefers-color-scheme: light) {
      --theme-bg-light-color: theme(colors.zinc.200);
      --theme-bg-color: theme(colors.zinc.100);
      --theme-bg-dark-color: theme(colors.zinc.400);
      --theme-btn-color: theme(colors.indigo.500);
      --theme-btn-color-dark: theme(colors.indigo.700);
      --theme-font-color: theme(colors.neutral.800);
      --theme-border-color: 38, 38, 38;
    }
  }

  :global(.theme-zinc-indigo.dark) {
    --theme-bg-light-color: theme(colors.zinc.700);
    --theme-bg-color: theme(colors.zinc.800);
    --theme-bg-dark-color: theme(colors.zinc.900);
    --theme-btn-color: theme(colors.indigo.600);
    --theme-btn-color-dark: theme(colors.indigo.400);
    --theme-font-color: theme(colors.indigo.50);
    --theme-border-color: 245, 245, 245;
  }

  :global(.theme-zinc-indigo.light) {
    --theme-bg-light-color: theme(colors.zinc.200);
    --theme-bg-color: theme(colors.zinc.100);
    --theme-bg-dark-color: theme(colors.zinc.400);
    --theme-btn-color: theme(colors.indigo.500);
    --theme-btn-color-dark: theme(colors.indigo.700);
    --theme-font-color: theme(colors.neutral.800);
    --theme-border-color: 38, 38, 38;
  }

  /**
  *****************************
  ** ZINC EMERALD
  *****************************
  */
  :global(.theme-zinc-emerald) {
    --theme-bg-light-color: theme(colors.zinc.600);
    --theme-bg-color: theme(colors.zinc.700);
    --theme-bg-dark-color: theme(colors.zinc.800);
    --theme-btn-color: theme(colors.emerald.600);
    --theme-btn-color-dark: theme(colors.emerald.400);
    --theme-font-color: theme(colors.emerald.50);
    /* --theme-border-color: theme(colors.neutral.100); */
    --theme-border-color: 245, 245, 245;

    @media (prefers-color-scheme: light) {
      --theme-bg-light-color: theme(colors.zinc.200);
      --theme-bg-color: theme(colors.zinc.100);
      --theme-bg-dark-color: theme(colors.zinc.400);
      --theme-btn-color: theme(colors.emerald.500);
      --theme-btn-color-dark: theme(colors.emerald.700);
      --theme-font-color: theme(colors.gray.800);
      /* --theme-border-color: theme(colors.neutral.800); */
      --theme-border-color: 38, 38, 38;
    }
  }

  :global(.theme-zinc-emerald.dark) {
    --theme-bg-light-color: theme(colors.zinc.600);
    --theme-bg-color: theme(colors.zinc.700);
    --theme-bg-dark-color: theme(colors.zinc.800);
    --theme-btn-color: theme(colors.emerald.600);
    --theme-btn-color-dark: theme(colors.emerald.400);
    --theme-font-color: theme(colors.emerald.50);
    /* --theme-border-color: theme(colors.neutral.100); */
    --theme-border-color: 245, 245, 245;
  }

  :global(.theme-zinc-emerald.light) {
    --theme-bg-light-color: theme(colors.zinc.200);
    --theme-bg-color: theme(colors.zinc.100);
    --theme-bg-dark-color: theme(colors.zinc.400);
    --theme-btn-color: theme(colors.emerald.500);
    --theme-btn-color-dark: theme(colors.emerald.700);
    --theme-font-color: theme(colors.gray.800);
    /* --theme-border-color: theme(colors.neutral.800); */
    --theme-border-color: 38, 38, 38;
  }

  /**
  *****************************
  ** ZINC PURPLE
  *****************************
  */
  :global(.theme-zinc-purple) {
    --theme-bg-light-color: theme(colors.zinc.600);
    --theme-bg-color: theme(colors.zinc.700);
    --theme-bg-dark-color: theme(colors.zinc.800);
    --theme-btn-color: theme(colors.purple.600);
    --theme-btn-color-dark: theme(colors.purple.400);
    --theme-font-color: theme(colors.purple.50);
    /* --theme-border-color: theme(colors.neutral.100); */
    --theme-border-color: 245, 245, 245;

    @media (prefers-color-scheme: light) {
      --theme-bg-light-color: theme(colors.zinc.200);
      --theme-bg-color: theme(colors.zinc.100);
      --theme-bg-dark-color: theme(colors.zinc.400);
      --theme-btn-color: theme(colors.purple.500);
      --theme-btn-color-dark: theme(colors.purple.700);
      --theme-font-color: theme(colors.neutral.800);
      /* --theme-border-color: theme(colors.neutral.800); */
      --theme-border-color: 38, 38, 38;
    }
  }

  :global(.theme-zinc-purple.dark) {
    --theme-bg-light-color: theme(colors.zinc.600);
    --theme-bg-color: theme(colors.zinc.700);
    --theme-bg-dark-color: theme(colors.zinc.800);
    --theme-btn-color: theme(colors.purple.600);
    --theme-btn-color-dark: theme(colors.purple.400);
    --theme-font-color: theme(colors.purple.50);
    /* --theme-border-color: theme(colors.neutral.100); */
    --theme-border-color: 245, 245, 245;
  }

  :global(.theme-zinc-purple.light) {
    --theme-bg-light-color: theme(colors.zinc.200);
    --theme-bg-color: theme(colors.zinc.100);
    --theme-bg-dark-color: theme(colors.zinc.400);
    --theme-btn-color: theme(colors.purple.500);
    --theme-btn-color-dark: theme(colors.purple.700);
    --theme-font-color: theme(colors.neutral.800);
    /* --theme-border-color: theme(colors.neutral.800); */
    --theme-border-color: 38, 38, 38;
  }
</style>

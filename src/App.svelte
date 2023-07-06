<script lang="ts">
  import Router from "svelte-spa-router";
  import { routes } from "./routes";
  import active from "svelte-spa-router/active";
  import { config } from "./config";
  import Footer from "./components/Footer.svelte";
  import { fade } from "svelte/transition";
  import Updater from "./components/Updater.svelte";
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import UiContainer from "./components/ui/UIContainer.svelte";
  import Header from "./components/Header.svelte";
  import UiWaitingDots from "./components/ui/UIWaitingDots.svelte";
  import Home from "./pages/Home.svelte";
  import BrowserNotifications from "./components/BrowserNotifications.svelte";

  const { offlineReady } = useRegisterSW({
    onOfflineReady() {
      console.log("offline ready, reload to fetch ffmpeg files");
      location.reload();
    },
  });
</script>

<svelte:head>
  <title>{config.title} | worksoffline.io</title>
  <meta name="description" content="" />
  <meta name="keywords" content="" />
  <!-- add open graph -->
  <meta property="og:title" content={`${config.title} | worksoffline.io`} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={config.url} />
  <!-- <meta property="og:image" content="og-image.png" /> -->
  <meta property="og:description" content="" />
  <meta property="og:site_name" content={config.title} />
</svelte:head>

<div class="min-h-screen w-full p-1 theme-{config.colorScheme}">
  {#if !offlineReady}
    <UiContainer isOpen={false}>
      <Header isOpen={false} title={config.title} />
      <p class="text-center">
        Loading<UiWaitingDots show={true} />
      </p>
    </UiContainer>
  {:else}
    <!-- only hide to keep alive on page change  -->
    <div use:active={{ path: "/", inactiveClassName: "hidden" }}>
      <Home />
    </div>
    <Router {routes} restoreScrollState={true} />
    <Updater />
    <BrowserNotifications />
  {/if}
</div>
<Footer />

<style>
  div {
    background-color: var(--theme-bg-color);
    color: var(--theme-font-color);
  }

  :global(.theme-neutral) {
    --theme-bg-light-color: theme(colors.neutral.700);
    --theme-bg-color: theme(colors.neutral.800);
    --theme-bg-dark-color: theme(colors.neutral.900);
    --theme-btn-color: theme(colors.neutral.600);
    --theme-font-color: theme(colors.neutral.200);
  }

  :global(.theme-zinc-indigo) {
    --theme-bg-light-color: theme(colors.zinc.700);
    --theme-bg-color: theme(colors.zinc.800);
    --theme-bg-dark-color: theme(colors.zinc.900);
    --theme-btn-color: theme(colors.indigo.600);
    --theme-font-color: theme(colors.indigo.50);
  }

  :global(.theme-zinc-emerald) {
    --theme-bg-light-color: theme(colors.zinc.600);
    --theme-bg-color: theme(colors.zinc.700);
    --theme-bg-dark-color: theme(colors.zinc.800);
    --theme-btn-color: theme(colors.emerald.600);
    --theme-font-color: theme(colors.emerald.50);
  }

  :global(.theme-zinc-cyan) {
    --theme-bg-light-color: theme(colors.zinc.600);
    --theme-bg-color: theme(colors.zinc.700);
    --theme-bg-dark-color: theme(colors.zinc.800);
    --theme-btn-color: theme(colors.cyan.700);
    --theme-font-color: theme(colors.cyan.50);
  }

  :global(.theme-zinc-purple) {
    --theme-bg-light-color: theme(colors.zinc.600);
    --theme-bg-color: theme(colors.zinc.700);
    --theme-bg-dark-color: theme(colors.zinc.800);
    --theme-btn-color: theme(colors.purple.600);
    --theme-font-color: theme(colors.purple.50);
  }
</style>

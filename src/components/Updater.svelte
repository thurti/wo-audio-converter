<script lang="ts" context="module">
  export const isReady = writable(false);

  if (!("serviceWorker" in navigator)) {
    isReady.set(true);
  }
</script>

<script lang="ts">
  import { config } from "@/config";
  import { onDestroy, onMount } from "svelte";
  import UiButton from "./ui/UIButton.svelte";
  import { fade } from "svelte/transition";
  import { isConverting } from "@/store";
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import { writable } from "svelte/store";

  let timer: number;
  let registration: ServiceWorkerRegistration | undefined;

  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onOfflineReady() {
      location.reload();
    },

    onRegistered(r) {
      registration = r;

      setTimeout(() => {
        $isReady = true;
      }, 200);

      timer = window.setInterval(async () => {
        await checkForUpdates();
      }, config.updateInterval);
    },

    onRegisterError(error) {
      console.warn("SW registration error", error);
    },
  });

  const checkForUpdates = async () => {
    if (navigator.onLine === false) {
      return;
    }

    try {
      registration?.update();
    } catch (error) {
      console.warn("Could not check for sw update", error);
    }
  };

  const onClickUpdate = async () => {
    $needRefresh = false;
    updateServiceWorker(true);
  };

  onDestroy(() => {
    window.clearTimeout(timer);
  });
</script>

{#if $needRefresh}
  <div class="fixed bottom-16 right-6 z-50" in:fade={{ duration: 200 }}>
    <UiButton
      disabled={$isConverting}
      small={true}
      on:click={() => onClickUpdate()}
      class="!shadow-lg"
    >
      <span class="relative -left-1">&#128640;</span>
      Update Available. Click to Reload.
    </UiButton>
  </div>
{/if}

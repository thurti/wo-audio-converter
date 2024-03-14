<script lang="ts">
  import { isPreloadingFiles } from "@/store";
  import { onMount } from "svelte";
  import UiWaitingDots from "./ui/UIWaitingDots.svelte";
  import { fade } from "svelte/transition";
  import { trackDownloadProgress } from "@/lib/utils/file";
  import { deleteCachesStartWith, isWorkerAllowed } from "@/lib/utils/worker";
  import UiProgressBar from "./ui/UIProgressBar.svelte";
  import throttle from "lodash/throttle";
  import { config } from "@/config";

  export let cacheName = "app-cache" as string;
  export let cacheVersion = "1" as string;
  export let urls = [] as string[];

  const cachedVersion = `${cacheName}-${cacheVersion}`;

  let progressMap = new Map<string, number>();
  let doneMap = new Map<string, boolean>();
  let fileSizeMap = new Map<string, number>();
  let totalFileSize = 0;
  let totalProgress = 0;

  $: if (fileSizeMap.size > 0) {
    totalFileSize = [...fileSizeMap.values()].reduce((a, b) => a + b, 0);
  }

  $: if (totalFileSize > 0 && progressMap.size > 0) {
    totalProgress = [...progressMap.values()].reduce((a, b) => a + b, 0);
  }

  const checkIfAllDone = throttle(() => {
    if (doneMap.size === urls.length) {
      if ([...doneMap.values()].every((value) => value === true)) {
        $isPreloadingFiles = false;
        fileSizeMap.clear();
        progressMap.clear();
        doneMap.clear();
      } else {
        $isPreloadingFiles = true;
      }
    }
  }, 500);

  function onProgress(loadedBytes: number, fileSize: number, url: string) {
    if (fileSize <= 0) return;

    if (!fileSizeMap.has(url)) {
      fileSizeMap = fileSizeMap.set(url, fileSize);
    }

    progressMap = progressMap.set(url, loadedBytes);

    //use extra check to make sure we don't get stuck at 99%
    doneMap = doneMap.set(url, loadedBytes >= fileSize);
  }

  function onDone(url: string) {
    doneMap = doneMap.set(url, true);
    checkIfAllDone();
  }

  const preloadFiles = async () => {
    try {
      $isPreloadingFiles = true;

      if (!(await caches.has(cachedVersion))) {
        // new version so delete old ones first
        await deleteCachesStartWith(cacheName);
      }

      urls.forEach(async (url) => {
        let response = await fetch(url);
        trackDownloadProgress(response, onProgress, onDone);
      });
    } catch (error) {
      console.warn("could not preload wasm", error);
      $isPreloadingFiles = false;
    }
  };

  onMount(async () => {
    if (isWorkerAllowed() && !(await caches.has(cachedVersion))) {
      preloadFiles();
    }
  });
</script>

<div
  out:fade={{ duration: 200 }}
  class={`fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center theme-${config.colorScheme} text-current`}
>
  <div class="-translate-y-2/3">
    <slot />
    {#if totalFileSize > 0}
      <UiProgressBar
        max={totalFileSize}
        value={totalProgress}
        showSparkle={false}
      />
    {:else}
      <p class="mb-4 text-center">
        Loading<UiWaitingDots show={true} /><br />
      </p>
    {/if}
    <p class="mt-4 text-center text-sm font-light text-opacity-70">
      (May take some time on first start up.)
    </p>
  </div>
</div>

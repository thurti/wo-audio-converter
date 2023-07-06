<script lang="ts">
  import { isPreloadingFFmpeg } from "@/store";
  import { onMount } from "svelte";
  import UiWaitingDots from "./ui/UIWaitingDots.svelte";
  import { fade } from "svelte/transition";
  import { deleteCachesStartWith, isWorkerAllowed } from "@/lib/utils";
  import UiProgressBar from "./ui/UIProgressBar.svelte";
  import throttle from "lodash/throttle";

  const cacheName = `wo-ffmpeg-${import.meta.env.VITE_FFMPEG_VERSION}`;

  let progressMap = new Map<string, number>();
  let doneMap = new Map<string, boolean>();
  let fileSizeMap = new Map<string, number>();
  let totalFileSize = 0;
  let totalProgress = 0;

  $: if (fileSizeMap.size > 0) {
    totalFileSize = [...fileSizeMap.values()].reduce((a, b) => a + b, 0);
  }

  $: if (totalFileSize > 0 && progressMap.size > 0) {
    let current = 0;

    progressMap.forEach((value, key) => {
      current += value;
    });

    totalProgress = current;
  }

  const checkIfAllDone = throttle(() => {
    if (doneMap.size > 0) {
      if ([...doneMap.values()].every((value) => value === true)) {
        $isPreloadingFFmpeg = false;
      } else {
        $isPreloadingFFmpeg = true;
      }
    }
  }, 1000);

  //channel name is hard coded in lib/workbox-track-file-progress.ts
  const broadcast = new BroadcastChannel("cache-download-progress");
  broadcast.onmessage = (event) => {
    if (event.data && event.data.type === "DOWNLOAD_PROGRESS") {
      const { url, progress, fileSize } = event.data;

      if (fileSize > 0) {
        if (!fileSizeMap.has(url)) {
          fileSizeMap = fileSizeMap.set(url, fileSize);
        }

        progressMap = progressMap.set(url, progress * fileSize);
      }

      //use extra check to make sure we don't get stuck at 99%
      //the service worker sends a progress of 1 when "cacheDidUpdate"
      doneMap = doneMap.set(url, progress >= 1);
      checkIfAllDone();
    }
  };

  const preloadWasm = async () => {
    console.log("start preloading ffmpeg files");

    try {
      if (!(await caches.has(cacheName))) {
        // new version so delete old ones first
        await deleteCachesStartWith("wo-ffmpeg-");

        fetch(import.meta.env.VITE_FFMPEG_CORE_PATH);
        fetch(import.meta.env.VITE_FFMPEG_WORKER_PATH);
        fetch(import.meta.env.VITE_FFMPEG_WASM_PATH);
      } else {
        console.log("ffmpeg files already cached");
        $isPreloadingFFmpeg = false;
      }
    } catch (error) {
      console.warn("could not preload wasm", error);
    }
  };

  onMount(() => {
    if (isWorkerAllowed()) {
      preloadWasm();
    }
  });
</script>

{#if $isPreloadingFFmpeg}
  <div transition:fade={{ duration: 200 }}>
    <p class="mb-4 text-center">
      Loading<UiWaitingDots show={true} /><br />
    </p>
    {#if totalFileSize > 0}
      <UiProgressBar
        max={totalFileSize}
        value={totalProgress}
        showSparkle={false}
      >
        <slot slot="bottom">
          <p
            class="mt-2 text-center text-sm font-light text-neutral-200 text-opacity-70"
          >
            (May take some time on first start up.)
          </p>
        </slot>
      </UiProgressBar>
    {/if}
  </div>
{/if}

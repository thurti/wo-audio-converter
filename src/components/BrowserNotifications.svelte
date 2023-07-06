<script lang="ts">
  import { config } from "@/config";
  import {
    badgeOnConversionReady,
    filesReadyForDownload,
    isDownloadReady,
    notifyOnConversionReady,
  } from "@/store";
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";

  const isBadgeSupported = "setAppBadge" in navigator;
  const isNotificationSupported = "Notification" in window;

  //send notification if all files are ready for download
  $: if ($isDownloadReady) {
    if (isNotificationSupported && get(notifyOnConversionReady)) {
      new Notification("Conversion completed", {
        body: "Your files are ready for download.",
        icon: config.notificationIcon,
      });
    }
  }

  //update app badge if file is ready for download
  $: if ($filesReadyForDownload) {
    if (isBadgeSupported && get(badgeOnConversionReady)) {
      navigator.setAppBadge($filesReadyForDownload.size);
    }
  }

  $: if ($badgeOnConversionReady === false) {
    clearBadge();
  }

  const clearBadge = () => {
    if (!isBadgeSupported || !get(badgeOnConversionReady)) return;

    $filesReadyForDownload = new Set();
    navigator.clearAppBadge();
  };

  onMount(() => {
    document.body.addEventListener("click", clearBadge);
    document.body.addEventListener("mouseenter", clearBadge);
    document.body.addEventListener("keydown", clearBadge);
  });

  onDestroy(() => {
    document.body.removeEventListener("click", clearBadge);
    document.body.removeEventListener("mouseenter", clearBadge);
    document.body.removeEventListener("keydown", clearBadge);
  });
</script>

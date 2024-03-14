<script lang="ts" context="module">
  import { writable } from "svelte/store";

  const showShareModal = writable(false);

  export function openShareModal() {
    showShareModal.set(true);
  }
</script>

<script lang="ts">
  import UiModal from "./ui/UIModal.svelte";
  import { getShareSettingsUrl } from "@/lib/utils/url";
  import { selectedFormat, selectedSettings } from "@/store";
  import UiButton from "./ui/UIButton.svelte";

  $: shareLink = getShareSettingsUrl($selectedFormat, $selectedSettings);
  $: isCopiedToClipboard = !$showShareModal;
  $: isNotAllowingClipboard = !$showShareModal;

  function onCopy() {
    try {
      navigator.clipboard.writeText(shareLink);
      isCopiedToClipboard = true;
    } catch (error) {
      console.log(error);
      isNotAllowingClipboard = true;
    }
  }
</script>

<UiModal id="share-modal" bind:open={$showShareModal}>
  <h3 class="mb-6 mt-2 text-current">Share Settings</h3>
  <p>
    This link contains your current settings and the selected format. You can
    share it with others to let them use the same settings.
  </p>
  <pre>{shareLink}</pre>

  {#if isCopiedToClipboard}
    <p class="text-green-600">Link copied to clipboard</p>
  {/if}

  {#if isNotAllowingClipboard}
    <p class="text-yellow-600">
      Your browser does not allow copying to clipboard. You can still copy the
      link manually.
    </p>
  {/if}

  <UiButton slot="action" on:click={onCopy}>Copy</UiButton>
</UiModal>

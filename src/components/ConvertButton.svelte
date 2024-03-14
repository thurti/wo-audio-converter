<script lang="ts">
  import { logger, isDownloadReady, isConverting } from "@/store";
  import { cancelAll, convertAll } from "./FileConverter.svelte";
  import UiButton from "./ui/UIButton.svelte";

  export let disabled: boolean = false;

  $isConverting = false;
  let isCanceling = false;

  const convert = async () => {
    $logger = "";
    $isDownloadReady = false;
    disabled = true;
    $isConverting = true;

    try {
      await convertAll();
    } catch (e) {
      console.warn(e);
    } finally {
      $isDownloadReady = !isCanceling;
      $isConverting = false;
      disabled = false;
    }
  };

  const cancel = async () => {
    $isDownloadReady = false;

    try {
      isCanceling = true;
      await cancelAll();
    } catch (e) {
      console.warn(e);
    } finally {
      isCanceling = false;
      $isConverting = false;
      disabled = false;
    }
  };
</script>

{#if !$isConverting && !isCanceling}
  <UiButton {disabled} large on:click={() => convert()} highlight={true}
    >Convert All</UiButton
  >
{:else}
  <UiButton
    on:click={() => cancel()}
    disabled={isCanceling}
    isWaiting={isCanceling}
    large
  >
    Cancel
  </UiButton>
{/if}

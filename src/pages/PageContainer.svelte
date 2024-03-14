<script lang="ts">
  import Header from "@/components/Header.svelte";
  import UiContainer from "@/components/ui/UIContainer.svelte";
  import UiFloatingButton from "@/components/ui/UIFloatingButton.svelte";
  import UiFloatingButtonsContainer from "@/components/ui/UIFloatingButtonsContainer.svelte";
  import UiHeading from "@/components/ui/UIHeading.svelte";
  import { config } from "@/config";
  import { onDestroy, onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import xmarkSvg from "@/assets/xmark.svg?raw";

  export let title: string;
  export let showHeader = false;
  export let showTitle = true;

  const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      push("#/");
    }
  };

  onMount(() => {
    document.addEventListener("keydown", onEscape);
  });

  onDestroy(() => {
    document.title = `${config.title} | worksoffline.app`;
    document.removeEventListener("keydown", onEscape);
  });
</script>

<svelte:head>
  <title>{title} | {config.title} | worksoffline.app</title>
</svelte:head>

<UiContainer center={false}>
  <div class="mx-auto">
    {#if showHeader}
      <Header title={config.title} />
    {/if}
  </div>
  {#if showTitle}
    <UiHeading level={2}>{title}</UiHeading>
  {/if}
  <slot />
</UiContainer>
<UiFloatingButtonsContainer>
  <UiFloatingButton href="#/" title="Back to Home"
    >{@html xmarkSvg}</UiFloatingButton
  >
</UiFloatingButtonsContainer>

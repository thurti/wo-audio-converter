<script lang="ts">
  import { link } from "svelte-spa-router";
  import UiHeading from "./ui/UIHeading.svelte";
  import { isWorkerAllowed } from "@/lib/utils/worker";

  export let title: string;
  let className = "";
  export { className as class };

  const isWorkingOffline = isWorkerAllowed();
</script>

<header class={className}>
  <hgroup>
    <UiHeading class="whitespace-pre">{title}</UiHeading>
    <a class="unstyled" href="/">
      <UiHeading
        level={2}
        class="!font-extralight text-black dark:text-white text-opacity-50 dark:text-opacity-50"
      >
        {#if isWorkingOffline}
          WorksOffline.app
        {:else}
          Works<strike>Offline</strike>.app *

          <span
            class="absolute ml-1 mt-0.5 align-text-top text-base normal-case"
          >
            Please check FAQs
          </span>
        {/if}
      </UiHeading>
    </a>
  </hgroup>
</header>
{#if !isWorkingOffline}
  <p class="relative z-10 py-6 text-center">
    *Sorry, your browser doesn't seem to support offline capability.<br />You
    can still use the converter. Please check the
    <a href="/faq" title="FAQ" use:link>FAQs</a>.
  </p>
{/if}

<style lang="scss">
  header {
    transform: scale(0.5);
    margin-bottom: -1.5rem;

    @screen md {
      transform: scale(0.6);
      margin-bottom: -2.75rem;
    }
  }
</style>

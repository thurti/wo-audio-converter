<script lang="ts">
  import { link } from "svelte-spa-router";
  import UiHeading from "./ui/UIHeading.svelte";
  import { isWorkerAllowed } from "@/lib/utils";

  export let title: string;
  export let isOpen = true;

  const isWorkingOffline = isWorkerAllowed();
</script>

<header class:isOpen>
  <hgroup>
    <UiHeading class="whitespace-pre">{title}</UiHeading>
    <a class="unstyled" href="/">
      <UiHeading
        level={2}
        class="mt-3 !font-extralight text-neutral-100 text-opacity-70"
      >
        {#if isWorkingOffline}
          WorksOffline.io
        {:else}
          Works<strike>Offline</strike>.io *

          {#if isOpen}
            <span
              class="absolute ml-1 mt-0.5 align-text-top text-base normal-case"
            >
              Please check FAQs
            </span>
          {/if}
        {/if}
      </UiHeading>
    </a>
  </hgroup>
</header>
{#if !isWorkingOffline && !isOpen}
  <p class="relative z-10 py-6 text-center">
    *Sorry, your browser doesn't seem to support offline capability.<br />You
    can still use the converter. Please check the
    <a href="/faq" title="FAQ" use:link>FAQs</a>.
  </p>
{/if}

<style lang="scss">
  header {
    height: 72px;
    transform: scale(0.5);

    @screen md {
      height: auto;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    header {
      transition: transform 0.3s ease-in-out, margin 0.3s ease-in-out;
    }
  }

  .isOpen {
    @screen md {
      transform: scale(0.75);
      margin-bottom: -2rem; /* -mb-8 */
      margin-top: -1.5rem; /* -mt-6 */
    }
  }
</style>

<script lang="ts">
  import { fade } from "svelte/transition";

  export let center: boolean = true;
  export let isOpen = true;
</script>

<main
  class="container mx-auto h-full p-1 pb-16 pt-2 md:pt-8"
  class:isOpen
  on:transitionend
>
  <div
    class={`flow inner relative z-0 mx-auto  max-w-prose`}
    class:!items-start={!center}
    in:fade={{ duration: 300 }}
  >
    <slot />
  </div>
</main>

<style lang="scss">
  main {
    @screen md {
      padding-top: 13dvh;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    .inner {
      transition: transform 0.3s ease-in-out;
    }
  }

  :global(.inner > div) {
    margin-left: auto;
    margin-right: auto;
  }

  .isOpen .inner {
    @screen md {
      transform: translateY(-8dvh);
    }
  }
</style>

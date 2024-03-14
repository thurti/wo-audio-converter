<script lang="ts">
  import { clickOutside } from "@/actions/clickOutside";
  import UiFloatingButton from "./UIFloatingButton.svelte";
  import moreSvg from "@/assets/more.svg?raw";

  export let hasMenu = false;

  let isOpen = false;

  const toggleMenu = () => {
    isOpen = !isOpen;
  };
</script>

<nav
  class="fixed right-3 top-3 z-10 md:right-6 md:top-6"
  class:isOpen
  class:hasMenu
  use:clickOutside={() => (isOpen = false)}
>
  {#if hasMenu}
    <UiFloatingButton
      title="Menu"
      class="btn-menu relative z-50 mb-3 sm:hidden"
      on:click={() => toggleMenu()}>{@html moreSvg}</UiFloatingButton
    >
  {/if}
  <div class="btn-container space-y-3">
    <slot />
  </div>
</nav>

<style lang="scss">
  .hasMenu .btn-container :global(> *) {
    @screen max-sm {
      @apply absolute;
      @apply opacity-0;
      @apply transition-all;
      @apply -translate-y-full;
    }
  }

  .hasMenu.isOpen .btn-container :global(> :nth-child(1)) {
    @screen max-sm {
      @apply translate-y-0;
      @apply opacity-100;
    }
  }

  .hasMenu.isOpen .btn-container :global(> :nth-child(2)) {
    @screen max-sm {
      @apply translate-y-full;
      @apply opacity-100;
    }
  }
</style>

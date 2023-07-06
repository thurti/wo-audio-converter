<script context="module" lang="ts">
  export type IUIButton = {
    as?: "button" | "label" | "a";
    title?: string;
    labelFor?: string;
    outline?: boolean;
    small?: boolean;
    disabled?: boolean;
    isWaiting?: boolean;
    highlight?: boolean;
    class?: string;
    target?: "_self" | "_blank" | "_parent";
  };
</script>

<script lang="ts">
  import UiWaitingDots from "./UIWaitingDots.svelte";

  export let as: "button" | "label" | "a" = "button";
  export let title: string = "";
  export let labelFor: string = null;
  export let outline: boolean = false;
  export let small: boolean = false;
  export let disabled: boolean = false;
  export let isWaiting: boolean = false;
  export let highlight: boolean = false;
  export let href: string = null;
  export let target: "_self" | "_blank" | "_parent" = "_self";

  let className: string = "";
  export { className as class };
</script>

<svelte:element
  this={as}
  on:click
  class={`button unstyled inline-block h-max select-none rounded-full border bg-opacity-30 px-8 py-2 text-center shadow-sm transition-colors focus-within:ring hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-opacity-20 disabled:text-gray-300 ${className}`}
  style="background-color: var(--theme-btn-color);border-color: var(--theme-btn-color);"
  {href}
  {target}
  {title}
  {disabled}
  for={labelFor}
  class:outlined={outline}
  class:small
  class:highlight
  class:!cursor-wait={isWaiting}
  class:disabled
  class:isLink={href}
>
  <slot>{title}</slot><UiWaitingDots show={isWaiting} />
</svelte:element>

<style>
  .button:not(.disabled):active {
    transform: scale(0.95);
    @apply outline-none ring-0;
  }

  .button:not(.disabled):hover {
    filter: contrast(1.2);
  }

  .small {
    @apply px-4;
    @apply py-1;
    @apply text-sm;
  }

  .outlined {
    transition: background-color 0.2s;
    background-color: transparent !important;
    border-color: rgba(200, 200, 200, 0.7) !important;
  }
  .outlined:not(.disabled):hover {
    background-color: var(--theme-btn-color) !important;
  }

  .highlight {
    border-color: transparent !important;
    @apply bg-opacity-100 bg-gradient-to-r from-purple-600 to-pink-600 shadow-md;
  }

  .highlight:not(.disabled):hover {
    filter: contrast(1.2);
  }

  .disabled {
    filter: saturate(0.75) !important;
    @apply opacity-70;
  }

  .disabled:hover {
    cursor: not-allowed;
  }

  .isLink:hover {
    text-decoration: none !important;
  }
</style>

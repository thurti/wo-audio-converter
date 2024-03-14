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
  export let labelFor: string = "";
  export let type: "button" | "submit" | "reset" = "button";
  export let outline: boolean = false;
  export let small: boolean = false;
  export let large: boolean = false;
  export let disabled: boolean = false;
  export let isWaiting: boolean = false;
  export let highlight: boolean = false;
  export let href: string | null = null;
  export let target: "_self" | "_blank" | "_parent" = "_self";

  let className: string = "";
  export { className as class };

  const roles = {
    a: "link",
    button: "button",
    label: "label",
  };
</script>

<svelte:element
  this={as}
  on:click
  role={roles[as]}
  class={`button unstyled inline-block h-max select-none whitespace-nowrap rounded-full border bg-opacity-30 px-6 pb-0.5 pt-1 text-center shadow-sm transition-colors focus-within:ring hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-opacity-20 disabled:text-gray-300 ${className} text-white`}
  style="background-color: var(--theme-btn-color);border-color: var(--theme-btn-color-dark);"
  {href}
  target={as === "a" ? target : null}
  title={title || null}
  {disabled}
  {type}
  for={as === "label" ? labelFor : null}
  class:outlined={outline}
  class:small
  class:large
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
    @apply pt-1;
    @apply pb-0.5;
    @apply text-sm;
  }

  .large {
    @apply px-8;
    @apply pt-2;
    @apply pb-1.5;
  }

  .outlined {
    color: var(--theme-font-color);
    transition:
      background-color 0.2s,
      color 0.2s;
    background-color: var(--theme-bg-color) !important;
    border-color: rgba(var(--theme-border-color), 0.5) !important;
  }
  .outlined:not(.disabled):hover {
    border-color: rgba(var(--theme-border-color), 0.5) !important;
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

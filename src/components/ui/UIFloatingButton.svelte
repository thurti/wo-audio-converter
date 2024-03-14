<script lang="ts">
  import UiButton from "./UIButton.svelte";

  export let title: string;
  export let href: string | null = null;
  export let iconClass: string = "";

  let className: string = "";
  export { className as class };
</script>

<UiButton
  small={true}
  outline={true}
  as="a"
  {href}
  {title}
  class={`flex !h-11 !w-11 items-center justify-center !p-0 !text-2xl ${className}`}
  on:click
>
  <span class={`leading-[0] ${iconClass}`}>
    <slot />
  </span>
</UiButton>

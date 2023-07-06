<script lang="ts">
  import UiHeading from "./UIHeading.svelte";

  export let id: string = "";

  let className: string = "";
  export { className as class };
</script>

<section {id} class={`space-y-4 ${className}`}>
  {#if $$slots["heading"]}
    <UiHeading level={3} class="!text-left">
      <slot name="heading" />
    </UiHeading>
  {/if}
  <slot />
</section>

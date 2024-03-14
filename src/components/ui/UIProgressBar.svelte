<script lang="ts">
  import { generateRandomId } from "@/lib/utils/utils";
  import Sparkler from "./Sparkler.svelte";

  export let value: number = 0;
  export let max: number = 1;
  export let label: string = "";
  export let showSparkle: boolean = true;

  $: percent = Math.round((value / max) * 100);
  $: title = percent + "% Complete";
  $: posX = percent;

  const id = generateRandomId("progress");
</script>

<slot name="top" />
<div class="relative flex w-full flex-col items-center gap-2">
  {#if label}
    <label for={id}>
      {label}
    </label>
  {/if}
  <div class="relative w-full">
    <progress
      {id}
      {max}
      {value}
      {title}
      class="m-0 block w-full rounded-full border-0 p-0 text-2xl"
    />
    {#if showSparkle}
      <Sparkler hidden={value <= 0 || value >= max} {posX} />
    {/if}
  </div>
  <p
    class="absolute bottom-0 overflow-hidden px-4 text-center text-sm text-white"
  >
    {percent} %
  </p>
</div>
<slot name="bottom" />

<style>
  progress {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  progress::-webkit-progress-bar,
  progress {
    background: var(--theme-bg-dark-color);
    @apply rounded-full;
    @apply overflow-hidden;
  }

  progress::-webkit-progress-value {
    @apply rounded-full;
    background: var(--theme-btn-color);
  }

  progress::-moz-progress-bar {
    @apply rounded-full;
    background: var(--theme-btn-color);
  }

  progress::-ms-fill {
    @apply rounded-full;
    background: var(--theme-btn-color);
  }
</style>

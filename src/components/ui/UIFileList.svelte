<script lang="ts">
  import { slide } from "svelte/transition";

  export let files: File[] = [];

  const duration = 200;
</script>

<div
  class="file-list theme-border-color-50 max-h-[30vh] w-full overflow-auto rounded-lg border"
>
  <ul>
    {#if files.length <= 0}
      <li
        transition:slide|local={{ duration }}
        class="px-4 py-2 text-center text-neutral-400 font-thin text-sm"
      >
        Please add some files.
      </li>
    {/if}
    {#each Array.from(files) as file (file.name)}
      <li
        transition:slide|local={{ duration }}
        class="theme-border-color-50 flex items-center justify-between gap-2 overflow-y-hidden border-b bg-neutral-300 bg-opacity-5 px-2 pt-2 pb-1 last:border-0 odd:bg-opacity-10 hover:bg-opacity-10 md:gap-4 md:px-4 md:py-2"
      >
        <slot {file} />
      </li>
    {/each}
  </ul>
</div>

<script lang="ts">
  import { slide } from "svelte/transition";

  export let files: File[] = [];

  const duration = 200;
</script>

<div
  class="max-h-[20vh] w-full overflow-auto rounded-lg border border-neutral-100 border-opacity-50"
>
  <ul>
    {#if files.length <= 0}
      <li
        transition:slide|local={{ duration }}
        class="border-b border-neutral-100 border-opacity-50 px-4 py-2 text-center"
      >
        No files selected
      </li>
    {/if}
    {#each Array.from(files) as file (file.name)}
      <li
        transition:slide|local={{ duration }}
        class="flex items-center justify-between gap-2 overflow-y-hidden border-b border-neutral-100 border-opacity-50 bg-white bg-opacity-5 p-2 last:border-0 odd:bg-opacity-10 hover:bg-opacity-10 md:gap-4 md:px-4 md:py-2"
      >
        <slot {file} />
      </li>
    {/each}
  </ul>
</div>

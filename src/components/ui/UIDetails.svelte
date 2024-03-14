<script lang="ts">
  import { slide } from "svelte/transition";

  export let open: boolean = false;
  export let duration: number = 200;
</script>

<details class="w-full hover:cursor-pointer" bind:open>
  <summary class="text-center"><slot name="summary" /></summary>
  {#if open}
    <div class="mt-4" in:slide={{ duration }}>
      <slot name="details" />
    </div>
  {/if}
</details>

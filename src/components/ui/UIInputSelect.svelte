<script lang="ts">
  import type { UIInputItem } from "@/types/UIInputItem";

  export let id = "";
  export let label = "";
  export let options = [] as UIInputItem[];
  export let value = null as UIInputItem | string | null;
</script>

<div class="form-group flex flex-col gap-1">
  {#if label}
    <label for={id} class="mr-2">{label} </label>
  {/if}
  <select
    {id}
    class="border rounded-full py-1 hover:cursor-pointer dark:bg-neutral-200 text-black theme-border-color-50 max-w-max pb-0.5 pt-1 pl-6"
    bind:value
    on:change
  >
    <slot>
      {#each options as option}
        <option id={option.id} value={option.value} disabled={option.disabled}
          >{option.label}</option
        >
      {/each}
    </slot>
  </select>
</div>

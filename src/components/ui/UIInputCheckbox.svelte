<script lang="ts">
  export let label: string;
  export let checked: boolean = false;
  export let disabled: boolean = false;
</script>

<label class="flex items-center gap-2 hover:cursor-pointer" class:disabled>
  <input
    on:input
    type="checkbox"
    bind:checked
    {disabled}
    class="relative -top-0.5 h-4 w-4 appearance-none rounded border !border-neutral-50 !bg-neutral-100 !bg-opacity-10 checked:!bg-opacity-20 hover:cursor-pointer hover:!bg-opacity-20 active:bg-neutral-100 disabled:!bg-opacity-10"
  />
  <span class="whitespace-nowrap">{label}</span>
</label>

<style>
  .disabled {
    filter: saturate(0.75) !important;
    @apply opacity-70;
  }

  .disabled:hover {
    cursor: not-allowed;
  }
</style>

<script lang="ts">
  export let label: string = "";
  export let checked: boolean = false;
  export let disabled: boolean = false;
</script>

<label class="flex items-baseline gap-2 hover:cursor-pointer" class:disabled>
  <input
    on:input
    type="checkbox"
    bind:checked
    {disabled}
    class="relative top-0.5 h-4 w-4 appearance-none rounded border !bg-neutral-400 !bg-opacity-10 checked:!bg-opacity-70 hover:cursor-pointer disabled:!bg-opacity-10"
  />
  <slot>{label}</slot>
</label>

<style>
  .disabled {
    filter: saturate(0.75) !important;
    @apply opacity-70;
  }

  .disabled:hover {
    cursor: not-allowed;
  }

  input {
    border-color: rgba(var(--theme-border-color), 1) !important;
  }
</style>

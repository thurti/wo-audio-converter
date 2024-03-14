<script lang="ts">
  export let label = "";
  export let value = "";
  export let disabled = false;
  export let placeholder = "";
  export let required = false;
  export let pattern = ".*";
  export let title = "";
  export let ariaLabel = label;
</script>

<label class="w-full space-y-2">
  {label}
  <input
    on:input
    bind:value
    {title}
    {placeholder}
    {required}
    {disabled}
    {pattern}
    aria-label={ariaLabel}
    type="text"
    class="w-full rounded-lg border theme-border-color-50 bg-white bg-opacity-10 px-4 py-2 placeholder:text-opacity-70 focus:bg-neutral-100 focus:bg-opacity-20 disabled:cursor-not-allowed disabled:opacity-50"
  />
</label>

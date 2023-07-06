<script lang="ts">
  export let label = "";
  export let value = "";
  export let disabled = false;
</script>

<label class="w-full space-y-2">
  {label}
  <input
    on:input
    bind:value
    {disabled}
    type="text"
    class="w-full rounded-lg border border-neutral-50 bg-neutral-100 bg-opacity-10 px-4 py-2 focus:bg-neutral-100 focus:bg-opacity-20 disabled:cursor-not-allowed disabled:opacity-70"
  />
</label>

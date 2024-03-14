<script lang="ts">
  import type { UIInputItem } from "@/types/UIInputItem";
  import UiButton from "./UIButton.svelte";

  export let items: UIInputItem[] = [];
  export let selected: UIInputItem | null = null;
  export let disabled: boolean = false;

  $: isSelected = (item: UIInputItem) => selected?.id === item.id;

  function onSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    selected = items.find((i) => i.value === target.value) ?? null;
  }
</script>

{#each items as item}
  <UiButton
    as="label"
    labelFor={item.id}
    title={item.label}
    outline={!isSelected(item)}
    small={true}
    {disabled}
  >
    {item.label}

    <input
      id={item.id}
      class="absolute opacity-0 hover:cursor-pointer"
      type="radio"
      on:click={onSelect}
      checked={item.id === selected?.id}
      value={item.value}
      {disabled}
    />
  </UiButton>
{/each}

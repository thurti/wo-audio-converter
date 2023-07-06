<script lang="ts">
  import type { UIInputItem } from "@/types/UIInputItem";
  import UiButton from "./UIButton.svelte";

  export let items: UIInputItem[] = [];
  export let selected: UIInputItem = null;
  export let disabled: boolean = false;

  let selectedValue = selected?.value;

  $: if (selectedValue) selected = items.find((i) => i.value === selectedValue);
  $: isSelected = (item: UIInputItem) => selected?.id === item.id;
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
      bind:group={selectedValue}
      value={item.value}
      {disabled}
    />
  </UiButton>
{/each}

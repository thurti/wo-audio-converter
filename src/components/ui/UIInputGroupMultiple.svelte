<script lang="ts">
  import type { UIInputItem } from "@/types/UIInputItem";
  import UiButton from "./UIButton.svelte";

  export let items: UIInputItem[] = [];
  export let selected: Array<UIInputItem> = [];
  export let disabled: boolean = false;

  let selectedValues = selected.map((s) => s.value);

  $: if (selectedValues)
    selected = items.filter((i) => selectedValues.includes(i.value));
  $: isSelected = (item: UIInputItem) =>
    selected?.some((s) => s.id === item.id);
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
      type="checkbox"
      bind:group={selectedValues}
      value={item.value}
      {disabled}
    />
  </UiButton>
{/each}

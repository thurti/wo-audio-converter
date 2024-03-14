<script lang="ts">
  import { isConverting } from "@/store";
  import UiHeading from "./ui/UIHeading.svelte";
  import UiInputGroup from "./ui/UIInputGroup.svelte";
  import type { ConfigSettingOption } from "@/config";
  import { createEventDispatcher } from "svelte";

  export let id: string = "";
  export let label: string = "";
  export let options: ConfigSettingOption[] = [];
  export let selected: ConfigSettingOption | null = null;
  export let level: number = 3;

  let lastSelectedId: string;
  const emits = createEventDispatcher();

  $: if (id && selected && selected.id !== lastSelectedId) {
    lastSelectedId = selected.id;
    emits("update:selected", { id, selected });
  }
</script>

<form aria-labelledby={id}>
  <slot name="heading">
    <UiHeading {id} {level}>{label}</UiHeading>
  </slot>
  <div class="mt-4 flex flex-wrap justify-center gap-x-2 gap-y-3">
    <slot name="before" />
    <UiInputGroup items={options} bind:selected disabled={$isConverting} />
    <slot name="after" />
  </div>
</form>

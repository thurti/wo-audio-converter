<script lang="ts">
  import UiButton from "./ui/UIButton.svelte";
  import { openAddPresetModal } from "./AddPreset.svelte";
  import {
    customPresets,
    getDefaultFormat,
    selectedFormat,
    type SelectedSettings,
  } from "@/store";
  import CurrentCommand from "./CurrentCommand.svelte";
  import type { ConfigFormatOption } from "@/config";
  import { get } from "svelte/store";
  import { tick } from "svelte";

  export let format = {} as ConfigFormatOption;
  export let settings = {} as SelectedSettings;

  async function onDelete() {
    if (await window.confirm("Delete preset?")) {
      const formatId = format.id;

      $customPresets = structuredClone(
        get(customPresets).filter((p) => p.id !== formatId),
      );

      // reset to default format/settings after delete
      await tick();
      $selectedFormat = getDefaultFormat();
    }
  }
</script>

<div
  class="custom-setting theme-border-color-30 m-auto flex max-w-full items-center gap-8 rounded border px-4 py-2"
>
  <CurrentCommand label="" {format} {settings} />
  <div class="flex flex-nowrap gap-2">
    <UiButton
      title="Edit"
      small
      outline
      on:click={() => openAddPresetModal(true)}
    />
    <UiButton title="Delete" small outline on:click={onDelete} />
  </div>
</div>

<style>
  .custom-setting {
    background-color: var(--theme-bg-light-color);
  }
</style>

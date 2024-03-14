<script lang="ts" context="module">
  const showAddPresetModal = writable(false);
  const isEditing = writable(false);

  export function openAddPresetModal(edit = false) {
    showAddPresetModal.set(true);
    isEditing.set(edit);
  }
</script>

<script lang="ts">
  import {
    customPresets,
    selectedFormat,
    selectedSettings,
    type CustomPreset,
  } from "@/store";
  import UiButton from "./ui/UIButton.svelte";
  import UiInputText from "./ui/UIInputText.svelte";
  import UiModal from "./ui/UIModal.svelte";
  import {
    createSettingsFromString,
    getSettingsString,
  } from "@/lib/utils/settings";
  import { config } from "@/config";
  import { get, writable } from "svelte/store";
  import CurrentCommand from "./CurrentCommand.svelte";
  import { tick } from "svelte";

  let id = "";
  let name = "";
  let command = "";
  let fileExtension = "";

  // show current values on open
  $: if ($showAddPresetModal === true) {
    id = get(selectedFormat).id;
    name = get(selectedFormat).label;
    command = getSettingsString(get(selectedSettings));
    fileExtension = get(selectedFormat).ext;
  }

  // pattern dont allow ids already defined in config.format.options
  const patternAppDefaultFormatNames = `^(?!(?:${config.formats.options
    .map((f) => f.label.replace("(", "\\(").replace(")", "\\)"))
    .join("|")})$).*$`;

  // check if values would work
  $: newPreset = {
    id: $isEditing ? id : name,
    label: name,
    value: name,
    ext: fileExtension,
    settings: createSettingsFromString(command.trim(), "presetSetting"),
    isCustomPreset: true,
  } satisfies CustomPreset;

  $: formatAlreadyExists = $customPresets.some((f) => f.id === newPreset.id);

  async function onSavePreset() {
    $customPresets = Array.from(
      new Set([
        ...$customPresets.filter((p) => p.id !== newPreset.id),
        newPreset,
      ]),
    );

    await tick();

    $showAddPresetModal = false;
    $selectedFormat = newPreset;
  }
</script>

<UiModal bind:open={$showAddPresetModal} on:submit={onSavePreset}>
  <h3 class="mb-6 mt-2 text-current">Preset</h3>

  <div class="flex flex-wrap gap-4 text-left">
    <UiInputText
      label="Preset Name"
      placeholder="eg. mp3 low"
      required
      pattern={patternAppDefaultFormatNames}
      title="Preset name cannot be the same as an app default format."
      bind:value={name}
    />
    {#if !$isEditing && formatAlreadyExists}
      <span class="text-yellow-600"
        >A preset with this name already exists and will be overwritten.</span
      >
    {/if}
    <UiInputText
      label="Output File Extension"
      placeholder="eg. mp3"
      required
      bind:value={fileExtension}
    />
    <UiInputText
      label="FFmpeg Parameters"
      placeholder="eg. -vbr 5"
      required
      bind:value={command}
    />
  </div>

  <div class="my-12">
    <CurrentCommand
      label="Preview Command:"
      format={newPreset}
      settings={newPreset.settings}
    />
  </div>

  <div slot="action">
    <UiButton title="Save Preset" type="submit" />
  </div>
</UiModal>

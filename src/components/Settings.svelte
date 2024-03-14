<script lang="ts">
  import {
    type ConfigFormatOption,
    type ConfigFormats,
    type ConfigSettingOption,
    type ConfigSettings,
  } from "@/config";
  import Setting from "./Setting.svelte";
  import UiDetails from "./ui/UIDetails.svelte";
  import UiHeading from "./ui/UIHeading.svelte";
  import {
    isCustomCommand,
    showAdvancedSettings,
    filesReadyForDownload,
    type SelectedSettings,
    isSharedSettings,
  } from "@/store";
  import { settingsIsForFormat } from "@/lib/utils/settings";
  import UiButton from "./ui/UIButton.svelte";
  import { openAddPresetModal } from "./AddPreset.svelte";
  import SettingCustom from "./SettingCustom.svelte";
  import { openShareModal } from "./ShareModal.svelte";
  import linkSvg from "@/assets/link.svg?raw";

  export let formats: ConfigFormats;
  export let settings: ConfigSettings;
  export let defaultSettings: SelectedSettings;
  export let selectedFormat: ConfigFormatOption;
  export let selectedSettings: SelectedSettings;

  $: formatSettings = structuredClone(settings[selectedFormat?.id]);
  $: {
    // set settings from defaults only if a new format is selected or no selectedSettings are present
    // ignore if custom command is used
    // ignore if url shared settings are used
    if (
      (!selectedSettings ||
        !settingsIsForFormat(selectedSettings, selectedFormat?.id)) &&
      !$isCustomCommand &&
      !$isSharedSettings
    ) {
      selectedSettings = defaultSettings;
    }
  }

  const onUpdateSelectedSetting = ({
    id,
    selected,
  }: {
    id: string;
    selected: ConfigSettingOption;
  }) => {
    $filesReadyForDownload = new Set();

    selectedSettings = {
      ...selectedSettings,
      [id]: selected,
    };
  };

  const onUpdateFormat = () => {
    $filesReadyForDownload = new Set();
  };
</script>

<div class="space-y-7">
  <Setting
    id={formats.id}
    label={formats.label}
    options={formats.options}
    bind:selected={selectedFormat}
    on:update:selected={onUpdateFormat}
  >
    <UiHeading
      level={3}
      id="format"
      slot="heading"
      class="mb-6 ml-24 flex items-center justify-center gap-4"
    >
      {formats.label}

      <UiButton
        title="Share Settings"
        small
        outline
        on:click={openShareModal}
        class="flex items-center gap-1 !pl-3 !text-xs !pt-1.5"
      >
        <span class="-mt-1" style="transform:scale(0.65);">{@html linkSvg}</span
        >
        Share
      </UiButton>
    </UiHeading>

    <UiButton
      slot="after"
      class="!pl-2.5"
      title="+ Add"
      small
      outline
      on:click={() => openAddPresetModal()}
    />
  </Setting>

  {#if $isCustomCommand}
    <p class="text-center">
      Custom Command is in use. <br /><span class="text-xs"
        >See Expert Stuff panel for details.</span
      >
    </p>
  {:else if selectedFormat?.isCustomPreset}
    <SettingCustom format={selectedFormat} settings={selectedSettings} />
  {:else if formatSettings}
    <UiDetails open={$showAdvancedSettings}>
      <slot slot="summary">
        <UiHeading level={4} class="inline-block">Advanced Settings</UiHeading>
      </slot>
      <slot slot="details">
        <div class="space-y-6">
          {#each formatSettings as setting (setting)}
            {#if setting.options}
              <Setting
                level={5}
                id={setting.id}
                label={setting.label}
                options={setting.options}
                selected={selectedSettings[setting.id]}
                on:update:selected={(e) => onUpdateSelectedSetting(e.detail)}
              />
            {/if}
          {/each}
        </div>
      </slot>
    </UiDetails>
  {/if}
</div>

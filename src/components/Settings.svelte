<script lang="ts">
  import {
    config,
    type ConfigDefaults,
    type ConfigFormatOption,
    type ConfigFormats,
    type ConfigSettings,
  } from "@/config";
  import Setting from "./Setting.svelte";
  import UiDetails from "./ui/UIDetails.svelte";
  import UiHeading from "./ui/UIHeading.svelte";
  import {
    isCustomCommand,
    showAdvancedSettings,
    type SelectedSettings,
  } from "@/store";
  import { settingsIsForFormat } from "@/lib/utils";

  export let formats: ConfigFormats;
  export let settings: ConfigSettings;
  export let defaults: ConfigDefaults;
  export let selectedFormat: ConfigFormatOption;
  export let selectedSettings: SelectedSettings;

  $: formatSettings = structuredClone(settings[selectedFormat?.id]);
  $: {
    // set settings from defaults only if a new format is selected or no selectedSettings are present
    // ignore if custom command is used
    if (
      (!selectedSettings ||
        !settingsIsForFormat(selectedSettings, selectedFormat?.id)) &&
      !$isCustomCommand
    ) {
      selectedSettings = structuredClone(
        defaults.settings[selectedFormat?.id] ?? {}
      );
    }
  }

  const onUpdateSelectedSetting = ({ id, selected }) => {
    selectedSettings = {
      ...selectedSettings,
      [id]: selected,
    };
  };
</script>

<div class="space-y-7">
  <Setting {...formats} bind:selected={selectedFormat} />

  {#if $isCustomCommand}
    <p class="text-center">Custom Command is use.</p>
  {:else if formatSettings}
    <UiDetails open={$showAdvancedSettings}>
      <slot slot="summary">
        <UiHeading level={4} class="inline-block">Advanced Settings</UiHeading>
      </slot>
      <slot slot="details">
        <div class="space-y-6">
          {#each formatSettings as setting (setting)}
            <Setting
              level={5}
              {...setting}
              selected={selectedSettings[setting.id]}
              on:update:selected={(e) => onUpdateSelectedSetting(e.detail)}
            />
          {/each}
        </div>
      </slot>
    </UiDetails>
  {/if}
</div>

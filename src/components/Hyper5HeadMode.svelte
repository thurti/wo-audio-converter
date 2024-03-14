<script lang="ts">
  import {
    logger,
    selectedFormat,
    selectedSettings,
    isCustomCommand,
    isConverting,
    defaultSettings,
  } from "@/store";
  import UiDetails from "./ui/UIDetails.svelte";
  import UiInputText from "./ui/UIInputText.svelte";
  import UiTextOutput from "./ui/UITextOutput.svelte";
  import UiHeading from "./ui/UIHeading.svelte";
  import {
    createSettingsFromString,
    getSettingsString,
  } from "@/lib/utils/settings";
  import UiInputCheckbox from "./ui/UIInputCheckbox.svelte";
  import { onDestroy } from "svelte";
  import CurrentCommand from "./CurrentCommand.svelte";
  import UiButton from "./ui/UIButton.svelte";
  import { openAddPresetModal } from "./AddPreset.svelte";

  export let open: boolean = false;

  let customCommand = getSettingsString($selectedSettings);

  const unsubscribeSettings = selectedSettings.subscribe((value) => {
    customCommand = getSettingsString(value);
  });

  const setSelectedSettingsToCustom = (value: string) => {
    $selectedSettings = createSettingsFromString(value.trim());
  };

  const onClickIsCustomCommand = (e: Event) => {
    const value = (e.target as HTMLInputElement)?.checked;

    if (value) {
      $isCustomCommand = true;
      setSelectedSettingsToCustom(customCommand);
    } else {
      $isCustomCommand = false;
      $selectedSettings = $defaultSettings;
    }
  };

  const onInputCustomCommand = (e: Event) => {
    const value = (e.target as HTMLInputElement)?.value;
    setSelectedSettingsToCustom(value);
  };

  onDestroy(() => {
    unsubscribeSettings();
  });
</script>

<UiDetails {open}>
  <slot slot="summary">
    <UiHeading level={4} class="inline-block">Expert Stuff</UiHeading>
  </slot>
  <slot slot="details">
    <div
      class="theme-border-color-50 flow rounded-lg border p-4 md:p-8"
      style="background: var(--theme-bg-light-color);"
    >
      <CurrentCommand
        label="Current Command:"
        format={$selectedFormat}
        settings={$selectedSettings}
      />

      <UiInputCheckbox
        disabled={$isConverting}
        checked={$isCustomCommand}
        on:input={onClickIsCustomCommand}
        ><span class="whitespace-nowrap">Enable Custom Command</span
        ></UiInputCheckbox
      >

      <div class="!mt-2 flex flex-wrap items-end gap-4 md:flex-nowrap">
        <UiInputText
          ariaLabel="Custom Command"
          value={customCommand}
          on:input={onInputCustomCommand}
          disabled={!$isCustomCommand}
        />

        <UiButton
          class="!mb-2 !mt-0 !pl-3 !pr-4"
          title="+ Add as Preset"
          on:click={() => openAddPresetModal()}
        />
      </div>
      <UiTextOutput label="FFmpeg Output" value={$logger} rows={10} />
    </div>
  </slot>
</UiDetails>

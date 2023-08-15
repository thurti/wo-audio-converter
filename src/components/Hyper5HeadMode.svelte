<script lang="ts">
  import {
    logger,
    selectedFormat,
    selectedSettings,
    isCustomCommand,
    isConverting,
  } from "@/store";
  import UiDetails from "./ui/UIDetails.svelte";
  import UiInputText from "./ui/UIInputText.svelte";
  import UiTextOutput from "./ui/UITextOutput.svelte";
  import UiHeading from "./ui/UIHeading.svelte";
  import {
    createFFmegCommandArgs,
    createSettingsFromString,
    getSettingsString,
  } from "@/lib/utils";
  import UiInputCheckbox from "./ui/UIInputCheckbox.svelte";
  import { config } from "@/config";
  import { onDestroy } from "svelte";

  export let open: boolean = $isCustomCommand;

  let customCommand = getSettingsString($selectedSettings);

  const unsubscribeSettings = selectedSettings.subscribe((value) => {
    customCommand = getSettingsString(value);
  });

  $: currentCommand = createFFmegCommandArgs(
    new File([], "[filename]"),
    $selectedFormat,
    $selectedSettings
  ).join(" ");

  const setSelectedSettingsToCustom = (value: string) => {
    $selectedSettings = createSettingsFromString(value.trim());
  };

  const onClickIsCustomCommand = (value: boolean) => {
    if (value) {
      $isCustomCommand = true;
      setSelectedSettingsToCustom(customCommand);
    } else {
      $isCustomCommand = false;
      $selectedSettings = structuredClone(
        config.defaults.settings[$selectedFormat.value] ?? {}
      );
    }
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
      class="flow rounded-lg border border-neutral-100 border-opacity-50 bg-neutral-600 bg-opacity-20 p-4 md:p-8"
    >
      <p class="text-sm">
        Current Command:<br /><code>{currentCommand}</code>
      </p>
      <div class="flex flex-wrap items-center gap-4 md:flex-nowrap">
        <UiInputText
          value={customCommand}
          on:input={(e) => setSelectedSettingsToCustom(e.target.value)}
          disabled={!$isCustomCommand}
        />
        <UiInputCheckbox
          label="Custom Command"
          disabled={$isConverting}
          checked={$isCustomCommand}
          on:input={(e) => onClickIsCustomCommand(e.target.checked)}
        />
      </div>
      <UiTextOutput label="FFmpeg Output" value={$logger} rows={10} />
    </div>
  </slot>
</UiDetails>

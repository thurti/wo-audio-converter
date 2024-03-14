<script lang="ts">
  import UiEnableNotifications from "@/components/ui/UIEnableNotifications.svelte";
  import UiInputCheckbox from "@/components/ui/UIInputCheckbox.svelte";
  import UiSection from "@/components/ui/UISection.svelte";
  import {
    badgeOnConversionReady,
    customPresets,
    notifyOnConversionReady,
    preferedColorScheme,
    showAdvancedSettings,
    showReducedUploadUi,
  } from "@/store";
  import PageContainer from "./PageContainer.svelte";
  import UiButton from "@/components/ui/UIButton.svelte";
  import ImportPresetsModal, {
    showImportPresetsModal,
  } from "@/components/ImportPresetsModal.svelte";
  import UiDownloadData from "@/components/ui/UIDownloadData.svelte";
  import UiInputSelect from "@/components/ui/UIInputSelect.svelte";

  const isBadgeSupported = "setAppBadge" in navigator;
  $showImportPresetsModal = false;
</script>

<PageContainer title="Preferences">
  <UiSection>
    <slot slot="heading">General</slot>
    <form class="space-y-4">
      <UiInputCheckbox
        label="Show reduced file upload UI."
        bind:checked={$showReducedUploadUi}
      />
      <UiInputCheckbox
        label="Always show advanced settings."
        bind:checked={$showAdvancedSettings}
      />
      <UiInputSelect
        id="prefersTheme"
        label="Color Scheme"
        bind:value={$preferedColorScheme}
      >
        <option value="auto">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </UiInputSelect>
    </form>
  </UiSection>
  <UiSection>
    <slot slot="heading">Notifications</slot>
    <form class="space-y-4">
      <UiEnableNotifications
        bind:checked={$notifyOnConversionReady}
        label="Notify me when the conversion is completed."
      />
      <div>
        <UiInputCheckbox
          label="Show number of completed files in badge."
          disabled={!isBadgeSupported}
          bind:checked={$badgeOnConversionReady}
        />
        {#if !isBadgeSupported}
          <p class="text-sm italic">
            This feature is not supported by your browser.
          </p>
        {/if}
      </div>
    </form>
  </UiSection>
  <UiSection>
    <slot slot="heading">Export</slot>

    <p class="text-small">Export your custom presets as JSON file.</p>
    <UiDownloadData
      data={JSON.stringify($customPresets)}
      type="application/json"
      filename="audio-converter-presets.json"
      useNative={true}>Save Custom Presets</UiDownloadData
    >
  </UiSection>
  <UiSection>
    <slot slot="heading">Import Presets</slot>

    <p class="text-small">Import presets from JSON file.</p>
    <UiButton
      title="Import Presets from File"
      on:click={() => ($showImportPresetsModal = true)}
    />
  </UiSection>
</PageContainer>
<ImportPresetsModal />

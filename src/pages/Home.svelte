<script lang="ts">
  import UiContainer from "@/components/ui/UIContainer.svelte";
  import UiFileDrop from "@/components/ui/UIFileDrop.svelte";
  import UiFileList from "@/components/ui/UIFileList.svelte";
  import Settings from "@/components/Settings.svelte";
  import {
    defaultSettings,
    filesReadyForDownload,
    isDownloadReady,
    isOpen,
    isPreloadingFiles,
    logger,
    selectedFiles,
    selectedFormat,
    selectedSettings,
    showReducedUploadUi,
    configFormats,
    configFormatsSettings,
    type SelectedSettings,
    isCustomCommand,
    isSharedSettings,
    customPresets,
    type CustomPreset,
  } from "@/store";
  import FileConverter, {
    downloadAll,
  } from "@/components/FileConverter.svelte";
  import ConvertButton from "@/components/ConvertButton.svelte";
  import Header from "@/components/Header.svelte";
  import { config, type ConfigFormatOption } from "@/config";
  import { fade } from "svelte/transition";
  import Hyper5HeadMode from "@/components/Hyper5HeadMode.svelte";
  import UiButton from "@/components/ui/UIButton.svelte";
  import UiFloatingButton from "@/components/ui/UIFloatingButton.svelte";
  import UiFloatingButtonsContainer from "@/components/ui/UIFloatingButtonsContainer.svelte";
  import { getDataFromUrlParam } from "@/lib/utils/url";
  import { onMount, tick } from "svelte";
  import AddPreset from "@/components/AddPreset.svelte";
  import ShareModal from "@/components/ShareModal.svelte";
  import infoSvg from "@/assets/info.svg?raw";
  import gearSvg from "@/assets/gear.svg?raw";

  let refConvertButton: HTMLDivElement;

  $: {
    if ($selectedFiles.length > 0) {
      $isOpen = true;
    } else {
      $isOpen = !$showReducedUploadUi;
    }
  }

  $: {
    if ($filesReadyForDownload.size <= 0) {
      $isDownloadReady = false;
    }
  }

  const onRemoveFile = (file: File) => {
    $selectedFiles = $selectedFiles.filter((f) => f !== file);
  };

  const onRemoveAll = () => {
    $selectedFiles = [];
  };

  onMount(async () => {
    // get settings from shared url
    try {
      const format = getDataFromUrlParam<ConfigFormatOption>("format");
      const settings = getDataFromUrlParam<SelectedSettings>("settings");

      if (format && settings) {
        $isSharedSettings = true;

        if (format.isCustomPreset) {
          const preset = format as CustomPreset;
          $customPresets = structuredClone([...$customPresets, preset]);
        }

        $isCustomCommand = settings.custom ? true : false;
        $selectedSettings = settings;
        await tick(); //wait for derived store to update
        $selectedFormat = format;
        await tick(); //wait for derived store to update

        window.history.replaceState({}, "", window.location.pathname);
        $isSharedSettings = false;
      }
    } catch (error) {
      console.log(error);
    }
  });

  $: if (config.debug) {
    console.table($selectedFiles);
  }
  $: if (config.debug) {
    console.table($selectedFormat);
  }
  $: if (config.debug) {
    console.table($selectedSettings);
  }
</script>

<UiContainer>
  <!-- HEADER -->
  <Header title={config.titleHeader} />

  <!-- FILE UPLOAD -->
  <UiFileDrop
    bind:files={$selectedFiles}
    disabled={$isPreloadingFiles}
    label={config.fileDropLabel}
    multiple={true}
    maxFileSizeMb={config.maxFileSizeMb}
    expandDropzone={!$isOpen}
    accept={config.allowedFormats}
  />

  {#if $isOpen}
    <div class="flow w-full" in:fade={{ duration: 100 }}>
      <!-- FILE LIST -->
      <div class="grid">
        <UiFileList let:file bind:files={$selectedFiles}>
          <FileConverter
            on:remove={() => onRemoveFile(file)}
            {file}
            format={$selectedFormat}
            settings={$selectedSettings}
            {logger}
            showSparkle={$selectedFiles.length <= 5}
          />
        </UiFileList>
        {#if $selectedFiles.length > 1}
          <UiButton
            class="mr-2 mt-3 w-max justify-self-end"
            title="Remove all"
            small={true}
            on:click={() => onRemoveAll()}>Remove All</UiButton
          >
        {/if}
      </div>

      <!-- SETTINGS -->
      <Settings
        formats={$configFormats}
        settings={$configFormatsSettings}
        defaultSettings={$defaultSettings}
        bind:selectedFormat={$selectedFormat}
        bind:selectedSettings={$selectedSettings}
      />

      <!-- CONVERT BUTTON -->
      <div
        class="flex flex-wrap items-center justify-center gap-3"
        bind:this={refConvertButton}
      >
        <ConvertButton disabled={$selectedFiles.length <= 0} />
        {#if $isDownloadReady && $selectedFiles.length > 0}
          <UiButton
            title="Download all"
            large
            on:click={() => downloadAll(true)}>Download All</UiButton
          >
        {/if}

        {#if $selectedFiles.length <= 0}
          <p
            class="d-block w-full text-center text-sm font-light text-neutral-400"
          >
            Select a file first.
          </p>
        {/if}
      </div>

      <hr class="border-t border-white border-opacity-50" />

      <!-- EXPERT STUFF -->
      <Hyper5HeadMode />
    </div>
  {/if}
</UiContainer>

<AddPreset />
<ShareModal />

<UiFloatingButtonsContainer hasMenu={true}>
  <UiFloatingButton title="About" href="#/info"
    >{@html infoSvg}</UiFloatingButton
  >

  <UiFloatingButton title="Preferences" href="#/preferences"
    >{@html gearSvg}</UiFloatingButton
  >
</UiFloatingButtonsContainer>

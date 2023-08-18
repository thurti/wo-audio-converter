<script lang="ts">
  import UiContainer from "@/components/ui/UIContainer.svelte";
  import UiFileDrop from "@/components/ui/UIFileDrop.svelte";
  import UiFileList from "@/components/ui/UIFileList.svelte";
  import Settings from "@/components/Settings.svelte";
  import {
    filesReadyForDownload,
    isDownloadReady,
    isOpen,
    isPreloadingFFmpeg,
    showFullUi,
    logger,
    selectedFiles,
    selectedFormat,
    selectedSettings,
  } from "@/store";
  import FileConverter, {
    downloadAll,
  } from "@/components/FileConverter.svelte";
  import ConvertButton from "@/components/ConvertButton.svelte";
  import Header from "@/components/Header.svelte";
  import { config } from "@/config";
  import { fade } from "svelte/transition";
  import Hyper5HeadMode from "@/components/Hyper5HeadMode.svelte";
  import UiButton from "@/components/ui/UIButton.svelte";
  import UiFloatingButton from "@/components/ui/UIFloatingButton.svelte";
  import Preloader from "@/components/Preloader.svelte";
  import UiFloatingButtonsContainer from "@/components/ui/UIFloatingButtonsContainer.svelte";

  let refConvertButton: HTMLDivElement;
  let containerTransitionEnd = false;

  $: {
    if ($showFullUi) {
      $isOpen = true;
    } else if ($selectedFiles.length > 0) {
      $isOpen = true;
    }

    if ($selectedFiles.length <= 0) {
      $isDownloadReady = false;
    }

    if (containerTransitionEnd && $selectedFiles.length > 1) {
      setTimeout(() => {
        refConvertButton?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 1000);
    }
  }

  const onRemoveFile = (file: File) => {
    $selectedFiles = $selectedFiles.filter((f) => f !== file);
  };

  const onRemoveAll = () => {
    $selectedFiles = [];
  };

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

<UiContainer
  isOpen={$isOpen}
  on:transitionend={() => (containerTransitionEnd = true)}
>
  <!-- HEADER -->
  <Header isOpen={$isOpen} title={config.titleHeader} />

  <!-- FILE UPLOAD -->
  <UiFileDrop
    bind:files={$selectedFiles}
    disabled={$isPreloadingFFmpeg}
    label={config.fileDropLabel}
    multiple={true}
    maxFileSizeMb={config.maxFileSizeMb}
    expandDropzone={!$isOpen}
    accept={config.allowedFormats}
  />

  <Preloader />

  <!-- SETTINGS -->
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
        formats={config.formats}
        settings={config.settings}
        defaults={config.defaults}
        bind:selectedFormat={$selectedFormat}
        bind:selectedSettings={$selectedSettings}
      />

      <!-- CONVERT BUTTON -->
      <div
        class="flex flex-wrap justify-center gap-6"
        bind:this={refConvertButton}
      >
        <ConvertButton disabled={$selectedFiles.length <= 0} />
        {#if $isDownloadReady}
          <UiButton title="Download all" on:click={() => downloadAll(true)}
            >Download All</UiButton
          >
        {/if}
      </div>

      <hr class="border-t border-white border-opacity-50" />

      <!-- EXPERT STUFF -->
      <Hyper5HeadMode />
    </div>
  {/if}
</UiContainer>

<UiFloatingButtonsContainer hasMenu={true}>
  <UiFloatingButton title="Info" href="#/info">i</UiFloatingButton>

  <UiFloatingButton title="Preferences" href="#/preferences"
    >&#9881;</UiFloatingButton
  >
</UiFloatingButtonsContainer>

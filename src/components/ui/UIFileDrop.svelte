<script lang="ts">
  import { isFileType, isMaxFileSizeMb } from "@/lib/utils/file";
  import { createEventDispatcher, onDestroy } from "svelte";
  import type { ChangeEventHandler } from "svelte/elements";
  import { fade } from "svelte/transition";

  export let disabled: boolean = false;
  export let label = "Add File";
  export let files: File[] = [];
  export let accept: string = "";
  export let multiple: boolean = false;
  export let maxFileSizeMb: number = 2000 * 1024 * 1024; //2GB
  export let expandDropzone: boolean = false; //expand dropzone to fullscreen

  let isDragOver: boolean = false;
  let fileSizeFormatted: string;

  $: {
    if (maxFileSizeMb >= 1000) {
      const fileSize = Intl.NumberFormat("en-US", {
        maximumFractionDigits: 4,
      }).format(maxFileSizeMb / 1000);
      fileSizeFormatted = `${fileSize} GB`;
    } else {
      fileSizeFormatted = `${maxFileSizeMb} MB`;
    }
  }

  let errorMessage: string = "";
  let errorMessageTimeout: number;

  const showErrorMessage = (message: string): void => {
    errorMessage = message;
    errorMessageTimeout = window.setTimeout(() => {
      errorMessage = "";
    }, 10000);
  };

  const emits = createEventDispatcher();

  const onDropFiles = (event: DragEvent) => {
    isDragOver = false;
    const droppedFiles = Array.from(event.dataTransfer?.files ?? [])
      .filter(
        (file) =>
          files.findIndex((f) => f.name === file.name) === -1 &&
          isFileType(file, accept),
      )
      .filter((file) => {
        if (isMaxFileSizeMb(file, maxFileSizeMb)) {
          return true;
        } else {
          showErrorMessage(
            `File ${file.name} is too large.\nMaximum file size is ${fileSizeFormatted}.`,
          );
          return false;
        }
      });

    if (multiple === true) {
      files = [...files, ...droppedFiles];
    } else {
      if (droppedFiles.length > 0) files = [droppedFiles[0]];
    }

    emits("change", files);
  };

  const onInputChange = (event: Event) => {
    const droppedFiles = Array.from(
      (event.target as HTMLInputElement).files ?? [],
    ).filter((file) => {
      if (isMaxFileSizeMb(file, maxFileSizeMb)) {
        return true;
      } else {
        showErrorMessage(
          `File ${file.name} is too large.\nMaximum file size is ${fileSizeFormatted}.`,
        );
        return false;
      }
    });

    files = multiple === true ? [...files, ...droppedFiles] : droppedFiles;
    emits("change", files);
  };

  onDestroy(() => {
    clearTimeout(errorMessageTimeout);
  });
</script>

<div
  class="file-drop theme-border-color-50 relative flex max-w-sm select-none items-center justify-center rounded-lg border-2 border-dashed bg-opacity-25 p-8 pb-4 transition-colors"
  class:border-opacity-100={isDragOver}
  class:bg-neutral-500={isDragOver}
  class:disabled
>
  <div
    class="relative z-10 max-w-full opacity-100 transition-opacity"
    class:opacity-20={isDragOver}
    class:!z-0={isDragOver}
  >
    <label
      class="block rounded-full border bg-opacity-30 px-8 pb-1.5 pt-2 text-center shadow-sm transition-colors hover:cursor-pointer hover:bg-opacity-50 text-white"
      style="background-color: var(--theme-btn-color);border-color: var(--theme-btn-color);"
    >
      {label}
      <input
        on:change={onInputChange}
        type="file"
        accept={accept || null}
        {multiple}
        class="-z-30 block h-0 w-0 opacity-0"
      />
    </label>
    <p class="mt-2 text-center" aria-hidden="true">or drag and drop</p>
    {#if errorMessage !== ""}
      <p
        class="mt-3 whitespace-pre text-center text-sm font-light text-red-500"
        transition:fade
      >
        {errorMessage}
      </p>
    {:else if maxFileSizeMb}
      <p class="mt-3 text-center text-sm font-light text-neutral-400">
        (max {fileSizeFormatted})
      </p>
    {/if}
  </div>

  <p
    class="pointer-events-none absolute z-20 block text-4xl font-semibold text-white opacity-0 transition-opacity motion-safe:animate-bounce"
    class:opacity-90={isDragOver}
  >
    Drop it!
  </p>
  <div
    on:dragover|preventDefault={() => (isDragOver = true)}
    on:dragleave={() => (isDragOver = false)}
    on:drop|preventDefault={onDropFiles}
    class="file-dropzone absolute left-0 top-0 grid h-full w-full select-none place-items-center bg-neutral-700 bg-opacity-50 opacity-0 transition-opacity"
    class:opacity-100={isDragOver}
    class:z-10={isDragOver}
    class:!fixed={expandDropzone}
  />
</div>

<style>
  .file-drop:focus-within {
    @apply outline-none;
    @apply ring;
  }

  .file-drop.disabled {
    @apply opacity-50;
    @apply pointer-events-none;
  }

  label:not(.disabled):hover {
    filter: contrast(1.2);
  }

  label:active {
    transform: scale(0.95);
    @apply outline-none;
    @apply ring-0;
  }
</style>

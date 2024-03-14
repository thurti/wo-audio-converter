<script lang="ts" context="module">
  import { writable } from "svelte/store";

  export const showImportPresetsModal = writable(true);
</script>

<script lang="ts">
  import UiModal from "./ui/UIModal.svelte";
  import UiButton from "./ui/UIButton.svelte";
  import UiFileDrop from "./ui/UIFileDrop.svelte";
  import UiInputCheckbox from "./ui/UIInputCheckbox.svelte";
  import { isCustomPreset } from "@/lib/utils/settings";
  import { readJsonFile } from "@/lib/utils/file";
  import { customPresets, type CustomPreset } from "@/store";

  let replaceExistingPresets: boolean = false;
  let files: File[] = [];
  let presetsImportFileJson: CustomPreset[] = [];
  let importComplete = false;

  showImportPresetsModal.subscribe((value) => {
    if ((value = true)) {
      files = [];
      presetsImportFileJson = [];
      replaceExistingPresets = false;
      importComplete = false;
    }
  });

  function presetIdAlreadyExists(id: string): boolean {
    return $customPresets.some((f) => f.id === id);
  }

  $: presetsImportFile = files[0];

  async function onFileSelect(e: CustomEvent<File[]>) {
    const files = e.detail;

    if (files && files?.length > 0) {
      try {
        const json = await readJsonFile<CustomPreset[]>(files[0]);
        presetsImportFileJson = json.filter(isCustomPreset);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function onImportPresets() {
    if (presetsImportFileJson?.length > 0) {
      const importPresetIds = presetsImportFileJson.map((p) => p.id);

      $customPresets = replaceExistingPresets
        ? presetsImportFileJson
        : [
            ...$customPresets.filter((p) => !importPresetIds.includes(p.id)),
            ...presetsImportFileJson,
          ];

      importComplete = true;
    }
  }
</script>

<UiModal bind:open={$showImportPresetsModal} on:submit={onImportPresets}>
  <h3 class="mb-6 mt-2 dark:text-white">Import Presets</h3>

  <div class="flex flex-col items-center gap-4">
    <UiFileDrop
      label="Selecte Preset File"
      accept="application/json"
      maxFileSizeMb={1}
      bind:files
      on:change={onFileSelect}
    />
    {#if presetsImportFile}
      <pre class="my-1 px-3 py-0.5">{presetsImportFile?.name}</pre>

      <p class="my-0 text-left">
        {#if presetsImportFileJson?.length > 0}
          Found Presets:
          <ul class="mt-2 text-left marker:text-current">
            {#each Object.values(presetsImportFileJson) as preset}
              <li>
                {preset.label}
                {#if presetIdAlreadyExists(preset.id)}
                  <span class="text-xs text-yellow-600">
                    - already exists, will be overwritten</span
                  >
                {/if}
              </li>
            {/each}
          </ul>
          <UiInputCheckbox
            label="Replace ALL existing presets with the imported ones."
            bind:checked={replaceExistingPresets}
          />
        {:else}
          The file seems to be empty or not a valid preset file.
        {/if}
      </p>{/if}

    {#if importComplete}
      <p class="my-0 text-green-500">Import complete.</p>
    {/if}
  </div>

  <div slot="action">
    <UiButton title="Import Presets" type="submit" />
  </div>
</UiModal>

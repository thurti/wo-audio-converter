<script lang="ts">
  import { onDestroy } from "svelte";
  import UiButton from "./UIButton.svelte";
  import { getFileExtension, saveFileAs } from "@/lib/utils/file";

  export let data: any;
  export let type: string;
  export let filename: string;
  export let useNative: boolean = false;
  export let small: boolean = false;
  export let disabled: boolean = false;

  let href: string;
  let urlLink: HTMLAnchorElement;

  $: {
    if (href) URL.revokeObjectURL(href);
    href = URL.createObjectURL(new Blob([data], { type }));
  }

  const onSaveAs = async () => {
    try {
      saveFileAs(new Blob([data], { type }), filename, type);
    } catch (error) {
      console.warn(error);
    }
  };

  onDestroy(() => {
    URL.revokeObjectURL(href);
  });
</script>

{#if useNative && "showSaveFilePicker" in window}
  <UiButton
    on:click={() => onSaveAs()}
    title={`Save ${filename} as`}
    {small}
    {disabled}
  >
    <slot />
  </UiButton>
{:else}
  <UiButton
    on:click={() => urlLink.click()}
    title={`Download ${filename}`}
    {small}
    {disabled}
  >
    <slot />
    <a
      bind:this={urlLink}
      {href}
      download={filename}
      class="hidden"
      title={`Download ${filename}`}
    >
      {filename}
    </a>
  </UiButton>
{/if}

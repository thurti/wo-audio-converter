<script lang="ts">
  import { clickOutside } from "@/actions/clickOutside";
  import { onDestroy, onMount } from "svelte";
  import UiButton, { type IUIButton } from "./UIButton.svelte";

  export let button: IUIButton;

  let refApp: HTMLDivElement | null;
  let refDialog: HTMLDialogElement | null;

  const openDialog = () => {
    if (refApp) refApp.style.filter = "blur(3px)";
    refDialog?.showModal();
  };

  const closeDialog = () => {
    if (refApp) refApp.style.filter = "";
    refDialog?.close();
  };

  onMount(() => {
    refApp = document.querySelector("#app");
    if (refApp) refApp.style.transition = "filter 0.3s ease-out";
  });

  onDestroy(() => {
    closeDialog();
    refDialog = null;
    refApp = null;
  });
</script>

<slot name="button">
  <UiButton {...button} on:click={() => openDialog()} />
</slot>

<dialog
  bind:this={refDialog}
  on:close={() => closeDialog()}
  class="min-w-screen min-h-screen rounded-2xl shadow-lg backdrop:bg-neutral-800 backdrop:opacity-50 md:min-h-min md:w-3/5 md:min-w-min"
>
  <div class="grid gap-6 p-0" use:clickOutside={() => closeDialog()}>
    <slot>Content</slot>
    <UiButton
      class="justify-self-end"
      small={true}
      title="Close"
      on:click={() => closeDialog()}
    />
  </div>
</dialog>

<style>
  dialog {
    background: var(--theme-bg-color);
  }

  dialog[open] {
    animation: fade 0.3s ease-out;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

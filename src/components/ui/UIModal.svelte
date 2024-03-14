<script lang="ts">
  import UiButton from "./UIButton.svelte";

  export let id = "modal";
  export let open = false;

  let refDialog: HTMLDialogElement;

  $: {
    if (refDialog) {
      if (open) {
        refDialog.showModal();
      } else {
        refDialog.close();
      }
    }
  }
</script>

<dialog
  bind:this={refDialog}
  on:close={() => (open = false)}
  on:keydown={(e) => e.key === "Escape" && e.stopPropagation()}
  {id}
  class="prose h-max max-h-full w-[calc(100%-3rem)] rounded-lg border theme-border-color-50 p-6 text-center backdrop:backdrop-blur-sm"
  style="background-color: var(--theme-bg-light-color); color: var(--theme-text-color);"
>
  <form action="dialog" on:submit|preventDefault>
    <slot />

    <div class="mt-8 flex items-center justify-center gap-6">
      <UiButton on:click={() => (open = false)} title="Close" outline />
      <slot name="action" />
    </div>
  </form>
</dialog>

<style>
  dialog[open] {
    animation: myFadeIn 0.3s ease normal;
  }

  @keyframes myFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>

<script lang="ts">
  import UiInputCheckbox from "./UIInputCheckbox.svelte";

  export let checked: boolean = false;
  export let label: string = "enable notifications";

  const isSupported = "Notification" in window;
  let isAllowed = isSupported ? Notification.permission !== "denied" : false;

  let disabled = !isAllowed;
  let showError = false;

  const requestPermission = async (value: boolean) => {
    let permission;

    if (Notification.permission === "default") {
      permission = await Notification.requestPermission();
    } else {
      permission = Notification.permission;
    }

    if (permission === "granted") {
      checked = value;
      showError = false;
      isAllowed = true;
    } else {
      isAllowed = false;
      checked = false;
      showError = true;
    }
  };

  function onClickCheckbox(e: Event) {
    requestPermission((e.target as HTMLInputElement)?.checked);
  }
</script>

<div>
  {#if isSupported}
    <UiInputCheckbox {checked} {label} {disabled} on:input={onClickCheckbox} />
    {#if showError}
      <p class="text-xs italic">Please allow notifications in your browser.</p>
    {/if}
    {#if !isAllowed}
      <p class="text-xs italic">
        You have denied the browser permission for sending notifications. If
        this was by mistake, open your browser settings and reset the
        notification settings for this website.
      </p>
    {/if}
  {:else}
    <p class="italic">Notifications are not supported in your browser.</p>
  {/if}
</div>

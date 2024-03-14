<script lang="ts">
  export let label = "";
  export let value = "";
  export let rows = 4;

  let textarea: HTMLTextAreaElement;
  let isHover = false;

  const scrollToBottom = () => {
    if (!isHover) {
      textarea.scrollTo({ top: textarea.scrollHeight });
    }
  };

  $: if (typeof textarea?.scrollTo === "function" && value) {
    scrollToBottom();
  }
</script>

<label
  class="block w-full"
  on:mouseenter={() => (isHover = true)}
  on:mouseleave={() => (isHover = false)}
>
  {label}
  <textarea
    bind:this={textarea}
    bind:value
    disabled
    {rows}
    class="theme-border-color-50 z-50 mt-2 w-full cursor-text rounded-lg border bg-neutral-100 bg-opacity-10 px-2 py-2 text-sm font-extralight"
  />
</label>

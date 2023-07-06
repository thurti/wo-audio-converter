<script lang="ts">
  import { conversionCount } from "@/store";
  import { tweened } from "svelte/motion";
  import { onMount } from "svelte";
  import UiDialog from "./ui/UIDialog.svelte";
  import UiButton from "./ui/UIButton.svelte";

  const count = tweened(0, {
    duration: $conversionCount * 100,
    delay: 1000,
  });

  onMount(() => {
    count.set($conversionCount);
  });
</script>

<div
  class="relative rounded-lg border border-neutral-100 border-opacity-50 p-6 text-center"
  style="background-color: var(--theme-bg-light-color)"
>
  <p>
    Hey there! 👋 <br />
    I am glad you like my software. <br /> <br />

    {#if $conversionCount > 0}
      If my calculations are correct and you have not
      <span class="font-thin">h4ckZ0rEd</span>
      with the dev tools, you've converted
      <span
        class="mx-0.5 inline-block rounded-md border-white bg-slate-800 bg-opacity-30 px-2 py-0 pt-0.5"
        >{Math.round($count)}</span
      >
      files so far. Not bad&hellip;
      <br /><br />
    {/if}

    If you want to support
    <span class="font-thin">worksoffline.io</span>,<br />
    your can buy me a coffee. ☕️
  </p>
  <UiButton
    as="a"
    href="https://ko-fi.com/thurti"
    target="_blank"
    title="Buy Me a Coffee"
    class="my-6"
    small={true}
    highlight={true}
  />
  <p>
    Or <a
      href="https://thomashurtig.de"
      target="_blank"
      class="underline"
      title="hire me">hire me as a freelancer</a
    > for your next project.
  </p>
</div>

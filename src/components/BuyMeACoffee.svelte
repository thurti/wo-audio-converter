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
    I am glad you like my software.

    {#if $conversionCount > 0}
      <br /> <br />
      If my calculations are correct and you have not
      <span class="font-thin">h4ckZ0rEd</span> <br />
      with dev tools, you've converted
      <span
        class="mx-0.5 inline-block rounded-md border-white bg-slate-800 bg-opacity-30 px-2 py-0 pt-0.5"
        style="number-spacing: 0.1em; font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'"
        >{Math.round($count)}</span
      >
      files so far. Not bad&hellip;
    {/if}
  </p>
  <hr class="my-8" />
  <p>
    If you like <span class="font-thin">worksoffline.app</span>, please consider
    donating to <i>Sea-Watch e.V.</i>
  </p>
  <UiButton
    as="a"
    href="https://www.betterplace.org/en/projects/36808"
    target="_blank"
    title="Donate to Sea Watch"
    class="mb-2 mt-4"
    highlight={true}
  />

  <p class="mt-4">
    <span class="text-sm">
      Sea-Watch e.V. is a non-profit organization that conducts civil search and
      rescue operations in the Central Mediterranean Sea and provides
      humanitarian aid to those who need it. They are committed to fighting for
      the rights of migrants and refugees and against the dying in the
      Mediterranean.
    </span>
  </p>
  <hr class="mt-8" />
  <p class="mt-6">
    If you need a developer you can <a
      href="https://thomashurtig.de"
      target="_blank"
      class="underline"
      title="hire me">hire me as a freelancer</a
    > for your next project.
  </p>
</div>

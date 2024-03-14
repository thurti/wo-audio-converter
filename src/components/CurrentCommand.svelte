<script lang="ts">
  import type { ConfigFormatOption } from "@/config";
  import { createFFmegCommandArgs } from "@/lib/utils/settings";
  import type { SelectedSettings } from "@/store";

  export let label = "Current Command:";
  export let format: ConfigFormatOption;
  export let settings: SelectedSettings;

  $: currentCommand = createFFmegCommandArgs(
    new File([], "[filename]"),
    format,
    settings,
  ).join(" ");
</script>

{#if label}
  <hgroup class="flex justify-between">
    <h4 class="!m-0 text-left text-sm font-normal text-current">{label}</h4>
    <a
      href="https://explainshell.com/explain?cmd=ffmpeg+{encodeURIComponent(
        currentCommand,
      )}"
      target="_blank"
      class="!m-0 text-sm text-current">Explain</a
    >
  </hgroup>
{/if}
<pre class="!mt-0.5 max-w-full overflow-auto text-sm">{currentCommand}</pre>

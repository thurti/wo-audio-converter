<script lang="ts">
  import { config } from "@/config";
  import { link } from "svelte-spa-router";
  import GithubLink from "./GithubLink.svelte";
</script>

<footer
  class={`fixed bottom-0 h-max w-full text-sm opacity-80 theme-${config.colorScheme} `}
  style="background-color: var(--theme-bg-dark-color)"
>
  <nav class=" p-2">
    <ul class="flex justify-center gap-6">
      <li>
        <a href="/imprint" title="Imprint" class="unstyled" use:link>Imprint</a>
      </li>
      <li>
        <a href="/privacy" title="Privacy" class="unstyled" use:link>Privacy</a>
      </li>
      <li>
        <a href="/faq" title="FAQ" class="unstyled" use:link>FAQ</a>
      </li>
      <li />
    </ul>
  </nav>
  <div class="absolute bottom-2 right-6 flex items-center gap-2">
    <GithubLink url={config.github} />
    <span class="text-xs font-light">{config.version}</span>
  </div>
</footer>

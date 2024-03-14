<script lang="ts">
  import { config } from "@/config";
  import { link } from "svelte-spa-router";
  import GithubLink from "./GithubLink.svelte";
  import { preferedColorScheme } from "@/store";
</script>

<footer
  class="absolute bottom-0 flex h-max w-full items-center justify-between px-3 pb-0.5 pt-1 text-xs xl:fixed theme-{config.colorScheme} {$preferedColorScheme}"
>
  <a href="https://worksoffline.app" class="unstyled text-gray-400"
    >worksoffline.app</a
  >
  <nav>
    <ul class="flex items-center gap-3">
      <li>
        <a href="/faq" title="FAQ" class="unstyled" use:link>FAQ</a>
      </li>
      <li>
        <a href="/imprint" title="Imprint" class="unstyled" use:link>Imprint</a>
      </li>
      <li>
        <a href="/privacy" title="Privacy" class="unstyled" use:link>Privacy</a>
      </li>
      <li class="ml-1">
        <GithubLink url={config.github} text={config.version} />
      </li>
    </ul>
  </nav>
</footer>

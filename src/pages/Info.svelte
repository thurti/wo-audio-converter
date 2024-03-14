<script lang="ts">
  import BuyMeACoffee from "@/components/BuyMeACoffee.svelte";
  import UiSection from "@/components/ui/UISection.svelte";
  import { config } from "@/config";
  import { link } from "svelte-spa-router";
  import PageContainer from "./PageContainer.svelte";
</script>

<PageContainer title="About">
  <BuyMeACoffee />
  <UiSection>
    <slot slot="heading">Looking for something else?</slot>
    <ul>
      <li><a href="/faq" title="FAQ" use:link>FAQs</a></li>
      <li>
        <a href={config.github} title="Github">Code on Github</a>
      </li>
      <li>
        <a href="https://worksoffline.app" title="worksoffline.app"
          >worksoffline.app</a
        >
      </li>
    </ul>
  </UiSection>
</PageContainer>

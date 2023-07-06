<script lang="ts">
  import UiSection from "@/components/ui/UISection.svelte";
  import PageContainer from "./PageContainer.svelte";
</script>

<PageContainer title="Privacy">
  <UiSection>
    <slot slot="heading">Accountability</slot>
    <p>
      Thomas Hurtig <br />
      E-Mail:
      <a href="mailto:contact@thomashurtig.de">contact@thomashurtig.de</a>
    </p>
  </UiSection>
  <UiSection>
    <slot slot="heading">Cookies</slot>
    <p>This site uses no Cookies or any kind of tracking.</p>
  </UiSection>
  <UiSection>
    <slot slot="heading">Server Logs</slot>
    <p>
      The web server stores informations in so called log files containing the
      client’s <i>redacted</i> IP address, date and time of the request, the actual
      HTTP request sent, the referrer and the user agent, i.e. the browser and operating
      system used by the client.
    </p></UiSection
  >
  <UiSection>
    <slot slot="heading">Hosting Provider</slot>
    <p>
      This site is hosted by <a href="https://uberspace.de/">Uberspace</a>. The
      person responsible according to the GDPR is: Jonas Pasche, Kaiserstr. 15,
      55116 Mainz. For more information see their
      <a href="https://uberspace.de/en/about/privacy/"
        >Privacy and Data Protection</a
      > page.
    </p></UiSection
  >
</PageContainer>

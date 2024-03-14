<script lang="ts">
  import UiSection from "@/components/ui/UISection.svelte";
  import PageContainer from "./PageContainer.svelte";
</script>

<PageContainer title="Privacy">
  <UiSection>
    <slot slot="heading">Accountability</slot>
    <p>
      The person responsible is: <br /><br />
      Thomas Hurtig <br />
      c/o IP-Management #15561 <br />
      Ludwig-Erhard-Straße 18 <br />
      20459 Hamburg <br /><br />
      E-Mail:
      <a href="mailto:contact@thomashurtig.de">contact@thomashurtig.de</a>
    </p>
    <p>
      This privacy policy applies to the website https://worksoffline.app and
      all web apps hosted on this domain.
    </p>
  </UiSection>
  <UiSection>
    <slot slot="heading">Handling of User Files</slot>
    <p>
      This site provides a service to process files provided by the user. These
      files are completly processed in the users browser. No file is ever
      uploaded to the server.
    </p>
  </UiSection>
  <UiSection>
    <slot slot="heading">Cookies</slot>
    <p>This site uses no Cookies or any kind of tracking.</p>
  </UiSection>
  <UiSection>
    <slot slot="heading">Local Storage</slot>
    <p>
      The <b>settings</b> on the page "Preferences" are stored in the local storage
      of your browser. This is necessary to save your preferences between page reloads.
    </p>
    <p>
      The <b>number of converted files</b> is also stored in your browsers local
      storage so it can be shown on the "Info" page.
    </p>
  </UiSection>
  <UiSection>
    <slot slot="heading">Cache</slot>
    <p>
      The site uses a service worker to cache all files (like HTML, CSS,
      JavaScript, Images and Wasm) necessary to run the app in the browsers
      cache. This is necessary to make the app work without an internet
      connection.
    </p>
    <p>
      The caching <b
        >does not include your media files you load for conversion.</b
      > These files are only loaded into the browsers memory while converting and
      are deleted as soon as you click the "remove" button or close the site.
    </p>
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

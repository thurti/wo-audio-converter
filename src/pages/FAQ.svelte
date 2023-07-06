<script lang="ts">
  import UiSection from "@/components/ui/UISection.svelte";
  import PageContainer from "./PageContainer.svelte";
</script>

<PageContainer title="FAQ">
  <UiSection id="offline">
    <slot slot="heading">
      Why do I get the message that my browser doesn't support offline
      capability?
    </slot>
    <p>
      To work offline, your browser needs to support Service Worker. The latest
      versions of Chrome, Firefox and Safari should work. So check if you have
      the latest version installed.
    </p>
    <p>
      Please also check if you have <b>disabled cookies</b> in your browser settings.
      If cookies are disabled completly the browser doesn't allow to store any data
      locally. This includes caching the data in a service worker for offline capability.
    </p>
  </UiSection>

  <UiSection id="cache">
    <slot slot="heading">
      Why do files get preloaded everytime, aka why do my files not cache?
    </slot>
    <p>
      The files are stored in the browsers cache storage. If you have set your
      browser to delete all data (cookies and website data) on exit, the files
      will be deleted.
    </p>
  </UiSection>

  <UiSection id="ffmpeg-error">
    <slot slot="heading">I get an error while converting a file.</slot>
    <p>
      Your browser needs to support <b>Shared Array Buffer</b>. Chrome 68+,
      Firefox 79+, Safari 15.2+ and Edge 79+ should work. You can get more
      supported browsers at
      <a href="https://caniuse.com/?search=sharedarraybuffer" target="_blank"
        >caniuse.com</a
      >.
    </p>
    <p>
      You can also check the FFmpeg output in the <b>expert</b> console.
    </p>
  </UiSection>

  <UiSection id="size-limit">
    <slot slot="heading">Why can I only convert files up to 2GB?</slot>
    <p>
      This is a hard limit of the browser when using service workers. This may
      change in the future.
    </p>
  </UiSection>

  <UiSection id="who">
    <slot slot="heading">Who are you and why you've created this?</slot>
    <p>
      I'm a freelance webdevolper with a passion for web apps. I've created as a
      side project to learn more about progressive web apps. Check out my site
      at <a href="https://thomashurtig.de" target="_blank">thomashurtig.de</a>.
    </p>
  </UiSection>
</PageContainer>

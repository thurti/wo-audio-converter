<script lang="ts">
  import UiEnableNotifications from "@/components/ui/UIEnableNotifications.svelte";
  import UiInputCheckbox from "@/components/ui/UIInputCheckbox.svelte";
  import UiSection from "@/components/ui/UISection.svelte";
  import { badgeOnConversionReady, notifyOnConversionReady } from "@/store";
  import PageContainer from "./PageContainer.svelte";

  const isBadgeSupported = "setAppBadge" in navigator;
</script>

<PageContainer title="Preferences">
  <UiSection>
    <slot slot="heading">Notifications</slot>
    <form class="space-y-4">
      <UiEnableNotifications
        bind:checked={$notifyOnConversionReady}
        label="Notify me when the conversion is completed."
      />
      <div>
        <UiInputCheckbox
          label="Show number of completed files in badge."
          disabled={!isBadgeSupported}
          bind:checked={$badgeOnConversionReady}
        />
        {#if !isBadgeSupported}
          <p class="text-sm italic">
            This feature is not supported by your browser.
          </p>
        {/if}
      </div>
    </form>
  </UiSection>
</PageContainer>

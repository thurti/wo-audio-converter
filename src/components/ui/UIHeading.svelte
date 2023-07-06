<script lang="ts">
  export let id: string = "";
  export let level: number = 1;

  let className: string = "";
  export { className as class };

  $: heading = `h${level}`;
</script>

<svelte:element
  this={heading}
  {id}
  class={`text-center align-baseline font-semibold !leading-snug ${className}`}
>
  <slot />
</svelte:element>

<style lang="scss">
  h1 {
    @apply text-2xl;
    @apply uppercase;

    @screen sm {
      font-size: theme("fontSize.3xl");
    }

    @screen md {
      font-size: theme("fontSize.4xl");
    }
  }

  h2 {
    @apply text-lg;
    @apply uppercase;

    @screen sm {
      font-size: theme("fontSize.xl");
    }

    @screen md {
      font-size: theme("fontSize.2xl");
    }
  }

  h3 {
    @apply text-lg;
    @apply font-medium;

    @screen sm {
      font-size: theme("fontSize.xl");
    }
  }

  h4 {
    @apply text-base;
    @apply font-normal;
  }
</style>

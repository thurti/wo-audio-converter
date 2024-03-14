<script lang="ts">
  export let show: boolean = false;
</script>

<slot />
{#if show}
  <span class="waiting-animation" />
{/if}

<style>
  .waiting-animation:after {
    @apply inline-block;
    @apply absolute;
    @apply ml-1;

    content: "";
    animation: waiting 1.25s linear;
    animation-iteration-count: infinite;
  }

  @keyframes waiting {
    33% {
      content: ".";
    }
    66% {
      content: "..";
    }
    77% {
      content: "...";
    }
  }
</style>

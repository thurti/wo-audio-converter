<script lang="ts">
  export let hidden: boolean = false;
  export let posY: number = 0;
  export let posX: number = 0;
</script>

<div
  aria-hidden="true"
  class="sparkler not-sr-only motion-reduce:hidden"
  class:hidden
  style={`
  --spark-pos-x:${posX}%;
  --spark-pos-y:${posY}%;
  `}
>
  {#each Array(16) as _, i}
    <div
      class="spark"
      style={`
          --spark-rotate:${Math.floor(Math.random() * 200) - 20}deg;
          --spark-delay:${Math.floor(Math.random() * 1000)}ms;
        `}
    />
  {/each}
</div>

<style>
  .sparkler {
    position: absolute;
    top: calc(var(--spark-pos-y, 0) + 0.5rem);
    left: calc(var(--spark-pos-x, 0) + 0.125rem);
    opacity: 0.85;
    filter: blur(0.75px);
    transform: scaleY(0.5) scaleX(0.75);
  }

  .spark {
    position: absolute;
    transform-origin: center center;
    transform: rotate(var(--spark-rotate));
  }

  .spark::after {
    position: absolute;
    display: block;
    content: "";
    top: 0;
    left: 0;
    width: 0.1rem;
    height: 0.75rem;
    border-radius: 0.1rem;
    opacity: 0;
    background-color: var(--spark-color, white);

    animation: sparkler-sparkle 0.5s infinite;
    animation-delay: var(--spark-delay);
  }

  @keyframes sparkler-sparkle {
    0% {
      transform: translateY(-0.5rem) scaleY(0.25);
      opacity: 0;
    }
    10% {
      transform: translateY(-1rem) scaleY(0.5);
      opacity: 0.35;
    }
    30% {
      transform: translateY(-2rem) scaleY(0.5);
      opacity: 0.7;
    }
    50% {
      transform: translateY(-4rem) scaleY(1.5);
      opacity: 0.7;
    }
    51% {
      opacity: 0;
      transform: translateY(-4rem) scaleY(1);
    }
    100% {
      opacity: 0;
      transform: translateY(0) scaleY(0.25);
    }
  }
</style>

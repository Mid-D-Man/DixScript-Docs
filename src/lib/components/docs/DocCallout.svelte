<script lang="ts">
  export let type: 'warn' | 'info' = 'info';
</script>

<div class="callout callout--{type}">
  <slot />
</div>

<style>
  .callout {
    border-radius: 6px;
    padding: 0.875rem 1.125rem;
    margin: 1rem 0;
    font-size: 0.875rem;
    line-height: 1.75;
    border-left: 3px solid transparent;
  }

  .callout--warn {
    background: rgba(181, 74, 53, 0.07);
    border-color: var(--destructive);
    color: var(--foreground);
  }

  .callout--info {
    background: rgba(166, 124, 82, 0.07);
    border-color: var(--primary);
    color: var(--foreground);
  }

  .callout :global(a) {
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .callout :global(code) {
    font-size: 0.8125rem;
  }
</style>

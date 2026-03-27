<!-- src/lib/components/ci/CICategory.svelte -->
<script lang="ts">
  export let label: string;
  export let iconPath: string;
</script>

<section class="ci-section">
  <div class="ci-section-header">
    <div class="ci-section-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d={iconPath}/>
      </svg>
    </div>
    <h2 class="ci-section-label">{label}</h2>
  </div>
  <div class="ci-section-grid">
    <slot />
  </div>
</section>

<style>
  .ci-section { display: flex; flex-direction: column; gap: 0.875rem; }

  .ci-section-header {
    display: flex; align-items: center; gap: 0.625rem;
    padding-bottom: 0.625rem;
    border-bottom: 1px solid var(--border);
  }

  .ci-section-icon {
    width: 1.75rem; height: 1.75rem; flex-shrink: 0;
    background: var(--secondary); border: 1px solid var(--border);
    border-radius: 6px; display: flex; align-items: center; justify-content: center;
    color: var(--primary);
  }

  .ci-section-label {
    font-family: var(--font-serif);
    font-size: 1.0625rem; font-weight: 700;
    color: var(--foreground); margin: 0;
  }

  .ci-section-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 0.875rem;
  }

  @media (max-width: 640px) {
    .ci-section-grid { grid-template-columns: 1fr; }
  }
</style>

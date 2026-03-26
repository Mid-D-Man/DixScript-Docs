<!-- src/lib/routes/docs/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  import DocLayout    from '$lib/components/docs/DocLayout.svelte';
  import DocSidebar   from '$lib/components/docs/DocSidebar.svelte';

  import DocIntro         from '$lib/components/docs/sections/DocIntro.svelte';
  import DocQuickStart    from '$lib/components/docs/sections/DocQuickStart.svelte';
  import DocTypes         from '$lib/components/docs/sections/DocTypes.svelte';
  import DocVariables     from '$lib/components/docs/sections/DocVariables.svelte';
  import DocConfig        from '$lib/components/docs/sections/DocConfig.svelte';
  import DocEnums         from '$lib/components/docs/sections/DocEnums.svelte';
  import DocData          from '$lib/components/docs/sections/DocData.svelte';
  import DocQuickFuncs    from '$lib/components/docs/sections/DocQuickFuncs.svelte';
  import DocSecurity      from '$lib/components/docs/sections/DocSecurity.svelte';
  import DocDLM           from '$lib/components/docs/sections/DocDLM.svelte';
  import DocImports       from '$lib/components/docs/sections/DocImports.svelte';
  import DocCLI           from '$lib/components/docs/sections/DocCLI.svelte';
  import DocFFI           from '$lib/components/docs/sections/DocFFI.svelte';
  import DocBuiltinMath     from '$lib/components/docs/sections/DocBuiltinMath.svelte';
  import DocBuiltinArray    from '$lib/components/docs/sections/DocBuiltinArray.svelte';
  import DocBuiltinDateTime from '$lib/components/docs/sections/DocBuiltinDateTime.svelte';
  import DocBuiltinRandom   from '$lib/components/docs/sections/DocBuiltinRandom.svelte';
  import DocBuiltinString   from '$lib/components/docs/sections/DocBuiltinString.svelte';
  import DocBuiltinNumber   from '$lib/components/docs/sections/DocBuiltinNumber.svelte';
  import DocBuiltinDix      from '$lib/components/docs/sections/DocBuiltinDix.svelte';

  let activeSection = 'intro';
  let sidebarOpen = false;

  function navigate(id: string): void {
    activeSection = id;
    sidebarOpen = false;
    if (browser) {
      window.scrollTo({ top: 0 });
      window.history.replaceState(null, '', `#${id}`);
    }
  }

  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (hash) activeSection = hash;
  });
</script>

<svelte:head>
  <title>DixScript Documentation</title>
  <meta name="description" content="Complete DixScript documentation — syntax, sections, types, built-in API, CLI reference and language bindings." />
</svelte:head>

<DocLayout bind:sidebarOpen>
  <svelte:fragment slot="sidebar">
    <DocSidebar
      {activeSection}
      on:navigate={(e) => navigate(e.detail)}
      on:close={() => (sidebarOpen = false)}
    />
  </svelte:fragment>

  <!-- Only the active section is rendered — Unity-style page swap -->
  {#if activeSection === 'intro'}
    <DocIntro />
  {:else if activeSection === 'quickstart'}
    <DocQuickStart />
  {:else if activeSection === 'types'}
    <DocTypes />
  {:else if activeSection === 'variables'}
    <DocVariables />
  {:else if activeSection === 'config'}
    <DocConfig />
  {:else if activeSection === 'enums'}
    <DocEnums />
  {:else if activeSection === 'data'}
    <DocData />
  {:else if activeSection === 'quickfuncs'}
    <DocQuickFuncs />
  {:else if activeSection === 'security'}
    <DocSecurity />
  {:else if activeSection === 'dlm'}
    <DocDLM />
  {:else if activeSection === 'imports'}
    <DocImports />
  {:else if activeSection === 'builtin-math'}
    <DocBuiltinMath />
  {:else if activeSection === 'builtin-array'}
    <DocBuiltinArray />
  {:else if activeSection === 'builtin-datetime'}
    <DocBuiltinDateTime />
  {:else if activeSection === 'builtin-random'}
    <DocBuiltinRandom />
  {:else if activeSection === 'builtin-string'}
    <DocBuiltinString />
  {:else if activeSection === 'builtin-number'}
    <DocBuiltinNumber />
  {:else if activeSection === 'builtin-dix'}
    <DocBuiltinDix />
  {:else if activeSection === 'cli'}
    <DocCLI />
  {:else if activeSection === 'ffi'}
    <DocFFI />
  {/if}
</DocLayout>

<!-- src/lib/routes/docs/+page.svelte -->
<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';

  import DocLayout    from '$lib/components/docs/DocLayout.svelte';
  import DocSidebar   from '$lib/components/docs/DocSidebar.svelte';

  import DocIntro           from '$lib/components/docs/sections/DocIntro.svelte';
  import DocQuickStart      from '$lib/components/docs/sections/DocQuickStart.svelte';
  import DocTypes           from '$lib/components/docs/sections/DocTypes.svelte';
  import DocVariables       from '$lib/components/docs/sections/DocVariables.svelte';
  import DocConfig          from '$lib/components/docs/sections/DocConfig.svelte';
  import DocEnums           from '$lib/components/docs/sections/DocEnums.svelte';
  import DocData            from '$lib/components/docs/sections/DocData.svelte';
  import DocQuickFuncs      from '$lib/components/docs/sections/DocQuickFuncs.svelte';
  import DocSecurity        from '$lib/components/docs/sections/DocSecurity.svelte';
  import DocDLM             from '$lib/components/docs/sections/DocDLM.svelte';
  import DocImports         from '$lib/components/docs/sections/DocImports.svelte';
  import DocCLI             from '$lib/components/docs/sections/DocCLI.svelte';
  import DocFFI             from '$lib/components/docs/sections/DocFFI.svelte';
  import DocRustApi         from '$lib/components/docs/sections/DocRustApi.svelte';
  import DocCSharpApi       from '$lib/components/docs/sections/DocCSharpApi.svelte';
  import DocGoApi           from '$lib/components/docs/sections/DocGoApi.svelte';
  import DocJavaApi         from '$lib/components/docs/sections/DocJavaApi.svelte';
  import DocPhpApi          from '$lib/components/docs/sections/DocPhpApi.svelte';
  import DocPythonApi       from '$lib/components/docs/sections/DocPythonApi.svelte';
  import DocWasmApi         from '$lib/components/docs/sections/DocWasmApi.svelte';
  import DocOdinApi         from '$lib/components/docs/sections/DocOdinApi.svelte';
  import DocBuiltinMath     from '$lib/components/docs/sections/DocBuiltinMath.svelte';
  import DocBuiltinArray    from '$lib/components/docs/sections/DocBuiltinArray.svelte';
  import DocBuiltinDateTime from '$lib/components/docs/sections/DocBuiltinDateTime.svelte';
  import DocBuiltinRandom   from '$lib/components/docs/sections/DocBuiltinRandom.svelte';
  import DocBuiltinString   from '$lib/components/docs/sections/DocBuiltinString.svelte';
  import DocBuiltinNumber   from '$lib/components/docs/sections/DocBuiltinNumber.svelte';
  import DocBuiltinRegex    from '$lib/components/docs/sections/DocBuiltinRegex.svelte';
  import DocBuiltinTuple    from '$lib/components/docs/sections/DocBuiltinTuple.svelte';
  import DocBuiltinBlob     from '$lib/components/docs/sections/DocBuiltinBlob.svelte';
  import DocBuiltinGuid     from '$lib/components/docs/sections/DocBuiltinGuid.svelte';
  import DocBuiltinIpAddress from '$lib/components/docs/sections/DocBuiltinIpAddress.svelte';
  import DocBuiltinUniversal from '$lib/components/docs/sections/DocBuiltinUniversal.svelte';
  import DocBuiltinDix      from '$lib/components/docs/sections/DocBuiltinDix.svelte';

  // activeSection may be compound — "rust-api--builder" — identifying both
  // which language doc page to show AND which sub-doc anchor inside it to
  // scroll to. DocSidebar gets the full compound value (it needs it to
  // highlight the exact sub-item); the {#if} chain below that picks which
  // section component to render only ever cares about the part before
  // "--", hence the derived activePage.
  let activeSection = 'intro';
  $: activePage = activeSection.split('--')[0];

  let sidebarOpen = false;

  async function scrollToTarget(id: string): Promise<void> {
    const [, subId] = id.split('--');
    await tick(); // wait for the {#if activePage === ...} block to mount
    if (subId) {
      const el = document.getElementById(subId);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }

  function navigate(id: string): void {
    activeSection = id;
    sidebarOpen = false;
    if (browser) {
      window.history.replaceState(null, '', `#${id}`);
      scrollToTarget(id);
    }
  }

  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      activeSection = hash;
      scrollToTarget(hash);
    }
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

  {#if activePage === 'intro'}
    <DocIntro />
  {:else if activePage === 'quickstart'}
    <DocQuickStart />
  {:else if activePage === 'types'}
    <DocTypes />
  {:else if activePage === 'variables'}
    <DocVariables />
  {:else if activePage === 'config'}
    <DocConfig />
  {:else if activePage === 'enums'}
    <DocEnums />
  {:else if activePage === 'data'}
    <DocData />
  {:else if activePage === 'quickfuncs'}
    <DocQuickFuncs />
  {:else if activePage === 'security'}
    <DocSecurity />
  {:else if activePage === 'dlm'}
    <DocDLM />
  {:else if activePage === 'imports'}
    <DocImports />
  {:else if activePage === 'builtin-math'}
    <DocBuiltinMath />
  {:else if activePage === 'builtin-array'}
    <DocBuiltinArray />
  {:else if activePage === 'builtin-datetime'}
    <DocBuiltinDateTime />
  {:else if activePage === 'builtin-random'}
    <DocBuiltinRandom />
  {:else if activePage === 'builtin-string'}
    <DocBuiltinString />
  {:else if activePage === 'builtin-number'}
    <DocBuiltinNumber />
  {:else if activePage === 'builtin-regex'}
    <DocBuiltinRegex />
  {:else if activePage === 'builtin-tuple'}
    <DocBuiltinTuple />
  {:else if activePage === 'builtin-blob'}
    <DocBuiltinBlob />
  {:else if activePage === 'builtin-guid'}
    <DocBuiltinGuid />
  {:else if activePage === 'builtin-ipaddress'}
    <DocBuiltinIpAddress />
  {:else if activePage === 'builtin-universal'}
    <DocBuiltinUniversal />
  {:else if activePage === 'builtin-dix'}
    <DocBuiltinDix />
  {:else if activePage === 'cli'}
    <DocCLI />
  {:else if activePage === 'ffi'}
    <DocFFI />
  {:else if activePage === 'rust-api'}
    <DocRustApi />
  {:else if activePage === 'csharp-api'}
    <DocCSharpApi />
  {:else if activePage === 'go-api'}
    <DocGoApi />
  {:else if activePage === 'java-api'}
    <DocJavaApi />
  {:else if activePage === 'php-api'}
    <DocPhpApi />
  {:else if activePage === 'python-api'}
    <DocPythonApi />
  {:else if activePage === 'wasm-api'}
    <DocWasmApi />
  {:else if activePage === 'odin-api'}
    <DocOdinApi />
  {/if}
</DocLayout>

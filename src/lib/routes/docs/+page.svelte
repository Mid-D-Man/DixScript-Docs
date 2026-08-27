<!-- src/lib/routes/docs/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
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
  import DocCSharpOverview         from '$lib/components/docs/sections/csharp/DocCSharpOverview.svelte';
  import DocCSharpInstall          from '$lib/components/docs/sections/csharp/DocCSharpInstall.svelte';
  import DocCSharpQuickStart       from '$lib/components/docs/sections/csharp/DocCSharpQuickStart.svelte';
  import DocCSharpErrorHandling    from '$lib/components/docs/sections/csharp/DocCSharpErrorHandling.svelte';
  import DocCSharpLoading          from '$lib/components/docs/sections/csharp/DocCSharpLoading.svelte';
  import DocCSharpReading          from '$lib/components/docs/sections/csharp/DocCSharpReading.svelte';
  import DocCSharpQuery            from '$lib/components/docs/sections/csharp/DocCSharpQuery.svelte';
  import DocCSharpDynamicAccess    from '$lib/components/docs/sections/csharp/DocCSharpDynamicAccess.svelte';
  import DocCSharpPoco             from '$lib/components/docs/sections/csharp/DocCSharpPoco.svelte';
  import DocCSharpBuilder          from '$lib/components/docs/sections/csharp/DocCSharpBuilder.svelte';
  import DocCSharpMerging          from '$lib/components/docs/sections/csharp/DocCSharpMerging.svelte';
  import DocCSharpSchemaValidation from '$lib/components/docs/sections/csharp/DocCSharpSchemaValidation.svelte';
  import DocCSharpFormatConversion from '$lib/components/docs/sections/csharp/DocCSharpFormatConversion.svelte';
  import DocCSharpMethodReference  from '$lib/components/docs/sections/csharp/DocCSharpMethodReference.svelte';
  import DocRustOverview          from '$lib/components/docs/sections/rust/DocRustOverview.svelte';
  import DocRustLoader            from '$lib/components/docs/sections/rust/DocRustLoader.svelte';
  import DocRustLoaderOptions     from '$lib/components/docs/sections/rust/DocRustLoaderOptions.svelte';
  import DocRustQuery             from '$lib/components/docs/sections/rust/DocRustQuery.svelte';
  import DocRustBuilder           from '$lib/components/docs/sections/rust/DocRustBuilder.svelte';
  import DocRustFormatConversion  from '$lib/components/docs/sections/rust/DocRustFormatConversion.svelte';
  import DocRustSchemaValidation  from '$lib/components/docs/sections/rust/DocRustSchemaValidation.svelte';
  import DocRustMerging           from '$lib/components/docs/sections/rust/DocRustMerging.svelte';
  import DocRustSerde             from '$lib/components/docs/sections/rust/DocRustSerde.svelte';
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

  // Every sidebar id — top-level or sub-doc ("rust-api--builder") — maps
  // to exactly one standalone component in the {#if} chain below. There's
  // no scroll-to-anchor step: each click swaps in a dedicated page, same
  // mechanism as any other top-level doc section, just one level deeper.
  let activeSection = 'intro';
  let sidebarOpen = false;

  function navigate(id: string): void {
    activeSection = id;
    sidebarOpen = false;
    if (browser) {
      window.history.replaceState(null, '', `#${id}`);
      window.scrollTo({ top: 0 });
    }
  }

  // Covers browser back/forward AND plain in-page `<a href="#some-id">`
  // links (e.g. the "Part of the Rust Runtime API" breadcrumbs on each
  // sub-doc page) — anything that changes the hash without going through
  // the sidebar's own navigate() call above.
  function onHashChange(): void {
    const hash = window.location.hash.slice(1);
    if (hash) {
      activeSection = hash;
      window.scrollTo({ top: 0 });
    }
  }

  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (hash) activeSection = hash;
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
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
  {:else if activeSection === 'builtin-regex'}
    <DocBuiltinRegex />
  {:else if activeSection === 'builtin-tuple'}
    <DocBuiltinTuple />
  {:else if activeSection === 'builtin-blob'}
    <DocBuiltinBlob />
  {:else if activeSection === 'builtin-guid'}
    <DocBuiltinGuid />
  {:else if activeSection === 'builtin-ipaddress'}
    <DocBuiltinIpAddress />
  {:else if activeSection === 'builtin-universal'}
    <DocBuiltinUniversal />
  {:else if activeSection === 'builtin-dix'}
    <DocBuiltinDix />
  {:else if activeSection === 'cli'}
    <DocCLI />
  {:else if activeSection === 'ffi'}
    <DocFFI />
  {:else if activeSection === 'rust-api'}
    <DocRustOverview />
  {:else if activeSection === 'rust-api--loader'}
    <DocRustLoader />
  {:else if activeSection === 'rust-api--loader-options'}
    <DocRustLoaderOptions />
  {:else if activeSection === 'rust-api--query'}
    <DocRustQuery />
  {:else if activeSection === 'rust-api--builder'}
    <DocRustBuilder />
  {:else if activeSection === 'rust-api--format-conversion'}
    <DocRustFormatConversion />
  {:else if activeSection === 'rust-api--schema-validation'}
    <DocRustSchemaValidation />
  {:else if activeSection === 'rust-api--merging'}
    <DocRustMerging />
  {:else if activeSection === 'rust-api--serde'}
    <DocRustSerde />
  {:else if activeSection === 'csharp-api'}
    <DocCSharpOverview />
  {:else if activeSection === 'csharp-api--install'}
    <DocCSharpInstall />
  {:else if activeSection === 'csharp-api--quickstart'}
    <DocCSharpQuickStart />
  {:else if activeSection === 'csharp-api--error-handling'}
    <DocCSharpErrorHandling />
  {:else if activeSection === 'csharp-api--loading'}
    <DocCSharpLoading />
  {:else if activeSection === 'csharp-api--reading'}
    <DocCSharpReading />
  {:else if activeSection === 'csharp-api--query'}
    <DocCSharpQuery />
  {:else if activeSection === 'csharp-api--dynamic-access'}
    <DocCSharpDynamicAccess />
  {:else if activeSection === 'csharp-api--poco'}
    <DocCSharpPoco />
  {:else if activeSection === 'csharp-api--builder'}
    <DocCSharpBuilder />
  {:else if activeSection === 'csharp-api--merging'}
    <DocCSharpMerging />
  {:else if activeSection === 'csharp-api--schema-validation'}
    <DocCSharpSchemaValidation />
  {:else if activeSection === 'csharp-api--format-conversion'}
    <DocCSharpFormatConversion />
  {:else if activeSection === 'csharp-api--method-reference'}
    <DocCSharpMethodReference />
  {:else if activeSection === 'go-api'}
    <DocGoApi />
  {:else if activeSection === 'java-api'}
    <DocJavaApi />
  {:else if activeSection === 'php-api'}
    <DocPhpApi />
  {:else if activeSection === 'python-api'}
    <DocPythonApi />
  {:else if activeSection === 'wasm-api'}
    <DocWasmApi />
  {:else if activeSection === 'odin-api'}
    <DocOdinApi />
  {/if}
</DocLayout>

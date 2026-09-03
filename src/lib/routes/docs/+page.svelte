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
  import DocCSharpEnumCodeGen      from '$lib/components/docs/sections/csharp/DocCSharpEnumCodeGen.svelte';
  import DocCSharpBuilder          from '$lib/components/docs/sections/csharp/DocCSharpBuilder.svelte';
  import DocCSharpMerging          from '$lib/components/docs/sections/csharp/DocCSharpMerging.svelte';
  import DocCSharpSchemaValidation from '$lib/components/docs/sections/csharp/DocCSharpSchemaValidation.svelte';
  import DocCSharpHotReload        from '$lib/components/docs/sections/csharp/DocCSharpHotReload.svelte';
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
  import DocRustHotReload         from '$lib/components/docs/sections/rust/DocRustHotReload.svelte';
  import DocGoOverview          from '$lib/components/docs/sections/go/DocGoOverview.svelte';
  import DocGoInstall           from '$lib/components/docs/sections/go/DocGoInstall.svelte';
  import DocGoQuickStart        from '$lib/components/docs/sections/go/DocGoQuickStart.svelte';
  import DocGoLoading           from '$lib/components/docs/sections/go/DocGoLoading.svelte';
  import DocGoReading           from '$lib/components/docs/sections/go/DocGoReading.svelte';
  import DocGoErrorHandling     from '$lib/components/docs/sections/go/DocGoErrorHandling.svelte';
  import DocGoBuilder           from '$lib/components/docs/sections/go/DocGoBuilder.svelte';
  import DocGoFormatConversion  from '$lib/components/docs/sections/go/DocGoFormatConversion.svelte';
  import DocGoQuery             from '$lib/components/docs/sections/go/DocGoQuery.svelte';
  import DocGoSchemaValidation  from '$lib/components/docs/sections/go/DocGoSchemaValidation.svelte';
  import DocGoMerging           from '$lib/components/docs/sections/go/DocGoMerging.svelte';
  import DocGoHotReload         from '$lib/components/docs/sections/go/DocGoHotReload.svelte';
  import DocGoPackageLayout     from '$lib/components/docs/sections/go/DocGoPackageLayout.svelte';
  import DocGoVsCSharp          from '$lib/components/docs/sections/go/DocGoVsCSharp.svelte';
  import DocJavaOverview         from '$lib/components/docs/sections/java/DocJavaOverview.svelte';
  import DocJavaInstall          from '$lib/components/docs/sections/java/DocJavaInstall.svelte';
  import DocJavaQuickStart       from '$lib/components/docs/sections/java/DocJavaQuickStart.svelte';
  import DocJavaFacade           from '$lib/components/docs/sections/java/DocJavaFacade.svelte';
  import DocJavaReading          from '$lib/components/docs/sections/java/DocJavaReading.svelte';
  import DocJavaErrorHandling    from '$lib/components/docs/sections/java/DocJavaErrorHandling.svelte';
  import DocJavaBuilder          from '$lib/components/docs/sections/java/DocJavaBuilder.svelte';
  import DocJavaFormatConversion from '$lib/components/docs/sections/java/DocJavaFormatConversion.svelte';
  import DocJavaQuery            from '$lib/components/docs/sections/java/DocJavaQuery.svelte';
  import DocJavaSchemaValidation from '$lib/components/docs/sections/java/DocJavaSchemaValidation.svelte';
  import DocJavaMerging          from '$lib/components/docs/sections/java/DocJavaMerging.svelte';
  import DocJavaHotReload        from '$lib/components/docs/sections/java/DocJavaHotReload.svelte';
  import DocJavaKotlin           from '$lib/components/docs/sections/java/DocJavaKotlin.svelte';
  import DocPhpOverview         from '$lib/components/docs/sections/php/DocPhpOverview.svelte';
  import DocPhpInstall          from '$lib/components/docs/sections/php/DocPhpInstall.svelte';
  import DocPhpQuickStart       from '$lib/components/docs/sections/php/DocPhpQuickStart.svelte';
  import DocPhpLoading          from '$lib/components/docs/sections/php/DocPhpLoading.svelte';
  import DocPhpReading          from '$lib/components/docs/sections/php/DocPhpReading.svelte';
  import DocPhpErrorHandling    from '$lib/components/docs/sections/php/DocPhpErrorHandling.svelte';
  import DocPhpResult           from '$lib/components/docs/sections/php/DocPhpResult.svelte';
  import DocPhpBuilder          from '$lib/components/docs/sections/php/DocPhpBuilder.svelte';
  import DocPhpFormatConversion from '$lib/components/docs/sections/php/DocPhpFormatConversion.svelte';
  import DocPhpTypes            from '$lib/components/docs/sections/php/DocPhpTypes.svelte';
  import DocPhpLifecycle        from '$lib/components/docs/sections/php/DocPhpLifecycle.svelte';
  import DocPythonOverview  from '$lib/components/docs/sections/python/DocPythonOverview.svelte';
  import DocPythonInstall   from '$lib/components/docs/sections/python/DocPythonInstall.svelte';
  import DocPythonQuickStart from '$lib/components/docs/sections/python/DocPythonQuickStart.svelte';
  import DocPythonResult    from '$lib/components/docs/sections/python/DocPythonResult.svelte';
  import DocPythonLoading   from '$lib/components/docs/sections/python/DocPythonLoading.svelte';
  import DocPythonReading   from '$lib/components/docs/sections/python/DocPythonReading.svelte';
  import DocPythonBuilder   from '$lib/components/docs/sections/python/DocPythonBuilder.svelte';
  import DocPythonMerger    from '$lib/components/docs/sections/python/DocPythonMerger.svelte';
  import DocPythonSchema    from '$lib/components/docs/sections/python/DocPythonSchema.svelte';
  import DocPythonQuery     from '$lib/components/docs/sections/python/DocPythonQuery.svelte';
  import DocPythonHotReload from '$lib/components/docs/sections/python/DocPythonHotReload.svelte';
  import DocPythonMlExtras  from '$lib/components/docs/sections/python/DocPythonMlExtras.svelte';
  import DocWasmOverview         from '$lib/components/docs/sections/wasm/DocWasmOverview.svelte';
  import DocWasmInstall          from '$lib/components/docs/sections/wasm/DocWasmInstall.svelte';
  import DocWasmQuickStart       from '$lib/components/docs/sections/wasm/DocWasmQuickStart.svelte';
  import DocWasmReading          from '$lib/components/docs/sections/wasm/DocWasmReading.svelte';
  import DocWasmResultPattern    from '$lib/components/docs/sections/wasm/DocWasmResultPattern.svelte';
  import DocWasmBuilder          from '$lib/components/docs/sections/wasm/DocWasmBuilder.svelte';
  import DocWasmFormatConversion from '$lib/components/docs/sections/wasm/DocWasmFormatConversion.svelte';
  import DocWasmQuery            from '$lib/components/docs/sections/wasm/DocWasmQuery.svelte';
  import DocWasmMerging          from '$lib/components/docs/sections/wasm/DocWasmMerging.svelte';
  import DocWasmSchemaValidation from '$lib/components/docs/sections/wasm/DocWasmSchemaValidation.svelte';
  import DocWasmHotReload        from '$lib/components/docs/sections/wasm/DocWasmHotReload.svelte';
  import DocWasmDlm              from '$lib/components/docs/sections/wasm/DocWasmDlm.svelte';
  import DocWasmCloudImports     from '$lib/components/docs/sections/wasm/DocWasmCloudImports.svelte';
  import DocOdinOverview    from '$lib/components/docs/sections/odin/DocOdinOverview.svelte';
  import DocOdinBuildLink   from '$lib/components/docs/sections/odin/DocOdinBuildLink.svelte';
  import DocOdinQuickStart  from '$lib/components/docs/sections/odin/DocOdinQuickStart.svelte';
  import DocOdinValueOk     from '$lib/components/docs/sections/odin/DocOdinValueOk.svelte';
  import DocOdinLoading     from '$lib/components/docs/sections/odin/DocOdinLoading.svelte';
  import DocOdinReading     from '$lib/components/docs/sections/odin/DocOdinReading.svelte';
  import DocOdinExport      from '$lib/components/docs/sections/odin/DocOdinExport.svelte';
  import DocOdinBuilder     from '$lib/components/docs/sections/odin/DocOdinBuilder.svelte';
  import DocOdinQuery       from '$lib/components/docs/sections/odin/DocOdinQuery.svelte';
  import DocOdinSchema      from '$lib/components/docs/sections/odin/DocOdinSchema.svelte';
  import DocOdinMerging     from '$lib/components/docs/sections/odin/DocOdinMerging.svelte';
  import DocOdinHotReload   from '$lib/components/docs/sections/odin/DocOdinHotReload.svelte';
  import DocOdinVsC         from '$lib/components/docs/sections/odin/DocOdinVsC.svelte';
  import DocCOverview          from '$lib/components/docs/sections/c/DocCOverview.svelte';
  import DocCBuildLink         from '$lib/components/docs/sections/c/DocCBuildLink.svelte';
  import DocCQuickStartC       from '$lib/components/docs/sections/c/DocCQuickStartC.svelte';
  import DocCQuickStartCpp     from '$lib/components/docs/sections/c/DocCQuickStartCpp.svelte';
  import DocCErrorHandling     from '$lib/components/docs/sections/c/DocCErrorHandling.svelte';
  import DocCReading           from '$lib/components/docs/sections/c/DocCReading.svelte';
  import DocCEncrypted         from '$lib/components/docs/sections/c/DocCEncrypted.svelte';
  import DocCBuilder           from '$lib/components/docs/sections/c/DocCBuilder.svelte';
  import DocCQuery             from '$lib/components/docs/sections/c/DocCQuery.svelte';
  import DocCMerging           from '$lib/components/docs/sections/c/DocCMerging.svelte';
  import DocCHotReload         from '$lib/components/docs/sections/c/DocCHotReload.svelte';
  import DocCFormatConversion  from '$lib/components/docs/sections/c/DocCFormatConversion.svelte';
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
  {:else if activeSection === 'rust-api--hot-reload'}
    <DocRustHotReload />
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
  {:else if activeSection === 'csharp-api--enum-codegen'}
    <DocCSharpEnumCodeGen />
  {:else if activeSection === 'csharp-api--builder'}
    <DocCSharpBuilder />
  {:else if activeSection === 'csharp-api--merging'}
    <DocCSharpMerging />
  {:else if activeSection === 'csharp-api--schema-validation'}
    <DocCSharpSchemaValidation />
  {:else if activeSection === 'csharp-api--hot-reload'}
    <DocCSharpHotReload />
  {:else if activeSection === 'csharp-api--format-conversion'}
    <DocCSharpFormatConversion />
  {:else if activeSection === 'csharp-api--method-reference'}
    <DocCSharpMethodReference />
  {:else if activeSection === 'go-api'}
    <DocGoOverview />
  {:else if activeSection === 'go-api--install'}
    <DocGoInstall />
  {:else if activeSection === 'go-api--quickstart'}
    <DocGoQuickStart />
  {:else if activeSection === 'go-api--loading'}
    <DocGoLoading />
  {:else if activeSection === 'go-api--reading'}
    <DocGoReading />
  {:else if activeSection === 'go-api--error-handling'}
    <DocGoErrorHandling />
  {:else if activeSection === 'go-api--builder'}
    <DocGoBuilder />
  {:else if activeSection === 'go-api--format-conversion'}
    <DocGoFormatConversion />
  {:else if activeSection === 'go-api--query'}
    <DocGoQuery />
  {:else if activeSection === 'go-api--schema-validation'}
    <DocGoSchemaValidation />
  {:else if activeSection === 'go-api--merging'}
    <DocGoMerging />
  {:else if activeSection === 'go-api--hot-reload'}
    <DocGoHotReload />
  {:else if activeSection === 'go-api--package-layout'}
    <DocGoPackageLayout />
  {:else if activeSection === 'go-api--vs-csharp'}
    <DocGoVsCSharp />
  {:else if activeSection === 'java-api'}
    <DocJavaOverview />
  {:else if activeSection === 'java-api--install'}
    <DocJavaInstall />
  {:else if activeSection === 'java-api--quickstart'}
    <DocJavaQuickStart />
  {:else if activeSection === 'java-api--facade'}
    <DocJavaFacade />
  {:else if activeSection === 'java-api--reading'}
    <DocJavaReading />
  {:else if activeSection === 'java-api--error-handling'}
    <DocJavaErrorHandling />
  {:else if activeSection === 'java-api--builder'}
    <DocJavaBuilder />
  {:else if activeSection === 'java-api--format-conversion'}
    <DocJavaFormatConversion />
  {:else if activeSection === 'java-api--query'}
    <DocJavaQuery />
  {:else if activeSection === 'java-api--schema-validation'}
    <DocJavaSchemaValidation />
  {:else if activeSection === 'java-api--merging'}
    <DocJavaMerging />
  {:else if activeSection === 'java-api--hot-reload'}
    <DocJavaHotReload />
  {:else if activeSection === 'java-api--kotlin'}
    <DocJavaKotlin />
  {:else if activeSection === 'php-api'}
    <DocPhpOverview />
  {:else if activeSection === 'php-api--install'}
    <DocPhpInstall />
  {:else if activeSection === 'php-api--quickstart'}
    <DocPhpQuickStart />
  {:else if activeSection === 'php-api--loading'}
    <DocPhpLoading />
  {:else if activeSection === 'php-api--reading'}
    <DocPhpReading />
  {:else if activeSection === 'php-api--error-handling'}
    <DocPhpErrorHandling />
  {:else if activeSection === 'php-api--result'}
    <DocPhpResult />
  {:else if activeSection === 'php-api--builder'}
    <DocPhpBuilder />
  {:else if activeSection === 'php-api--format-conversion'}
    <DocPhpFormatConversion />
  {:else if activeSection === 'php-api--types'}
    <DocPhpTypes />
  {:else if activeSection === 'php-api--lifecycle'}
    <DocPhpLifecycle />
  {:else if activeSection === 'python-api'}
    <DocPythonOverview />
  {:else if activeSection === 'python-api--install'}
    <DocPythonInstall />
  {:else if activeSection === 'python-api--quickstart'}
    <DocPythonQuickStart />
  {:else if activeSection === 'python-api--result'}
    <DocPythonResult />
  {:else if activeSection === 'python-api--loading'}
    <DocPythonLoading />
  {:else if activeSection === 'python-api--reading'}
    <DocPythonReading />
  {:else if activeSection === 'python-api--builder'}
    <DocPythonBuilder />
  {:else if activeSection === 'python-api--merger'}
    <DocPythonMerger />
  {:else if activeSection === 'python-api--schema'}
    <DocPythonSchema />
  {:else if activeSection === 'python-api--query'}
    <DocPythonQuery />
  {:else if activeSection === 'python-api--hot-reload'}
    <DocPythonHotReload />
  {:else if activeSection === 'python-api--ml-extras'}
    <DocPythonMlExtras />
  {:else if activeSection === 'wasm-api'}
    <DocWasmOverview />
  {:else if activeSection === 'wasm-api--install'}
    <DocWasmInstall />
  {:else if activeSection === 'wasm-api--quickstart'}
    <DocWasmQuickStart />
  {:else if activeSection === 'wasm-api--reading'}
    <DocWasmReading />
  {:else if activeSection === 'wasm-api--result-pattern'}
    <DocWasmResultPattern />
  {:else if activeSection === 'wasm-api--builder'}
    <DocWasmBuilder />
  {:else if activeSection === 'wasm-api--format-conversion'}
    <DocWasmFormatConversion />
  {:else if activeSection === 'wasm-api--query'}
    <DocWasmQuery />
  {:else if activeSection === 'wasm-api--merging'}
    <DocWasmMerging />
  {:else if activeSection === 'wasm-api--schema-validation'}
    <DocWasmSchemaValidation />
  {:else if activeSection === 'wasm-api--hot-reload'}
    <DocWasmHotReload />
  {:else if activeSection === 'wasm-api--dlm'}
    <DocWasmDlm />
  {:else if activeSection === 'wasm-api--cloud-imports'}
    <DocWasmCloudImports />
  {:else if activeSection === 'odin-api'}
    <DocOdinOverview />
  {:else if activeSection === 'odin-api--build-link'}
    <DocOdinBuildLink />
  {:else if activeSection === 'odin-api--quickstart'}
    <DocOdinQuickStart />
  {:else if activeSection === 'odin-api--value-ok'}
    <DocOdinValueOk />
  {:else if activeSection === 'odin-api--loading'}
    <DocOdinLoading />
  {:else if activeSection === 'odin-api--reading'}
    <DocOdinReading />
  {:else if activeSection === 'odin-api--export'}
    <DocOdinExport />
  {:else if activeSection === 'odin-api--builder'}
    <DocOdinBuilder />
  {:else if activeSection === 'odin-api--query'}
    <DocOdinQuery />
  {:else if activeSection === 'odin-api--schema'}
    <DocOdinSchema />
  {:else if activeSection === 'odin-api--merging'}
    <DocOdinMerging />
  {:else if activeSection === 'odin-api--hot-reload'}
    <DocOdinHotReload />
  {:else if activeSection === 'odin-api--vs-c'}
    <DocOdinVsC />
  {:else if activeSection === 'c-api'}
    <DocCOverview />
  {:else if activeSection === 'c-api--build-link'}
    <DocCBuildLink />
  {:else if activeSection === 'c-api--quickstart-c'}
    <DocCQuickStartC />
  {:else if activeSection === 'c-api--quickstart-cpp'}
    <DocCQuickStartCpp />
  {:else if activeSection === 'c-api--error-handling'}
    <DocCErrorHandling />
  {:else if activeSection === 'c-api--reading'}
    <DocCReading />
  {:else if activeSection === 'c-api--encrypted'}
    <DocCEncrypted />
  {:else if activeSection === 'c-api--builder'}
    <DocCBuilder />
  {:else if activeSection === 'c-api--query'}
    <DocCQuery />
  {:else if activeSection === 'c-api--merging'}
    <DocCMerging />
  {:else if activeSection === 'c-api--hot-reload'}
    <DocCHotReload />
  {:else if activeSection === 'c-api--format-conversion'}
    <DocCFormatConversion />
  {/if}
</DocLayout>

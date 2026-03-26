<script lang="ts">
  import { onMount } from 'svelte';

  import DocLayout    from '$lib/components/docs/DocLayout.svelte';
  import DocSidebar   from '$lib/components/docs/DocSidebar.svelte';

  import DocIntro       from '$lib/components/docs/sections/DocIntro.svelte';
  import DocQuickStart  from '$lib/components/docs/sections/DocQuickStart.svelte';
  import DocConfig      from '$lib/components/docs/sections/DocConfig.svelte';
  import DocEnums       from '$lib/components/docs/sections/DocEnums.svelte';
  import DocQuickFuncs  from '$lib/components/docs/sections/DocQuickFuncs.svelte';
  import DocData        from '$lib/components/docs/sections/DocData.svelte';
  import DocDLM         from '$lib/components/docs/sections/DocDLM.svelte';
  import DocSecurity    from '$lib/components/docs/sections/DocSecurity.svelte';
  import DocImports     from '$lib/components/docs/sections/DocImports.svelte';
  import DocVariables   from '$lib/components/docs/sections/DocVariables.svelte';
  import DocTypes       from '$lib/components/docs/sections/DocTypes.svelte';
  import DocCLI         from '$lib/components/docs/sections/DocCLI.svelte';
  import DocFFI         from '$lib/components/docs/sections/DocFFI.svelte';

  const sections = [
    { id: 'intro',      label: 'Introduction'      },
    { id: 'quickstart', label: 'Quick Start'        },
    { id: 'config',     label: '@CONFIG'            },
    { id: 'enums',      label: '@ENUMS'             },
    { id: 'quickfuncs', label: '@QUICKFUNCS'        },
    { id: 'data',       label: '@DATA'              },
    { id: 'dlm',        label: '@DLM'               },
    { id: 'security',   label: '@SECURITY'          },
    { id: 'imports',    label: '@IMPORTS'           },
    { id: 'variables',  label: 'Variables'          },
    { id: 'types',      label: 'Data Types'         },
    { id: 'cli',        label: 'CLI Reference'      },
    { id: 'ffi',        label: 'Language Bindings'  },
  ];

  let activeId = 'intro';

  function scrollToSection(id: string): void {
    activeId = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMount(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            activeId = e.target.id;
            break;
          }
        }
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );

    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
</script>

<svelte:head>
  <title>DixScript Documentation</title>
  <meta name="description" content="Complete DixScript documentation — syntax, sections, types, CLI reference and language bindings." />
</svelte:head>

<DocLayout>
  <svelte:fragment slot="sidebar">
    <DocSidebar
      {sections}
      {activeId}
      on:navigate={(e) => scrollToSection(e.detail)}
    />
  </svelte:fragment>

  <DocIntro />
  <DocQuickStart />
  <DocConfig />
  <DocEnums />
  <DocQuickFuncs />
  <DocData />
  <DocDLM />
  <DocSecurity />
  <DocImports />
  <DocVariables />
  <DocTypes />
  <DocCLI />
  <DocFFI />
</DocLayout>

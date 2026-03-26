<!-- src/lib/routes/docs/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  import DocLayout    from '$lib/components/docs/DocLayout.svelte';
  import DocSidebar   from '$lib/components/docs/DocSidebar.svelte';

  import DocIntro       from '$lib/components/docs/sections/DocIntro.svelte';
  import DocQuickStart  from '$lib/components/docs/sections/DocQuickStart.svelte';
  import DocTypes       from '$lib/components/docs/sections/DocTypes.svelte';
  import DocVariables   from '$lib/components/docs/sections/DocVariables.svelte';
  import DocConfig      from '$lib/components/docs/sections/DocConfig.svelte';
  import DocEnums       from '$lib/components/docs/sections/DocEnums.svelte';
  import DocData        from '$lib/components/docs/sections/DocData.svelte';
  import DocQuickFuncs  from '$lib/components/docs/sections/DocQuickFuncs.svelte';
  import DocSecurity    from '$lib/components/docs/sections/DocSecurity.svelte';
  import DocDLM         from '$lib/components/docs/sections/DocDLM.svelte';
  import DocImports     from '$lib/components/docs/sections/DocImports.svelte';
  import DocCLI         from '$lib/components/docs/sections/DocCLI.svelte';
  import DocFFI         from '$lib/components/docs/sections/DocFFI.svelte';

  // Section IDs in order
  const allSectionIds = [
    'intro', 'quickstart',
    'types', 'variables',
    'config', 'enums', 'data', 'quickfuncs', 'security', 'dlm', 'imports',
    'builtins-math', 'builtins-array', 'builtins-datetime',
    'builtins-random', 'builtins-string', 'builtins-number', 'builtins-dix',
    'cli', 'ffi',
  ];

  let activeId = 'intro';
  let sidebarOpen = false;

  function scrollToSection(id: string): void {
    activeId = id;
    sidebarOpen = false;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onMount(() => {
    const targets = allSectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          activeId = visible[0].target.id;
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    targets.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  // Built-in API data
  const mathMethods = [
    { name: 'Math.max(a, b)', returns: 'double', desc: 'Maximum of two numbers' },
    { name: 'Math.min(a, b)', returns: 'double', desc: 'Minimum of two numbers' },
    { name: 'Math.abs(x)', returns: 'double', desc: 'Absolute value' },
    { name: 'Math.sqrt(x)', returns: 'double', desc: 'Square root (x ≥ 0)' },
    { name: 'Math.pow(base, exp)', returns: 'double', desc: 'Base raised to power' },
    { name: 'Math.floor(x)', returns: 'int', desc: 'Round down to integer' },
    { name: 'Math.ceil(x)', returns: 'int', desc: 'Round up to integer' },
    { name: 'Math.round(x)', returns: 'int', desc: 'Round to nearest integer' },
    { name: 'Math.clamp(v, min, max)', returns: 'double', desc: 'Clamp value between bounds' },
    { name: 'Math.sign(x)', returns: 'int', desc: 'Sign: -1, 0, or 1' },
    { name: 'Math.sin(x)', returns: 'double', desc: 'Sine (radians)' },
    { name: 'Math.cos(x)', returns: 'double', desc: 'Cosine (radians)' },
    { name: 'Math.tan(x)', returns: 'double', desc: 'Tangent (radians)' },
    { name: 'Math.log(x)', returns: 'double', desc: 'Natural logarithm' },
    { name: 'Math.log10(x)', returns: 'double', desc: 'Base-10 logarithm' },
    { name: 'Math.exp(x)', returns: 'double', desc: 'e raised to x' },
    { name: 'Math.pi()', returns: 'double', desc: 'Pi constant (3.14159...)' },
    { name: 'Math.e()', returns: 'double', desc: 'Euler\'s number (2.71828...)' },
    { name: 'Math.radians(deg)', returns: 'double', desc: 'Degrees to radians' },
    { name: 'Math.degrees(rad)', returns: 'double', desc: 'Radians to degrees' },
  ];

  const arrayStaticMethods = [
    { name: 'Array.range(start, end)', returns: 'array', desc: 'Array of integers start..end inclusive' },
    { name: 'Array.fill(value, count)', returns: 'array', desc: 'Array of count copies of value' },
    { name: 'Array.empty()', returns: 'array', desc: 'Empty array' },
    { name: 'Array.of(v1, v2, ...)', returns: 'array', desc: 'Array from provided values' },
    { name: 'Array.concat(a1, a2, ...)', returns: 'array', desc: 'Concatenate multiple arrays' },
    { name: 'Array.sort(array)', returns: 'array', desc: 'Sorted copy of array' },
    { name: 'Array.reverse(array)', returns: 'array', desc: 'Reversed copy of array' },
    { name: 'Array.unique(array)', returns: 'array', desc: 'Deduplicated copy' },
    { name: 'Array.flatten(array)', returns: 'array', desc: 'Flatten one level deep' },
    { name: 'Array.slice(arr, start, end)', returns: 'array', desc: 'Extract sub-array' },
    { name: 'Array.contains(arr, val)', returns: 'bool', desc: 'True if value found' },
    { name: 'Array.indexOf(arr, val)', returns: 'int', desc: 'First index of value, -1 if absent' },
    { name: 'Array.sum(array)', returns: 'double', desc: 'Sum of numeric values' },
    { name: 'Array.average(array)', returns: 'double', desc: 'Average of numeric values' },
    { name: 'Array.min(array)', returns: 'double', desc: 'Minimum numeric value' },
    { name: 'Array.max(array)', returns: 'double', desc: 'Maximum numeric value' },
  ];

  const arrayInstanceMethods = [
    { name: '.length()', returns: 'int', desc: 'Number of elements' },
    { name: '.push(element)', returns: 'array', desc: 'New array with element appended' },
    { name: '.pop()', returns: 'array', desc: 'New array with last element removed' },
    { name: '.first()', returns: 'any', desc: 'First element' },
    { name: '.last()', returns: 'any', desc: 'Last element' },
    { name: '.get(index)', returns: 'any', desc: 'Element at index' },
    { name: '.contains(val)', returns: 'bool', desc: 'True if value present' },
    { name: '.indexOf(val)', returns: 'int', desc: 'Index of value or -1' },
    { name: '.join(sep)', returns: 'string', desc: 'Join elements with separator' },
    { name: '.reverse()', returns: 'array', desc: 'Reversed copy' },
    { name: '.sort()', returns: 'array', desc: 'Sorted copy' },
    { name: '.slice(start, end)', returns: 'array', desc: 'Sub-array' },
    { name: '.flatten()', returns: 'array', desc: 'Flattened one level' },
    { name: '.distinct()', returns: 'array', desc: 'Deduplicated copy' },
    { name: '.isEmpty()', returns: 'bool', desc: 'True if no elements' },
    { name: '.sum()', returns: 'double', desc: 'Sum of elements' },
  ];

  const dateTimeMethods = [
    { name: 'DateTime.now()', returns: 'timestamp', desc: 'Current UTC date and time' },
    { name: 'DateTime.today()', returns: 'date', desc: 'Today at midnight' },
    { name: 'DateTime.create(y, m, d)', returns: 'date', desc: 'Date from components' },
    { name: 'DateTime.parse(str)', returns: 'timestamp', desc: 'Parse ISO 8601 string' },
    { name: 'DateTime.format(dt, fmt)', returns: 'string', desc: 'Format with strftime pattern' },
    { name: 'DateTime.addDays(dt, n)', returns: 'timestamp', desc: 'Add n days' },
    { name: 'DateTime.addHours(dt, n)', returns: 'timestamp', desc: 'Add n hours' },
    { name: 'DateTime.subtract(dt1, dt2)', returns: 'double', desc: 'Difference in days' },
    { name: 'DateTime.isLeapYear(year)', returns: 'bool', desc: 'True if leap year' },
    { name: 'DateTime.year(dt)', returns: 'int', desc: 'Year component' },
    { name: 'DateTime.month(dt)', returns: 'int', desc: 'Month component (1-12)' },
    { name: 'DateTime.day(dt)', returns: 'int', desc: 'Day component (1-31)' },
  ];

  const randomMethods = [
    { name: 'Random.range(min, max)', returns: 'int', desc: 'Random integer min..max inclusive' },
    { name: 'Random.float()', returns: 'float', desc: 'Random float 0.0..1.0' },
    { name: 'Random.double()', returns: 'double', desc: 'Random double 0.0..1.0' },
    { name: 'Random.boolean()', returns: 'bool', desc: 'Random true or false' },
    { name: 'Random.choice(array)', returns: 'any', desc: 'Random element from array' },
    { name: 'Random.choices(array, n)', returns: 'array', desc: 'n random elements (with replacement)' },
    { name: 'Random.sample(array, n)', returns: 'array', desc: 'n random elements (no replacement)' },
    { name: 'Random.shuffle(array)', returns: 'array', desc: 'Shuffled copy of array' },
    { name: 'Random.alphanumeric(len)', returns: 'string', desc: 'Random alphanumeric string' },
    { name: 'Random.weighted(vals, wts)', returns: 'any', desc: 'Weighted random choice' },
  ];

  const stringMethods = [
    { name: '.length()', returns: 'int', desc: 'Character count' },
    { name: '.toUpper()', returns: 'string', desc: 'Uppercase copy' },
    { name: '.toLower()', returns: 'string', desc: 'Lowercase copy' },
    { name: '.trim()', returns: 'string', desc: 'Strip leading/trailing whitespace' },
    { name: '.contains(sub)', returns: 'bool', desc: 'True if substring present' },
    { name: '.startsWith(prefix)', returns: 'bool', desc: 'True if starts with prefix' },
    { name: '.endsWith(suffix)', returns: 'bool', desc: 'True if ends with suffix' },
    { name: '.replace(old, new)', returns: 'string', desc: 'Replace all occurrences' },
    { name: '.split(sep)', returns: 'array', desc: 'Split by separator' },
    { name: '.substring(start, len)', returns: 'string', desc: 'Extract substring' },
    { name: '.indexOf(sub)', returns: 'int', desc: 'Index of first match, -1 if absent' },
    { name: '.charAt(idx)', returns: 'string', desc: 'Character at index' },
    { name: '.padLeft(width, ch)', returns: 'string', desc: 'Left-pad to total width' },
    { name: '.padRight(width, ch)', returns: 'string', desc: 'Right-pad to total width' },
    { name: '.isEmpty()', returns: 'bool', desc: 'True if empty string' },
    { name: '.isBlank()', returns: 'bool', desc: 'True if empty or whitespace only' },
  ];

  const numberMethods = [
    { name: '.abs()', returns: 'same', desc: 'Absolute value' },
    { name: '.toString()', returns: 'string', desc: 'String representation' },
    { name: '.toInt()', returns: 'int', desc: 'Truncate to integer' },
    { name: '.toFloat()', returns: 'float', desc: 'Convert to float' },
    { name: '.toDouble()', returns: 'double', desc: 'Convert to double' },
    { name: '.round(places)', returns: 'same', desc: 'Round to decimal places' },
    { name: '.floor()', returns: 'int', desc: 'Round down' },
    { name: '.ceil()', returns: 'int', desc: 'Round up' },
    { name: '.sign()', returns: 'int', desc: '-1, 0, or 1' },
    { name: '.isNaN()', returns: 'bool', desc: 'True if Not a Number (float/double)' },
    { name: '.isFinite()', returns: 'bool', desc: 'True if not infinite (float/double)' },
    { name: '.isEven()', returns: 'bool', desc: 'True if even (int only)' },
    { name: '.isOdd()', returns: 'bool', desc: 'True if odd (int only)' },
  ];

  const dixMethods = [
    { name: 'Dix.Log(msg)', desc: 'Log at Info level' },
    { name: 'Dix.LogInfo(msg)', desc: 'Log informational message' },
    { name: 'Dix.LogWarning(msg)', desc: 'Log warning message' },
    { name: 'Dix.LogError(msg)', desc: 'Log error message' },
    { name: 'Dix.LogDebug(msg)', desc: 'Log debug message (debug mode only)' },
    { name: 'Dix.Assert(cond, msg)', desc: 'Throw error if condition is false' },
    { name: 'Dix.Print(msg)', desc: 'Print to console output' },
    { name: 'Dix.Format(fmt, ...)', desc: 'Format string with {0} placeholders' },
    { name: 'Dix.Join(sep, ...)', desc: 'Join values with separator' },
  ];
</script>

<svelte:head>
  <title>DixScript Documentation</title>
  <meta name="description" content="Complete DixScript documentation — syntax, sections, types, built-in API, CLI reference and language bindings." />
</svelte:head>

<DocLayout bind:sidebarOpen>
  <svelte:fragment slot="sidebar">
    <DocSidebar
      {activeId}
      on:navigate={(e) => scrollToSection(e.detail)}
    />
  </svelte:fragment>

  <!-- Getting Started -->
  <DocIntro />
  <DocQuickStart />

  <!-- Core Concepts -->
  <DocTypes />
  <DocVariables />

  <!-- File Sections -->
  <DocConfig />
  <DocEnums />
  <DocData />
  <DocQuickFuncs />
  <DocSecurity />
  <DocDLM />
  <DocImports />

  <!-- ── Built-in API ─────────────────────────────────────── -->

  <section id="builtins-math" class="doc-section">
    <h1 class="section-title">
      <span class="title-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.255 3A23.933 23.933 0 0 1 21 12c0 3.183-.62 6.22-1.745 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09"/>
        </svg>
      </span>
      Math
    </h1>
    <p class="section-intro">
      The <code>Math</code> static object provides common mathematical operations.
      All methods are called as <code>Math.methodName(args)</code>.
    </p>
    <pre><code>result = Math.clamp(health + regen, 0, maxHealth)
angle  = Math.atan2(dy, dx)
dist   = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))</code></pre>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          {#each mathMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td><code style="color: var(--primary)">{m.returns}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section id="builtins-array" class="doc-section">
    <h1 class="section-title">
      <span class="title-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"/>
        </svg>
      </span>
      Array
    </h1>
    <p class="section-intro">
      Array has both static constructor methods (<code>Array.range()</code>) and instance methods
      called on array values (<code>myArray.length()</code>).
    </p>

    <h2>Static Methods</h2>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          {#each arrayStaticMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td><code style="color: var(--primary)">{m.returns}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <h2>Instance Methods</h2>
    <p>Called on any array value: <code>myArray.push("item")</code></p>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          {#each arrayInstanceMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td><code style="color: var(--primary)">{m.returns}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section id="builtins-datetime" class="doc-section">
    <h1 class="section-title">
      <span class="title-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"/>
        </svg>
      </span>
      DateTime
    </h1>
    <p class="section-intro">
      The <code>DateTime</code> static object provides date and time creation, parsing, and arithmetic.
    </p>
    <pre><code>expiry  = DateTime.addDays(DateTime.today(), 30)
created = DateTime.format(DateTime.now(), "%Y-%m-%dT%H:%M:%SZ")</code></pre>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          {#each dateTimeMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td><code style="color: var(--primary)">{m.returns}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section id="builtins-random" class="doc-section">
    <h1 class="section-title">
      <span class="title-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"/>
        </svg>
      </span>
      Random
    </h1>
    <p class="section-intro">
      Provides random number generation, array sampling, and weighted selection.
      Uses a cryptographically seeded PRNG.
    </p>
    <pre><code>loot    = Random.weighted(items, weights)
token   = Random.alphanumeric(32)
enemies = Random.sample(spawnPool, 5)</code></pre>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          {#each randomMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td><code style="color: var(--primary)">{m.returns}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section id="builtins-string" class="doc-section">
    <h1 class="section-title">
      <span class="title-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
        </svg>
      </span>
      String Methods
    </h1>
    <p class="section-intro">
      Instance methods available on all <code>string</code> values.
      Called as <code>myString.methodName()</code>.
    </p>
    <pre><code>slug  = name.toLower().replace(" ", "-")
parts = csv.split(",")
safe  = input.trim().substring(0, 255)</code></pre>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          {#each stringMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td><code style="color: var(--primary)">{m.returns}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section id="builtins-number" class="doc-section">
    <h1 class="section-title">
      <span class="title-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"/>
        </svg>
      </span>
      Number Methods
    </h1>
    <p class="section-intro">
      Instance methods available on <code>int</code>, <code>float</code>, and <code>double</code> values.
    </p>
    <pre><code>display  = score.toString()
clamped  = damage.abs().toDouble()
parity   = index.isEven()</code></pre>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
        <tbody>
          {#each numberMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td><code style="color: var(--primary)">{m.returns}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section id="builtins-dix" class="doc-section">
    <h1 class="section-title">
      <span class="title-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"/>
        </svg>
      </span>
      Dix Utilities
    </h1>
    <p class="section-intro">
      The <code>Dix</code> static object provides logging, assertions, and string formatting utilities.
      These execute at compile time and are useful for debugging config generation.
    </p>
    <pre><code>Dix.Assert(port > 0, "Port must be positive")
Dix.Log(Dix.Format("Loading config for {0}", environment))
label = Dix.Join("-", prefix, name, version)</code></pre>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Method</th><th>Description</th></tr></thead>
        <tbody>
          {#each dixMethods as m}
            <tr>
              <td><code>{m.name}</code></td>
              <td style="color: var(--muted-foreground)">{m.desc}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div class="callout callout--info">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
      </svg>
      <span>Log output appears only in debug mode. Set <code>debug_mode -> "regular"</code> in <code>@CONFIG</code> to enable.</span>
    </div>
  </section>

  <!-- Tools -->
  <DocCLI />
  <DocFFI />

</DocLayout>

<style>
  /* Override section title h1 usage inside doc sections */
  :global(.doc-section h1.section-title) {
    font-family: var(--font-serif);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 0.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--border);
    line-height: 1.25;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  :global(.title-icon) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--primary);
    flex-shrink: 0;
  }
</style>

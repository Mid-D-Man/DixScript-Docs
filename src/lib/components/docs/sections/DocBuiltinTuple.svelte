<!-- src/lib/components/docs/sections/DocBuiltinTuple.svelte -->
<script lang="ts">
  const instanceMethods = [
    { name: '.length()',          returns: 'int',   desc: 'Number of elements in the tuple (1–6)' },
    { name: '.get(index)',        returns: 'any',   desc: 'Element at zero-based index (0–5)' },
    { name: '.first()',           returns: 'any',   desc: 'Element at index 0' },
    { name: '.second()',          returns: 'any',   desc: 'Element at index 1' },
    { name: '.third()',           returns: 'any',   desc: 'Element at index 2' },
    { name: '.fourth()',          returns: 'any',   desc: 'Element at index 3' },
    { name: '.fifth()',           returns: 'any',   desc: 'Element at index 4' },
    { name: '.sixth()',           returns: 'any',   desc: 'Element at index 5' },
    { name: '.contains(value)',   returns: 'bool',  desc: 'True if any element equals value' },
    { name: '.toArray()',         returns: 'array', desc: 'Convert tuple to an array' },
    { name: '.reverse()',         returns: 'tuple', desc: 'New tuple with elements in reverse order' },
    { name: '.swap(i1, i2)',      returns: 'tuple', desc: 'New tuple with elements at i1 and i2 swapped' },
  ];

  const usageExample = `@QUICKFUNCS(
  // Tuples work well for returning multiple values from a single function
  ~bounds<tuple>(values<array>) {
    return t:(Array.min(values), Array.max(values))
  }

  // Using named position accessors
  ~formatRange<string>(rng<tuple>) {
    let lo = rng.first()
    let hi = rng.second()
    return $"{lo.toString()} – {hi.toString()}"
  }

  // Accessing by index
  ~getThirdTag<string>(tags<tuple>) {
    return tags.length() >= 3 ? tags.third() : "none"
  }
)

@DATA(
  // All valid tuple forms (max 6 elements):
  point_2d   = t:(10, 20)
  point_3d   = t:(10, 20, 30)
  rgb_color  = t:(255, 128, 0)
  rgba_color = t:(255, 128, 0, 1.0f)
  meta       = t:("hero", 100, true, #FF0000)
  full       = t:(1, 2.5f, "text", true, #FF0000, null)   // exactly 6

  // Type annotation
  origin<tuple> = t:(0, 0, "centre")

  // Derived via QuickFunc
  score_range = bounds([12, 5, 99, 34, 7])
)`;
</script>

<div class="doc-page">
  <h1>Tuple Methods</h1>
  <p class="page-lead">
    Instance methods available on <code>tuple</code> values (constructed with <code>t:(…)</code>).
    Tuples hold up to <strong>six</strong> mixed-type elements. They are ideal for bundling
    a small, fixed group of related values — like a coordinate pair, an RGB colour, or
    a name-value-flag triplet — without the overhead of a named object.
  </p>

  <h2>Construction</h2>
  <pre><code>// Up to 6 elements, comma-separated, mixed types:
point   = t:(10, 20)
color   = t:(255, 128, 0, 1.0f)       // 4 elements
full    = t:(1, "a", true, 3.14, null, #FF0000)  // exactly 6 — maximum

// Type annotation:
pos<tuple> = t:(0, 0, "origin")</code></pre>

  <h2>Instance Methods</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each instanceMethods as m}
          <tr>
            <td><code>{m.name}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Usage Examples</h2>
  <pre><code>{usageExample}</code></pre>

  <h2>When to Use a Tuple vs an Object</h2>
  <p>
    Use a tuple when the number of elements is small, fixed, and the positional semantics
    are obvious (e.g. <code>t:(x, y)</code> for a 2D point). Use an object literal when
    you need named fields for clarity, or when the structure may grow. Tuples have no
    field names — accessing elements by <code>.first()</code> / <code>.second()</code>
    or <code>.get(0)</code> is the only way to read them.
  </p>
</div>

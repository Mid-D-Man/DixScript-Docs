<!-- src/lib/components/docs/sections/DocBuiltinRegex.svelte -->
<script lang="ts">
  const instanceMethods = [
    { name: '.test(text)',              returns: 'bool',   desc: 'True if the pattern matches anywhere in text' },
    { name: '.match(text)',             returns: 'array',  desc: 'First match + capture groups as array. Empty array if no match.' },
    { name: '.matchAll(text)',          returns: 'array',  desc: 'All matches, each as an array of [fullMatch, group1, group2…]' },
    { name: '.replace(text, replacement)', returns: 'string', desc: 'Replace all matches with the replacement string' },
    { name: '.split(text)',             returns: 'array',  desc: 'Split text by the pattern' },
    { name: '.isValid()',               returns: 'bool',   desc: 'True if the pattern itself is a valid regular expression' },
  ];

  const usageExample = `@QUICKFUNCS(
  ~validateEmail<bool>(email<string>) {
    let pattern<regex> = r:("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
    return pattern.test(email)
  }

  ~extractVersion<string>(input<string>) {
    let pattern<regex> = r:("(\\d+)\\.(\\d+)\\.(\\d+)")
    let groups = pattern.match(input)
    // groups[0] = full match, groups[1..3] = capture groups
    return groups.length() > 0 ? groups.get(0) : "unknown"
  }

  ~slugFromTitle<string>(title<string>) {
    let spaces<regex>  = r:("\\s+")
    let nonword<regex> = r:("[^a-z0-9-]")
    let lower = title.toLower()
    let dashed = spaces.replace(lower, "-")
    return nonword.replace(dashed, "")
  }
)

@DATA(
  // Regex as a stored value (for downstream validation use)
  email_pattern<regex> = r:("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
  phone_pattern<regex> = r:("^\\+?[0-9]{7,15}$")
  slug_pattern<regex>  = r:("^[a-z0-9-]+$")

  // Computed via QuickFunc
  is_valid_admin_email = validateEmail("admin@example.com")
)`;
</script>

<div class="doc-page">
  <h1>Regex Methods</h1>
  <p class="page-lead">
    Instance methods available on <code>regex</code> values (constructed with <code>r:("…")</code>).
    Regex values support pattern matching and string manipulation at compile time inside
    <code>@QUICKFUNCS</code>. They can also be stored in <code>@DATA</code> for downstream
    consumers to use at runtime.
  </p>

  <h2>Constructing a Regex</h2>
  <pre><code>// Regex literal using the r:() constructor:
email<regex>   = r:("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
digits<regex>  = r:("\\d+")     // double-backslash inside the string

// Inside a QuickFunc:
let pattern<regex> = r:("(\\w+)@(\\w+)\\.(\\w+)")</code></pre>

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

  <h2>Match Array Layout</h2>
  <p>
    <code>.match()</code> and <code>.matchAll()</code> return arrays where index <code>0</code>
    is always the full match and indices <code>1…n</code> are capture groups in the order
    they appear in the pattern. <code>null</code> is used for a capture group that did not
    participate in the match.
  </p>
  <pre><code>// Pattern with 3 capture groups:
let p = r:("(\\w+)@(\\w+)\\.(\\w+)")
let m = p.match("user@example.com")
// m[0] = "user@example.com"  (full match)
// m[1] = "user"              (group 1)
// m[2] = "example"           (group 2)
// m[3] = "com"               (group 3)</code></pre>
</div>

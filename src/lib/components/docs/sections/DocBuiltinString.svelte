<!-- src/lib/components/docs/sections/DocBuiltinString.svelte -->
<script lang="ts">
  const methods = [
    { name: '.length()',           returns: 'int',    desc: 'Character count' },
    { name: '.toUpper()',          returns: 'string', desc: 'Uppercase copy' },
    { name: '.toLower()',          returns: 'string', desc: 'Lowercase copy' },
    { name: '.trim()',             returns: 'string', desc: 'Strip leading/trailing whitespace' },
    { name: '.contains(sub)',      returns: 'bool',   desc: 'True if substring present' },
    { name: '.startsWith(prefix)', returns: 'bool',   desc: 'True if starts with prefix' },
    { name: '.endsWith(suffix)',   returns: 'bool',   desc: 'True if ends with suffix' },
    { name: '.replace(old, new)',  returns: 'string', desc: 'Replace all occurrences' },
    { name: '.split(sep)',         returns: 'array',  desc: 'Split by separator into array' },
    { name: '.substring(s, len)',  returns: 'string', desc: 'Extract len characters starting at s' },
    { name: '.indexOf(sub)',       returns: 'int',    desc: 'Index of first match, -1 if absent' },
    { name: '.lastIndexOf(sub)',   returns: 'int',    desc: 'Index of last match, -1 if absent' },
    { name: '.charAt(index)',      returns: 'string', desc: 'Character at index' },
    { name: '.padLeft(w, ch)',     returns: 'string', desc: 'Left-pad to total width w with character ch' },
    { name: '.padRight(w, ch)',    returns: 'string', desc: 'Right-pad to total width w with character ch' },
    { name: '.isEmpty()',          returns: 'bool',   desc: 'True if empty string' },
    { name: '.isBlank()',          returns: 'bool',   desc: 'True if empty or whitespace only' },
  ];
</script>

<div class="doc-page">
  <h1>String Methods</h1>
  <p class="page-lead">
    Instance methods available on all <code>string</code> values.
    Methods can be chained.
  </p>

  <pre><code>slug  = name.toLower().replace(" ", "-")
parts = csv.split(",")
safe  = input.trim().substring(0, 255)
hex   = id.padLeft(8, "0")</code></pre>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each methods as m}
          <tr>
            <td><code>{m.name}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

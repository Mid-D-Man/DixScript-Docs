<!-- src/lib/components/docs/sections/DocBuiltinArray.svelte -->
<script lang="ts">
  const staticMethods = [
    { name: 'Array.range(start, end)',    returns: 'array',  desc: 'Integers from start to end inclusive' },
    { name: 'Array.fill(value, count)',   returns: 'array',  desc: 'count copies of value' },
    { name: 'Array.empty()',              returns: 'array',  desc: 'Empty array []' },
    { name: 'Array.of(v1, v2, ...)',      returns: 'array',  desc: 'Array from provided values' },
    { name: 'Array.concat(a1, a2, ...)', returns: 'array',  desc: 'Concatenate multiple arrays' },
    { name: 'Array.sort(array)',          returns: 'array',  desc: 'Sorted copy' },
    { name: 'Array.reverse(array)',       returns: 'array',  desc: 'Reversed copy' },
    { name: 'Array.unique(array)',        returns: 'array',  desc: 'Deduplicated copy' },
    { name: 'Array.flatten(array)',       returns: 'array',  desc: 'Flatten one level deep' },
    { name: 'Array.slice(arr, s, e)',     returns: 'array',  desc: 'Sub-array from index s to e' },
    { name: 'Array.filter(arr, val)',     returns: 'array',  desc: 'Elements equal to val' },
    { name: 'Array.contains(arr, val)',   returns: 'bool',   desc: 'True if value found' },
    { name: 'Array.indexOf(arr, val)',    returns: 'int',    desc: 'First index, -1 if absent' },
    { name: 'Array.sum(array)',           returns: 'double', desc: 'Sum of numeric elements' },
    { name: 'Array.average(array)',       returns: 'double', desc: 'Average of numeric elements' },
    { name: 'Array.min(array)',           returns: 'double', desc: 'Minimum numeric element' },
    { name: 'Array.max(array)',           returns: 'double', desc: 'Maximum numeric element' },
  ];

  const instanceMethods = [
    { name: '.length()',       returns: 'int',    desc: 'Number of elements' },
    { name: '.push(element)',  returns: 'array',  desc: 'New array with element appended' },
    { name: '.pop()',          returns: 'array',  desc: 'New array with last element removed' },
    { name: '.shift()',        returns: 'array',  desc: 'New array with first element removed' },
    { name: '.unshift(val)',   returns: 'array',  desc: 'New array with element prepended' },
    { name: '.first()',        returns: 'any',    desc: 'First element' },
    { name: '.last()',         returns: 'any',    desc: 'Last element' },
    { name: '.get(index)',     returns: 'any',    desc: 'Element at index' },
    { name: '.contains(val)', returns: 'bool',   desc: 'True if value present' },
    { name: '.indexOf(val)',   returns: 'int',    desc: 'Index of first match or -1' },
    { name: '.join(sep)',      returns: 'string', desc: 'Join elements with separator' },
    { name: '.reverse()',      returns: 'array',  desc: 'Reversed copy' },
    { name: '.sort()',         returns: 'array',  desc: 'Sorted copy' },
    { name: '.slice(s, e)',    returns: 'array',  desc: 'Sub-array' },
    { name: '.flatten()',      returns: 'array',  desc: 'Flattened one level' },
    { name: '.distinct()',     returns: 'array',  desc: 'Deduplicated copy' },
    { name: '.isEmpty()',      returns: 'bool',   desc: 'True if no elements' },
    { name: '.sum()',          returns: 'double', desc: 'Sum of numeric elements' },
    { name: '.average()',      returns: 'double', desc: 'Average of numeric elements' },
    { name: '.max()',          returns: 'double', desc: 'Maximum numeric element' },
    { name: '.min()',          returns: 'double', desc: 'Minimum numeric element' },
  ];
</script>

<div class="doc-page">
  <h1>Array</h1>
  <p class="page-lead">
    Array has both static constructor methods (<code>Array.range()</code>) and
    instance methods called on array values (<code>myArray.length()</code>).
  </p>

  <h2>Static Methods</h2>
  <pre><code>nums     = Array.range(1, 10)
defaults = Array.fill(false, 8)
combined = Array.concat(weapons, armour)</code></pre>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each staticMethods as m}
          <tr>
            <td><code>{m.name}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Instance Methods</h2>
  <pre><code>tags    = rawTags.distinct().sort()
csv     = items.join(", ")
safe    = list.slice(0, 100)</code></pre>
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
</div>

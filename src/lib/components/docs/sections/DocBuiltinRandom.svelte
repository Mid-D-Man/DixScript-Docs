<!-- src/lib/components/docs/sections/DocBuiltinRandom.svelte -->
<script lang="ts">
  const methods = [
    { name: 'Random.range(min, max)',      returns: 'int',    desc: 'Random integer min..max inclusive' },
    { name: 'Random.float()',              returns: 'float',  desc: 'Random float 0.0..1.0' },
    { name: 'Random.double()',             returns: 'double', desc: 'Random double 0.0..1.0' },
    { name: 'Random.boolean()',            returns: 'bool',   desc: 'Random true or false' },
    { name: 'Random.floatRange(min, max)', returns: 'float',  desc: 'Random float in range' },
    { name: 'Random.doubleRange(min, max)',returns: 'double', desc: 'Random double in range' },
    { name: 'Random.choice(array)',        returns: 'any',    desc: 'Random element from array' },
    { name: 'Random.choices(array, n)',    returns: 'array',  desc: 'n random elements (with replacement)' },
    { name: 'Random.sample(array, n)',     returns: 'array',  desc: 'n random elements (no replacement)' },
    { name: 'Random.shuffle(array)',       returns: 'array',  desc: 'Shuffled copy of array' },
    { name: 'Random.bytes(count)',         returns: 'array',  desc: 'Array of random byte values (0–255)' },
    { name: 'Random.string(len, charset)', returns: 'string', desc: 'Random string from character set' },
    { name: 'Random.alphanumeric(len)',    returns: 'string', desc: 'Random A–Za–z0–9 string' },
    { name: 'Random.weighted(vals, wts)', returns: 'any',    desc: 'Weighted random choice' },
  ];
</script>

<div class="doc-page">
  <h1>Random</h1>
  <p class="page-lead">
    Random number generation, sampling, and weighted selection.
    Uses a cryptographically seeded PRNG.
  </p>

  <pre><code>loot    = Random.weighted(itemPool, dropWeights)
token   = Random.alphanumeric(32)
enemies = Random.sample(spawnPool, 5)
jitter  = Random.floatRange(-0.1, 0.1)</code></pre>

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

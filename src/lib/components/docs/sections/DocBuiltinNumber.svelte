<!-- src/lib/components/docs/sections/DocBuiltinNumber.svelte -->
<script lang="ts">
  const shared = [
    { method: '.abs()',         returns: 'same',   desc: 'Absolute value' },
    { method: '.toString()',    returns: 'string', desc: 'String representation' },
    { method: '.sign()',        returns: 'int',    desc: '-1, 0, or 1' },
  ];

  const floatDouble = [
    { method: '.toInt()',       returns: 'int',    desc: 'Truncate to integer (towards zero)' },
    { method: '.toFloat()',     returns: 'float',  desc: 'Convert to float' },
    { method: '.toDouble()',    returns: 'double', desc: 'Convert to double' },
    { method: '.round(places)', returns: 'same',   desc: 'Round to n decimal places' },
    { method: '.floor()',       returns: 'int',    desc: 'Round down' },
    { method: '.ceil()',        returns: 'int',    desc: 'Round up' },
    { method: '.isNaN()',       returns: 'bool',   desc: 'True if Not a Number' },
    { method: '.isFinite()',    returns: 'bool',   desc: 'True if not infinite and not NaN' },
    { method: '.isInfinity()',  returns: 'bool',   desc: 'True if infinite' },
  ];

  const intOnly = [
    { method: '.toFloat()',     returns: 'float',  desc: 'Convert to float' },
    { method: '.toDouble()',    returns: 'double', desc: 'Convert to double' },
    { method: '.isEven()',      returns: 'bool',   desc: 'True if divisible by 2' },
    { method: '.isOdd()',       returns: 'bool',   desc: 'True if not divisible by 2' },
    { method: '.isPositive()',  returns: 'bool',   desc: 'True if > 0' },
    { method: '.isNegative()',  returns: 'bool',   desc: 'True if < 0' },
  ];
</script>

<div class="doc-page">
  <h1>Number Methods</h1>
  <p class="page-lead">
    Instance methods available on <code>int</code>, <code>float</code>, and <code>double</code> values.
  </p>

  <pre><code>display = score.toString()
clamped = damage.abs()
parity  = index.isEven()
precise = ratio.round(4)</code></pre>

  <h2>Shared (int, float, double)</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each shared as m}
          <tr>
            <td><code>{m.method}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Float & Double Only</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each floatDouble as m}
          <tr>
            <td><code>{m.method}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Int Only</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each intOnly as m}
          <tr>
            <td><code>{m.method}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

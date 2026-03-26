<!-- src/lib/components/docs/sections/DocBuiltinMath.svelte -->
<script lang="ts">
  const methods = [
    { name: 'Math.max(a, b)',        returns: 'double', desc: 'Maximum of two numbers' },
    { name: 'Math.min(a, b)',        returns: 'double', desc: 'Minimum of two numbers' },
    { name: 'Math.abs(x)',           returns: 'double', desc: 'Absolute value' },
    { name: 'Math.sqrt(x)',          returns: 'double', desc: 'Square root (x must be ≥ 0)' },
    { name: 'Math.pow(base, exp)',   returns: 'double', desc: 'Base raised to power' },
    { name: 'Math.floor(x)',         returns: 'int',    desc: 'Round down to integer' },
    { name: 'Math.ceil(x)',          returns: 'int',    desc: 'Round up to integer' },
    { name: 'Math.round(x)',         returns: 'int',    desc: 'Round to nearest integer' },
    { name: 'Math.clamp(v, min, max)',returns:'double', desc: 'Clamp value between bounds' },
    { name: 'Math.sign(x)',          returns: 'int',    desc: '-1, 0, or 1' },
    { name: 'Math.sin(x)',           returns: 'double', desc: 'Sine (radians)' },
    { name: 'Math.cos(x)',           returns: 'double', desc: 'Cosine (radians)' },
    { name: 'Math.tan(x)',           returns: 'double', desc: 'Tangent (radians)' },
    { name: 'Math.log(x)',           returns: 'double', desc: 'Natural logarithm' },
    { name: 'Math.log10(x)',         returns: 'double', desc: 'Base-10 logarithm' },
    { name: 'Math.exp(x)',           returns: 'double', desc: 'e raised to the power of x' },
    { name: 'Math.pi()',             returns: 'double', desc: 'Pi constant (3.14159...)' },
    { name: 'Math.e()',              returns: 'double', desc: "Euler's number (2.71828...)" },
    { name: 'Math.radians(deg)',     returns: 'double', desc: 'Degrees to radians' },
    { name: 'Math.degrees(rad)',     returns: 'double', desc: 'Radians to degrees' },
    { name: 'Math.truncate(x)',      returns: 'int',    desc: 'Integer part (truncate towards zero)' },
    { name: 'Math.remainder(a, b)',  returns: 'double', desc: 'Remainder after division' },
  ];
</script>

<div class="doc-page">
  <h1>Math</h1>
  <p class="page-lead">
    Static mathematical functions. Called as <code>Math.methodName(args)</code>.
  </p>

  <pre><code>dist   = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
clamped = Math.clamp(health + regen, 0, maxHealth)
angle  = Math.degrees(Math.atan2(dy, dx))</code></pre>

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

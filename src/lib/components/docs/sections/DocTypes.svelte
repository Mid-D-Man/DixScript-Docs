<!-- src/lib/components/docs/sections/DocTypes.svelte -->
<script lang="ts">
  const types = [
    { type: 'int',       example: '42, -17, 0',                    desc: 'Signed 32-bit integer',                    ideal: 'Counts, ports, IDs, version numbers' },
    { type: 'float',     example: '3.14f, -2.5f, 42f',             desc: 'Single-precision — f suffix required',      ideal: 'Game physics, weights, factors where f suffix makes intent clear' },
    { type: 'double',    example: '3.14159, 2.718e10',              desc: 'Double-precision float',                   ideal: 'Scientific values, monetary ratios, coordinates' },
    { type: 'string',    example: '"hello", \'world\'',             desc: 'Double or single quoted',                  ideal: 'Names, URLs, messages, paths, labels' },
    { type: 'bool',      example: 'true, false',                    desc: 'Boolean',                                  ideal: 'Feature flags, enabled/disabled switches, SSL' },
    { type: 'hex',       example: '0xFF, 0xDEADBEEF',              desc: 'Hex integer literal',                      ideal: 'Bitmasks, memory addresses, raw byte values' },
    { type: 'hex color', example: '#FF5733, #F00, #FF5733CC',       desc: 'RGB or RGBA hex colour',                   ideal: 'Theme colours, UI palette, brand values' },
    { type: 'date',      example: '2025-01-15',                     desc: 'ISO 8601 date (no time component)',         ideal: 'Expiry dates, release dates, start/end dates' },
    { type: 'timestamp', example: '2025-01-15T10:30:00Z',           desc: 'ISO 8601 timestamp with optional TZ',      ideal: 'Created-at, updated-at, exact event times' },
    { type: 'blob',      example: 'b:("SGVsbG8=")',                 desc: 'Base64-encoded binary data',               ideal: 'Embedded certificates, icons, encrypted payloads, checksums' },
    { type: 'regex',     example: 'r:("^[a-z]+$")',                 desc: 'Regular expression pattern',               ideal: 'Validation rules, input patterns, routing patterns' },
    { type: 'tuple',     example: 't:(1, "text", true)',             desc: 'Mixed-type, up to 6 elements',             ideal: 'Bundling 2–6 related values without a named object' },
    { type: 'array',     example: '[1, 2, 3]',                      desc: 'Homogeneous array literal',                ideal: 'Lists of IDs, tags, allowed values, ordered sequences' },
    { type: 'object',    example: '{ id = 1, name = "x" }',         desc: 'Inline object literal',                    ideal: 'Structured sub-values, config blocks, return values from QuickFuncs' },
    { type: 'enum',      example: 'Status.ACTIVE',                  desc: 'Enum value reference — compile-time only', ideal: 'Discrete states, log levels, environments, rarities' },
    { type: 'null',      example: 'null',                           desc: 'Explicit null / absence of value',         ideal: 'Optional fields, unset markers, conditional presence' },
  ];

  const cmpRows = [
    { feature: 'Compile-time functions', json: false, yaml: false, toml: false, dix: true },
    { feature: 'Built-in encryption',    json: false, yaml: false, toml: false, dix: true },
    { feature: 'Built-in compression',   json: false, yaml: false, toml: false, dix: true },
    { feature: 'Enums / constants',      json: false, yaml: false, toml: false, dix: true },
    { feature: 'Comments',               json: false, yaml: true,  toml: true,  dix: true },
    { feature: 'Optional trailing comma',json: false, yaml: true,  toml: false, dix: true },
    { feature: 'Zero runtime deps',      json: true,  yaml: false, toml: true,  dix: true },
    { feature: 'Import system',          json: false, yaml: false, toml: false, dix: true },
    { feature: 'Blob / binary type',     json: false, yaml: false, toml: false, dix: true },
    { feature: 'Regex type',             json: false, yaml: false, toml: false, dix: true },
    { feature: 'Tuple type',             json: false, yaml: false, toml: false, dix: true },
    { feature: 'Date / Timestamp type',  json: false, yaml: true,  toml: true,  dix: true },
  ];

  const usageExample = `@DATA(
  // Practical examples of each type
  port<int>          = 8080
  ratio<float>       = 0.75f
  pi<double>         = 3.14159265358979
  name<string>       = "MyService"
  enabled<bool>      = true
  flags<hex>         = 0b00001111           // also valid: 0x0F
  brand<hex>         = #2D6A9F
  launch<date>       = 2025-06-01
  built<timestamp>   = 2025-01-15T08:00:00Z
  cert<blob>         = b:("LS0tLS1CRUdJTi==")
  email<regex>       = r:("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")
  origin<tuple>      = t:(0, 0, "centre")
  allowed_ids<array> = [1, 2, 3, 4, 5]
  server<object>     = { host = "localhost", port = 8080 }
  env<enum>          = Environment.PROD
  optional           = null
)`;
</script>

<div class="doc-page">
  <h1>Data Types</h1>
  <p class="page-lead">
    Types are inferred from the assigned value. Add explicit annotations
    (<code>&lt;int&gt;</code>, <code>&lt;float&gt;</code>, <code>&lt;enum&gt;</code> etc.)
    where you want the compiler to enforce a specific type. The table below shows each
    type, its syntax, and what it is best suited for.
  </p>

  <div class="table-scroll">
    <table>
      <thead>
        <tr><th>Type</th><th>Example</th><th>Description</th><th>Best for</th></tr>
      </thead>
      <tbody>
        {#each types as t}
          <tr>
            <td><code>{t.type}</code></td>
            <td><code style="color: var(--primary)">{t.example}</code></td>
            <td style="color: var(--muted-foreground)">{t.desc}</td>
            <td style="color: var(--muted-foreground); font-size:0.8125rem">{t.ideal}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Usage Examples</h2>
  <pre><code>{usageExample}</code></pre>

  <h2>Interpolated Strings</h2>
  <p>
    Strings prefixed with <code>$</code> support expression interpolation using
    <code>&#123;expression&#125;</code> syntax. Interpolated strings are fully
    evaluated at compile time.
  </p>
  <pre><code>@QUICKFUNCS(
  ~endpoint<string>(host<string>, port<int>) {
    return $"https://{host}:{port.toString()}/api"
  }
)</code></pre>

  <h2>Format Comparison</h2>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>JSON</th>
          <th>YAML</th>
          <th>TOML</th>
          <th class="th-dix">DixScript</th>
        </tr>
      </thead>
      <tbody>
        {#each cmpRows as row}
          <tr>
            <td style="font-weight:500">{row.feature}</td>
            <td class={row.json ? 'td-yes' : 'td-no'}>{row.json ? '✓' : '✗'}</td>
            <td class={row.yaml ? 'td-yes' : 'td-no'}>{row.yaml ? '✓' : '✗'}</td>
            <td class={row.toml ? 'td-yes' : 'td-no'}>{row.toml ? '✓' : '✗'}</td>
            <td class="td-dix {row.dix ? 'td-yes' : 'td-no'}">{row.dix ? '✓' : '✗'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

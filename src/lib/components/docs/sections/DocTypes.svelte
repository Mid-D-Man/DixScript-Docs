<!-- src/lib/components/docs/sections/DocTypes.svelte -->
<script lang="ts">
  const types = [
    { type: 'int',       example: '42, -17, 0',                desc: 'Signed 32-bit integer' },
    { type: 'float',     example: '3.14f, -2.5f, 42f',         desc: 'Single precision (f suffix required)' },
    { type: 'double',    example: '3.14159, 2.718e10',          desc: 'Double precision float' },
    { type: 'string',    example: '"hello", \'world\'',         desc: 'Double or single quoted' },
    { type: 'bool',      example: 'true, false',                desc: 'Boolean' },
    { type: 'hex',       example: '0xFF, 0xDEADBEEF',           desc: 'Hex integer literal' },
    { type: 'hex color', example: '#FF5733, #F00',              desc: 'RGB or RGBA hex color' },
    { type: 'date',      example: '2025-01-15',                 desc: 'ISO 8601 date' },
    { type: 'timestamp', example: '2025-01-15T10:30:00Z',       desc: 'ISO 8601 timestamp' },
    { type: 'blob',      example: 'b:("SGVsbG8=")',             desc: 'Base64 encoded binary' },
    { type: 'regex',     example: 'r:("^[a-z]+$")',             desc: 'Regular expression' },
    { type: 'tuple',     example: 't:(1, "text", true)',         desc: 'Mixed-type, up to 6 elements' },
    { type: 'array',     example: '[1, 2, 3]',                  desc: 'Homogeneous array literal' },
    { type: 'object',    example: '{ id = 1, name = "x" }',     desc: 'Inline object literal' },
    { type: 'enum',      example: 'Status.ACTIVE',              desc: 'Enum value reference' },
    { type: 'null',      example: 'null',                       desc: 'Null value' },
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
  ];
</script>

<div class="doc-page">
  <h1>Data Types</h1>
  <p class="page-lead">
    Types are inferred from the assigned value. Add explicit annotations
    (<code>&lt;int&gt;</code>, <code>&lt;float&gt;</code>, <code>&lt;enum&gt;</code>)
    where you want strictness enforced.
  </p>

  <div class="table-scroll">
    <table>
      <thead>
        <tr><th>Type</th><th>Example</th><th>Description</th></tr>
      </thead>
      <tbody>
        {#each types as t}
          <tr>
            <td><code>{t.type}</code></td>
            <td><code style="color: var(--primary)">{t.example}</code></td>
            <td style="color: var(--muted-foreground)">{t.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

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

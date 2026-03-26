<script lang="ts">
  const types = [
    { type: 'int',       example: '42, -17, 0',              desc: 'Signed 32-bit integer'         },
    { type: 'float',     example: '3.14f, -2.5f, 42f',       desc: 'Single precision (f suffix)'   },
    { type: 'double',    example: '3.14159, 2.718e10',        desc: 'Double precision float'        },
    { type: 'string',    example: '"hello", \'world\'',       desc: 'Double or single quoted'       },
    { type: 'bool',      example: 'true, false',              desc: 'Boolean'                       },
    { type: 'hex',       example: '0xFF, 0xDEADBEEF',         desc: 'Hex integer literal'           },
    { type: 'hex color', example: '#FF5733, #F00',            desc: 'RGB or RGBA hex color'         },
    { type: 'date',      example: '2025-01-15',               desc: 'ISO 8601 date'                 },
    { type: 'timestamp', example: '2025-01-15T10:30:00Z',     desc: 'ISO 8601 timestamp'            },
    { type: 'blob',      example: 'b:("SGVsbG8=")',           desc: 'Base64 encoded binary'         },
    { type: 'regex',     example: 'r:("^[a-z]+$")',           desc: 'Regular expression'            },
    { type: 'tuple',     example: 't:(1, "text", true)',       desc: 'Mixed-type, up to 4 elements' },
    { type: 'array',     example: '[1, 2, 3]',                desc: 'Homogeneous array'             },
    { type: 'object',    example: '{ id = 1, name = "x" }',   desc: 'Inline object literal'        },
    { type: 'enum',      example: 'Status.ACTIVE',            desc: 'Enum value reference'         },
    { type: 'null',      example: 'null',                     desc: 'Null value'                   },
  ];

  const cmpRows = [
    { feature: 'Compile-time functions', json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Built-in encryption',    json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Built-in compression',   json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Enums / constants',      json: false, yaml: false, toml: false, dix: true  },
    { feature: 'Comments',               json: false, yaml: true,  toml: true,  dix: true  },
    { feature: 'Optional trailing comma',json: false, yaml: true,  toml: false, dix: true  },
    { feature: 'Zero runtime deps',      json: true,  yaml: false, toml: true,  dix: true  },
    { feature: 'Import system',          json: false, yaml: false, toml: false, dix: true  },
  ];

  function cls(v: boolean): string { return v ? 'td-yes' : 'td-no'; }
  function txt(v: boolean): string { return v ? '✓'     : '✗';     }
</script>

<section id="types" class="doc-section">
  <h2>Data Types</h2>
  <p>
    Types are inferred from the assigned value. Add explicit annotations
    (<code>&lt;int&gt;</code>, <code>&lt;float&gt;</code>, <code>&lt;enum&gt;</code>)
    where you want strictness.
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

  <h3>Format comparison</h3>
  <div class="table-scroll">
    <table>
      <thead>
        <tr>
          <th>Feature</th>
          <th>JSON</th><th>YAML</th><th>TOML</th>
          <th class="th-dix">DixScript</th>
        </tr>
      </thead>
      <tbody>
        {#each cmpRows as row}
          <tr>
            <td class="td-feature">{row.feature}</td>
            <td class={cls(row.json)}>{txt(row.json)}</td>
            <td class={cls(row.yaml)}>{txt(row.yaml)}</td>
            <td class={cls(row.toml)}>{txt(row.toml)}</td>
            <td class="td-dix {cls(row.dix)}">{txt(row.dix)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

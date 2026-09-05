<!-- src/lib/components/docs/sections/go/DocGoReading.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const readApi = `s, err   := db.GetString("path")
i, err   := db.GetInt("path")
f32, err := db.GetFloat32("path")
f64, err := db.GetFloat64("path")
b, err   := db.GetBool("path")

// Special types
color, err := db.GetHexColor("primary_color")   // -> HexColor{R,G,B,A float32}
blob,  err := db.GetBlob("icon_data")            // -> Blob; call .Bytes()
re,    err := db.GetRegex("validation_pattern")  // -> MdixRegex; call .Compile()
date,  err := db.GetDate("release_date")         // -> MdixDate{Value time.Time}
ts,    err := db.GetTimestamp("created_at")      // -> MdixTimestamp{Value time.Time}

// Enums
name,  err := db.GetEnumName("ai_type")   // -> "AIType"
field, err := db.GetEnumField("ai_type")  // -> "BOSS"
val,   err := db.GetEnumValue("ai_type")  // -> 2 (resolved int)

// Introspection
typ      := db.ValueTypeAt("path")   // -> dixscript.TypeInt, TypeString, ...
ok       := db.Exists("path")        // -> bool
n, err   := db.ArrayLength("path")
keys, err := db.Keys("")             // top-level keys ("" = no prefix filter)`;
</script>

<div class="doc-page">
  <h1>Reading Values</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={readApi} lang="go" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'GetString/Int/Int32/Int64/Float32/Float64/Bool(path)', d: 'Typed getters, return (value, error).' },
          { m: 'GetHexColor/GetBlob/GetRegex/GetDate/GetTimestamp(path)', d: 'Special-type getters, each returning its own wrapper type.' },
          { m: 'GetEnumName/GetEnumField/GetEnumValue(path)',           d: 'Enum type name / field name / resolved integer value.' },
          { m: 'ValueTypeAt(path)',                                     d: 'The stored type, e.g. TypeInt, TypeString.' },
          { m: 'Exists(path)',                                          d: 'True if a value exists at path.' },
          { m: 'ArrayLength(path)',                                     d: 'Number of elements at an array path.' },
          { m: 'Keys(prefix)',                                          d: 'Direct child keys under prefix (top level if empty).' },
          { m: 'SourcePath() / EntryCount() / IsValid() / Close()',      d: 'Metadata and lifecycle.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

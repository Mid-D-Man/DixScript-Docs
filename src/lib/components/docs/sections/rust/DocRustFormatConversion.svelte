<!-- src/lib/components/docs/sections/rust/DocRustFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const exampleMdix = `@CONFIG(
  version -> "1.0.0"
)

@DATA(
  name = "MyApp"
  port<int> = 8080
)`;

  const converterApi = `use dixscript::Runtime::{DixConverter, DixFormatOptions};
use std::collections::HashMap;

fn converter_examples() -> Result<(), String> {
    let converter = DixConverter::new();

    // --- HashMap -> AST -> .mdix text ---
    let mut data = HashMap::new();
    data.insert("port".into(),    dixscript::Runtime::DixValue::Int(8080));
    data.insert("host".into(),    dixscript::Runtime::DixValue::String("localhost".into()));
    data.insert("debug".into(),   dixscript::Runtime::DixValue::Bool(false));

    let ast  = converter.from_hashmap(data)?;
    let mdix = converter.to_mdix(&ast, None)?;
    println!("{}", mdix);

    // --- AST -> JSON ---
    let json_pretty  = converter.to_json(&ast, true)?;
    let json_compact = converter.to_json(&ast, false)?;

    // --- JSON string -> AST ---
    let json_input = r#"{"port": 8080, "host": "localhost"}"#;
    let from_json  = converter.from_json(json_input)?;

    // --- AST -> TOML ---
    let toml = converter.to_toml(&ast)?;

    // --- TOML string -> AST ---
    let toml_input = "port = 8080\nhost = \"localhost\"";
    let from_toml  = converter.from_toml(toml_input)?;

    // --- Custom format options ---
    let opts_pretty   = DixFormatOptions::pretty();
    let opts_minified = DixFormatOptions::minified();
    let opts_compact  = DixFormatOptions::compact();

    let styled = converter.to_mdix(&ast, Some(&opts_pretty))?;
    Ok(())
}`;

  const formatOptionsApi = `use dixscript::Runtime::DixFormatOptions;

fn format_options_reference() {
    // Built-in presets:
    let default   = DixFormatOptions::new();
    let pretty    = DixFormatOptions::pretty();
    let compact   = DixFormatOptions::compact();
    let minified  = DixFormatOptions::minified();

    // Manual construction:
    let custom = DixFormatOptions {
        indented:                true,
        indent_size:             2,
        use_tabs:                false,
        minify:                  false,
        include_comments:        true,
        sort_keys:               false,
        include_type_annotations:false,
        escape_unicode:          false,
        max_line_length:         0,
        include_config_section:  true,
        include_version:         true,
    };

    println!("{:?}", custom.get_indentation(1)); // "  "
    println!("{:?}", custom.get_indentation(2)); // "    "
    println!("{:?}", custom.get_newline());       // "\\n"
    println!("{:?}", custom.get_space());         // " "
}`;

  const compactorApi = `use dixscript::Runtime::DixCompactor;

fn compactor_examples() {
    // Same source as the example .mdix file above, just inlined
    let source = r#"
        // This is a comment
        @CONFIG(
          version -> "1.0.0"
        )

        @DATA(
          name = "MyApp"
          port = 8080
        )
    "#;

    let minified    = DixCompactor::minify(source);
    let compacted   = DixCompactor::compact(source);
    let no_comments = DixCompactor::remove_comments(source);

    let ratio = DixCompactor::get_compression_ratio(source, &minified);
    println!("Minified by {:.1}%", ratio * 100.0);
}`;
</script>

<div class="doc-page">
  <h1>DixConverter — Format Conversion</h1>
  <p class="page-lead">
    Part of the <a href="#rust-api">Rust Runtime API</a>. Converts between
    the DixScript AST, <code>.mdix</code> text, JSON, and TOML — plus
    minification via <code>DixCompactor</code>.
  </p>

  <h2>Example .mdix file</h2>
  <p>The source every snippet on this page round-trips through.</p>
  <CodeBlock code={exampleMdix} lang="dixscript" />

  <CodeBlock code={converterApi} lang="rust" />

  <h2>DixFormatOptions — Controlling Output</h2>
  <CodeBlock code={formatOptionsApi} lang="rust" />

  <h2>DixCompactor — Minification</h2>
  <CodeBlock code={compactorApi} lang="rust" />

  <div class="tip-callout">
    <strong>Converting vs minifying vs compacting</strong>
    <ul>
      <li><strong>Use <code>DixConverter</code></strong> when you're changing <em>format</em> — DixScript to/from JSON or TOML, or re-serializing an AST with different <code>DixFormatOptions</code>.</li>
      <li><strong>Use <code>DixCompactor::minify</code></strong> for output a machine reads (shipped config, wire transfer) where every byte counts and no human ever opens the file directly.</li>
      <li><strong>Use <code>DixCompactor::remove_comments</code></strong> alone when you want smaller output that a human might still read occasionally — it strips comments but keeps the formatting readable, unlike full minification.</li>
      <li><strong>Avoid <code>to_json</code> as a general serialization format for round-tripping DixScript data</strong> — JSON has no <code>Long</code>/<code>Date</code>/<code>HexColor</code>/<code>Enum</code> types, so a JSON round-trip loses type information that <code>to_mdix</code> preserves exactly. Use JSON for interop with something outside the DixScript ecosystem, not as a save format for data you'll load back with <code>DixLoader</code>.</li>
    </ul>
  </div>

  <h2>Method Reference</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'DixConverter::new()',              d: 'Create a converter instance.' },
          { m: '.from_hashmap(map)',               d: 'Build an AST from a HashMap<String, DixValue>.' },
          { m: '.to_mdix(&ast, opts)',              d: 'Serialize an AST to .mdix source text. opts: Option<&DixFormatOptions>, None uses the default style.' },
          { m: '.to_json(&ast, pretty)',            d: 'Serialize an AST to a JSON string. pretty: bool.' },
          { m: '.from_json(json_str)',              d: 'Parse a JSON string into an AST.' },
          { m: '.to_toml(&ast)',                    d: 'Serialize an AST to a TOML string.' },
          { m: '.from_toml(toml_str)',              d: 'Parse a TOML string into an AST.' },
          { m: 'DixFormatOptions::new/pretty/compact/minified()', d: 'Built-in formatting presets — construct the struct directly for custom combinations.' },
          { m: 'opts.get_indentation(depth)',       d: 'Compute the indentation string for a given nesting depth under these options.' },
          { m: 'opts.get_newline() / get_space()',  d: 'Newline/space strings — empty under minified options, normal otherwise.' },
          { m: 'DixCompactor::minify(source)',      d: 'Strip all unnecessary whitespace and comments. Smallest possible output.' },
          { m: 'DixCompactor::compact(source)',     d: 'Trailing whitespace removed, blank lines collapsed — comments kept.' },
          { m: 'DixCompactor::remove_comments(source)', d: 'Strip comments only, formatting otherwise unchanged.' },
          { m: 'DixCompactor::get_compression_ratio(before, after)', d: 'Fraction of size reduced — 0.68 means 68% smaller.' },
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

<style>
  .tip-callout {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 0.875rem 1.125rem;
    margin: 1.25rem 0;
    font-size: 0.875rem;
  }
  .tip-callout strong { color: var(--foreground); }
  .tip-callout ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
  .tip-callout li { margin-bottom: 0.5rem; color: var(--muted-foreground); line-height: 1.6; }
  .tip-callout li:last-child { margin-bottom: 0; }
  .tip-callout code { font-size: 0.8125rem; }
</style>

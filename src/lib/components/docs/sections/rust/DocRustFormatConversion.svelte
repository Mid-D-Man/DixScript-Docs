<!-- src/lib/components/docs/sections/rust/DocRustFormatConversion.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

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

  <CodeBlock code={converterApi} lang="rust" />

  <h2>DixFormatOptions — Controlling Output</h2>
  <CodeBlock code={formatOptionsApi} lang="rust" />

  <h2>DixCompactor — Minification</h2>
  <CodeBlock code={compactorApi} lang="rust" />
</div>

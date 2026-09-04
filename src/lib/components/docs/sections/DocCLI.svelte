<!-- src/lib/components/docs/sections/DocCLI.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const validateCmds = `# Validate syntax and semantics without producing output
mdix validate config.mdix
mdix validate --strict config.mdix       # treat warnings as errors (exit 1)
mdix validate --quiet  config.mdix       # suppress all output, exit code only
mdix validate --json   config.mdix       # machine-readable JSON on stdout`;

  const compileCmds = `# Compile through the full pipeline including @DLM
mdix compile config.mdix
mdix compile config.mdix -o ./dist       # specify output directory
mdix compile config.mdix --skip-dlm      # skip compression / encryption
mdix compile secrets.mdix --password     # supply password for DLM password mode`;

  const decryptCmds = `# Decrypt a .mdix.enc file
mdix decrypt secrets.mdix.enc                            # auto-detect key file
mdix decrypt secrets.mdix.enc --key /vault/secrets.mdix.key
mdix decrypt secrets.mdix.enc --password "mypassword"    # inline value (avoid in prod)
mdix decrypt secrets.mdix.enc --password-prompt          # force an interactive prompt
mdix decrypt secrets.mdix.enc -o ./output                # output directory

# --password and --password-prompt conflict — pass only one. With neither,
# MDIX_DLM_PASSWORD is checked first, then the tool prompts interactively.`;

  const convertCmds = `# Convert between .mdix and other formats
mdix convert config.mdix --to json
mdix convert config.mdix --to json -o ./output/config.json
mdix convert config.mdix --to toml
mdix convert data.json --to dixscript
mdix convert data.json --to mdix               # 'mdix' and 'dixscript' are aliases
mdix convert config.toml --to mdix`;

  const mergeCmds = `# Merge two or more .mdix (or json/toml) sources into one file.
# Order matters: it's the tie-breaker for "weighted" strategy ties, and the
# sole rule for "primary" / "secondary".
mdix merge base.mdix overrides.mdix -o merged.mdix

# Strategy: weighted (default) | primary | secondary | throw
mdix merge base.mdix env.mdix local.mdix --strategy primary
mdix merge base.mdix overrides.mdix --strategy throw        # any conflict is an error

# Explicit weights (comma-separated, one per file) — only used by "weighted"
mdix merge base.mdix overrides.mdix --weights 1.0,0.5

# Array merge strategy for GroupArray / array-valued properties:
#   concat-dedup (default) | concat | replace
mdix merge base.mdix overrides.mdix --array-strategy concat

# Output format inferred from -o's extension, or --to if -o is omitted
mdix merge base.mdix overrides.mdix --to json -o merged.json

# Labels for conflict reports, and printing every resolved conflict
mdix merge base.mdix overrides.mdix --labels base,overrides --show-conflicts`;

  const diffCmds = `# Preview what a merge would need to resolve, without writing any output
mdix diff base.mdix overrides.mdix
mdix diff base.mdix env.mdix local.mdix              # 2+ files supported
mdix diff base.mdix overrides.mdix --labels base,overrides
mdix diff base.mdix overrides.mdix --fail-on-conflict  # non-zero exit if any conflict found (CI)`;

  const auditCmds = `# Inspect a .mdix.au audit trail file — written automatically by
# 'compile' alongside its output
mdix audit info config.mdix.au           # header, entry count, latest compile status
mdix audit view config.mdix.au           # every recorded compilation entry
mdix audit view config.mdix.au -n 5      # only the last 5 entries
mdix audit archives config.mdix.au       # list rotated/archived audit files next to it`;

  const completionsCmds = `# Generate a shell completion script — redirect it to wherever your shell loads completions from
mdix completions bash       > /etc/bash_completion.d/mdix
mdix completions zsh        > ~/.zfunc/_mdix
mdix completions fish       > ~/.config/fish/completions/mdix.fish
mdix completions powershell > mdix.ps1
mdix completions elvish     > mdix.elv`;

  const createCmds = `# Scaffold a new .mdix file from a built-in template
mdix create config.mdix                         # basic template (default)
mdix create game.mdix --template advanced
mdix create secrets.mdix --template security
mdix create pipeline.mdix --template dlm
mdix create config.mdix --force                 # overwrite if exists`;

  const formatCmds = `# Format a .mdix file in-place
mdix format config.mdix
mdix format config.mdix --indent 4
mdix format config.mdix --tabs
mdix format config.mdix --check                 # exit 1 if not already formatted (CI)
mdix format config.mdix -o ./config.formatted.mdix`;

  const compactCmds = `# Compact / minify a .mdix file
mdix compact config.mdix                        # remove trailing whitespace, collapse blanks
mdix compact config.mdix --mode minify          # smallest possible output
mdix compact config.mdix --mode strip-comments  # remove comments only
mdix compact config.mdix --mode minify -o config.min.mdix
mdix compact config.mdix --ratio                # print size reduction`;

  const inspectCmds = `# Inspect the structure of a .mdix file
mdix inspect config.mdix
mdix inspect config.mdix --keys                 # list all data keys with types
mdix inspect config.mdix --sections             # section summary only
mdix inspect config.mdix --json`;

  const keyCmds = `# Key file management
mdix key generate --output config.mdix.key
mdix key generate --algorithm aes128 --output config.mdix.key
mdix key generate --algorithm chacha20
mdix key generate --password --output vault.mdix.key  # password-mode key

mdix key validate config.mdix.key
mdix key info    config.mdix.key
mdix key info --json config.mdix.key`;

  const configCmds = `# CLI preferences stored at ~/.dixscript/config.toml
mdix config list
mdix config get default_indent_size
mdix config set default_indent_size 4
mdix config set color_output false
mdix config set key_search_paths /etc/keys,/vault
mdix config reset default_indent_size   # reset one key to default
mdix config reset                       # reset all keys to defaults`;

  const debugCmds = `# [DEBUG] Print the full token stream — positions + section tags.
# Verifies @CONFIG tokens carry SectionId::Config and every section's
# tokens are correctly stamped. Use to tell tokenizer bugs from parser bugs.
mdix debug-tokens config.mdix
mdix debug-tokens config.mdix --section-filter DATA

# [DEBUG] Print the parsed (and optionally enhanced) AST
mdix debug-ast config.mdix
mdix debug-ast config.mdix --section DATA

# [DEBUG] Print the symbol table from semantic analysis — registered enums,
# QuickFuncs, @DATA variables, namespaces, and builtin statics.
mdix debug-symbols config.mdix
mdix debug-symbols config.mdix --section ENUMS
mdix debug-symbols config.mdix --section DATA --verbose`;

  const globalFlags = `# Global flags accepted by every command:
--verbose       # per-stage timing and extra detail
--quiet         # suppress all non-error output
--json          # machine-readable JSON on stdout (errors on stderr)
--no-color      # disable ANSI colour codes

# Examples combining global flags:
mdix --json  validate config.mdix
mdix --quiet compile  config.mdix -o ./dist
mdix --no-color inspect config.mdix`;

  const exitCodes = [
    { code: '0', meaning: 'Success' },
    { code: '1', meaning: 'Command failed (parse error, compile error, key error, etc.)' },
    { code: '2', meaning: 'File not found' },
    { code: '3', meaning: 'Invalid argument (e.g. file exists without --force, unknown mode)' },
    { code: '4', meaning: 'Unsupported format (convert --to xyz)' },
  ];

  const configKeys = [
    { key: 'default_output_directory', type: 'string', default: './output',    desc: 'Output directory when -o is not provided' },
    { key: 'default_indent_size',      type: 'int',    default: '2',           desc: 'Spaces per indent level' },
    { key: 'use_tabs',                 type: 'bool',   default: 'false',       desc: 'Use tabs instead of spaces' },
    { key: 'color_output',             type: 'bool',   default: 'true',        desc: 'Enable coloured terminal output' },
    { key: 'auto_find_key_files',      type: 'bool',   default: 'true',        desc: 'Search for .mdix.key next to .mdix.enc automatically' },
    { key: 'key_search_paths',         type: 'string', default: '(empty)',     desc: 'Extra directories to search for key files, comma-separated' },
    { key: 'pretty_print_json',        type: 'bool',   default: 'true',        desc: 'Pretty-print --json output' },
    { key: 'show_warnings',            type: 'bool',   default: 'true',        desc: 'Include warnings in command output' },
    { key: 'max_error_display',        type: 'int',    default: '50',          desc: 'Maximum errors shown before truncating' },
  ];

  const templates = [
    { name: 'basic',    desc: 'Minimal @CONFIG + @DATA. Good starting point for any config.' },
    { name: 'advanced', desc: 'Enums, QuickFuncs, multi-environment @DATA. Shows the full feature set.' },
    { name: 'security', desc: 'DEncryptor + @SECURITY block. Use for secrets and encrypted configs.' },
    { name: 'dlm',      desc: 'Full DLM pipeline with compression + encryption + @SECURITY.' },
  ];

  const jsonEnvelope = `// Every --json response follows this envelope:
{
  "success": true | false,
  "data": { ... },      // present on success
  "error": "..."        // present on failure
}

// Example: mdix --json validate config.mdix
{
  "success": true,
  "data": {
    "file": "config.mdix",
    "token_count": 142,
    "warning_count": 0,
    "warnings": [],
    "elapsed_ms": 3.4
  }
}

// Example: mdix --json compile config.mdix -o ./dist
{
  "success": true,
  "data": {
    "source_path": "config.mdix",
    "generated_files": ["config.mdix.enc", "config.mdix.key"],
    "original_size": 2048,
    "modules_applied": ["DCompressor.gzip", "DEncryptor.aes256"],
    "elapsed_ms": 12.1
  }
}`;

  const installCmd = `# Published on crates.io:
cargo install mdix-cli

# Or build from source:
git clone https://github.com/Mid-D-Man/DixScript-Rust
cd DixScript-Rust
cargo build -p mdix-cli --release
# binary at target/release/mdix`;
</script>

<div class="doc-page">
  <h1>CLI Reference</h1>
  <p class="page-lead">
    The <code>mdix</code> command-line tool. Feature-complete in the Rust core
    and published on crates.io — <code>validate</code>, <code>compile</code>,
    <code>decrypt</code>, <code>convert</code>, <code>merge</code>,
    <code>diff</code>, <code>create</code>, <code>format</code>,
    <code>compact</code>, <code>inspect</code>, <code>key</code>,
    <code>audit</code>, <code>config</code>, and <code>completions</code>,
    plus three development-only <code>debug-*</code> commands. Track build/test
    status on the <a href="/results">CI Results</a> page.
  </p>

  <h2>Installation</h2>
  <CodeBlock code={installCmd} lang="bash" />

  <h2>Global Flags</h2>
  <CodeBlock code={globalFlags} lang="bash" />

  <h2>Exit Codes</h2>
  <p>All commands use a consistent set of exit codes.</p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Code</th><th>Meaning</th></tr></thead>
      <tbody>
        {#each exitCodes as row}
          <tr>
            <td><code>{row.code}</code></td>
            <td style="color:var(--muted-foreground)">{row.meaning}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>validate</h2>
  <p>
    Run the full parse and semantic analysis pipeline. No output files are produced.
    Use in CI to confirm a file is correct before committing.
  </p>
  <CodeBlock code={validateCmds} lang="bash" />

  <h2>compile</h2>
  <p>
    Run the full compilation pipeline including <code>@DLM</code> modules.
    Produces <code>.mdix.enc</code> and <code>.mdix.key</code> when encryption is in the pipeline.
    The <code>MDIX_DLM_PASSWORD</code> environment variable can supply the password
    in non-interactive contexts.
  </p>
  <CodeBlock code={compileCmds} lang="bash" />

  <h2>decrypt</h2>
  <p>
    Reverse the DLM pipeline on a <code>.mdix.enc</code> file. The tool auto-detects the
    key file by looking for a <code>.mdix.key</code> with the same stem in the same directory.
    The <code>MDIX_DLM_PASSWORD</code> environment variable can supply the password instead
    of <code>--password</code>.
  </p>
  <CodeBlock code={decryptCmds} lang="bash" />

  <h2>convert</h2>
  <p>
    Convert between <code>.mdix</code> and other data formats. The source format is
    auto-detected from the file extension. Both <code>mdix</code> and <code>dixscript</code>
    are accepted as target format names for the native format.
  </p>
  <CodeBlock code={convertCmds} lang="bash" />

  <h2>merge</h2>
  <p>
    Merge two or more <code>.mdix</code> (or JSON/TOML) sources into one
    file. Order of the input files matters for every strategy except
    <code>weighted</code> with explicit <code>--weights</code>.
  </p>
  <CodeBlock code={mergeCmds} lang="bash" />

  <h2>diff</h2>
  <p>
    Preview exactly what <code>merge</code> would need to resolve, without
    writing any output — the same conflict-detection pass <code>merge</code>
    runs internally, surfaced on its own for a dry look before committing to
    a strategy.
  </p>
  <CodeBlock code={diffCmds} lang="bash" />

  <h2>create</h2>
  <p>Scaffold a new <code>.mdix</code> file from a built-in template.</p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Template</th><th>Description</th></tr></thead>
      <tbody>
        {#each templates as t}
          <tr>
            <td><code>{t.name}</code></td>
            <td style="color:var(--muted-foreground)">{t.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <CodeBlock code={createCmds} lang="bash" />

  <h2>format</h2>
  <p>
    Format a <code>.mdix</code> file in-place. The <code>--check</code> flag makes it
    non-destructive — useful in CI to enforce formatting without writing files.
  </p>
  <CodeBlock code={formatCmds} lang="bash" />

  <h2>compact</h2>
  <p>
    Reduce file size by removing whitespace or comments. Three modes are available.
  </p>
  <CodeBlock code={compactCmds} lang="bash" />

  <h2>inspect</h2>
  <p>Display the structure, sections, key count, and data keys of a <code>.mdix</code> file.</p>
  <CodeBlock code={inspectCmds} lang="bash" />

  <h2>key</h2>
  <p>
    Generate, validate, and inspect <code>.mdix.key</code> files. Key files generated
    with <code>key generate</code> are standalone — they are not tied to any specific
    source file. The compiler generates the production key file automatically during
    <code>compile</code>.
  </p>
  <CodeBlock code={keyCmds} lang="bash" />

  <h2>audit</h2>
  <p>
    Inspect a <code>.mdix.au</code> audit trail file — written automatically
    by <code>compile</code> alongside its output, one entry per compilation.
    Three subcommands: <code>info</code> (header, entry count, latest
    status), <code>view</code> (every recorded entry, optionally tailed with
    <code>-n</code>), and <code>archives</code> (rotated audit files sitting
    next to the live one).
  </p>
  <CodeBlock code={auditCmds} lang="bash" />

  <h2>config</h2>
  <p>
    Manage CLI preferences. Settings are stored at
    <code>~/.dixscript/config.toml</code> and applied to every subsequent command.
  </p>
  <CodeBlock code={configCmds} lang="bash" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Key</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        {#each configKeys as row}
          <tr>
            <td><code>{row.key}</code></td>
            <td style="color:var(--primary)">{row.type}</td>
            <td><code>{row.default}</code></td>
            <td style="color:var(--muted-foreground)">{row.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>completions</h2>
  <p>
    Generate a shell completion script from the CLI's own argument
    definitions — always in sync with the actual command set, since it's
    generated at build time rather than hand-maintained.
  </p>
  <CodeBlock code={completionsCmds} lang="bash" />

  <h2>debug-tokens / debug-ast / debug-symbols <span class="dev-badge">development</span></h2>
  <p>
    Three inspection commands for compiler development, not typical
    end-user workflows: dump the raw token stream, the parsed AST, or the
    symbol table produced by semantic analysis. Useful when diagnosing
    whether a bug is in the tokenizer, the parser, or semantic analysis.
  </p>
  <CodeBlock code={debugCmds} lang="bash" />

  <h2>JSON Output Envelope</h2>
  <p>
    All commands support <code>--json</code>. Successful results go to stdout inside a
    <code>data</code> field. Errors go to stderr inside an <code>error</code> field.
  </p>
  <CodeBlock code={jsonEnvelope} lang="json" />
</div>

<style>
  .dev-badge {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    background: rgba(160, 160, 160, 0.14);
    color: var(--muted-foreground);
    border: 1px solid rgba(160, 160, 160, 0.35);
    vertical-align: middle;
    margin-left: 0.4rem;
  }
</style>

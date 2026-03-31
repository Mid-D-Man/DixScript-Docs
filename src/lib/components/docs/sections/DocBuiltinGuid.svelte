<!-- src/lib/components/docs/sections/DocBuiltinGuid.svelte -->
<script lang="ts">
  const methods = [
    { name: 'Guid.new()',                  returns: 'string', desc: 'Generate a new random GUID (UUID v4 format)' },
    { name: 'Guid.parse(str)',             returns: 'string', desc: 'Parse a GUID from string — throws if invalid' },
    { name: 'Guid.tryParse(str)',          returns: 'string', desc: 'Parse a GUID, returns null if invalid' },
    { name: 'Guid.validate(str)',          returns: 'bool',   desc: 'True if the string is a valid GUID format' },
    { name: 'Guid.empty()',                returns: 'string', desc: 'Returns the empty GUID (all zeros)' },
    { name: 'Guid.format(str, fmt)',       returns: 'string', desc: 'Format a GUID string using a format specifier (N, D, B, P, X)' },
    { name: 'Guid.toBytes(str)',           returns: 'array',  desc: 'Convert a GUID to a 16-element byte array' },
    { name: 'Guid.fromBytes(array)',       returns: 'string', desc: 'Create a GUID from a 16-element byte array' },
  ];

  const formatTable = [
    { specifier: 'N', example: '550e8400e29b41d4a716446655440000',          desc: 'No hyphens (32 hex digits)' },
    { specifier: 'D', example: '550e8400-e29b-41d4-a716-446655440000',      desc: 'Standard hyphenated format (default)' },
    { specifier: 'B', example: '{550e8400-e29b-41d4-a716-446655440000}',    desc: 'Hyphenated with curly braces' },
    { specifier: 'P', example: '(550e8400-e29b-41d4-a716-446655440000)',    desc: 'Hyphenated with parentheses' },
    { specifier: 'X', example: '{0x550e8400,0xe29b,...}',                    desc: 'Hexadecimal integer groups' },
  ];

  const usageExample = `@QUICKFUNCS(
  // Generate a fresh GUID for each entity
  ~makeId<string>() {
    return Guid.new()
  }

  // Validate a caller-supplied ID before use
  ~validateEntityId<bool>(id<string>) {
    return Guid.validate(id)
  }

  // Normalise an ID to the compact format
  ~compactId<string>(id<string>) {
    let parsed = Guid.tryParse(id)
    if: parsed == null {
      return Guid.empty()
    } else {
      return Guid.format(parsed, "N")
    }
  }

  // Build an entity with a generated ID
  ~makeEntity<object>(name<string>, kind<string>) {
    return {
      id   = Guid.new()
      name = name
      kind = kind
    }
  }
)

@DATA(
  // Values are QuickFunc calls 
  session_id  = makeId()
  entity      = makeEntity("Player", "hero")
  
)`;

  const bytesExample = `@QUICKFUNCS(
  // Round-trip: GUID → bytes → GUID
  ~guidRoundTrip<string>(id<string>) {
    let bytes = Guid.toBytes(id)
    return Guid.fromBytes(bytes)
  }

  // Use byte representation for storage or hashing
  ~guidBytes<array>(id<string>) {
    return Guid.toBytes(id)
  }
)`;
</script>

<div class="doc-page">
  <h1>Guid</h1>
  <p class="page-lead">
    GUID (UUID v4) generation, parsing, validation, and formatting.
    Called as <code>Guid.methodName(args)</code> inside <code>@QUICKFUNCS</code>.
    GUIDs are returned as standard hyphenated strings unless a format specifier changes the output.
  </p>

  <h2>Methods</h2>
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

  <h2>Format Specifiers</h2>
  <p>The <code>Guid.format(str, fmt)</code> method accepts one of five single-letter specifiers.</p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Specifier</th><th>Example output</th><th>Description</th></tr></thead>
      <tbody>
        {#each formatTable as row}
          <tr>
            <td><code>{row.specifier}</code></td>
            <td><code style="font-size:0.75rem;color:var(--primary)">{row.example}</code></td>
            <td style="color:var(--muted-foreground)">{row.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Usage Inside @QUICKFUNCS</h2>
  <pre><code>{usageExample}</code></pre>

  <h2>Byte Conversion</h2>
  <p>
    <code>Guid.toBytes()</code> returns an array of exactly 16 integer values (0–255).
    <code>Guid.fromBytes()</code> requires exactly 16 elements — any other length is a compile error.
  </p>
  <pre><code>{bytesExample}</code></pre>

  <h2>Notes</h2>
  <p>
    <code>Guid.new()</code> uses a cryptographically seeded random source and produces
    a different value on every call. <code>Guid.empty()</code> always returns
    <code>"00000000-0000-0000-0000-000000000000"</code>. <code>Guid.tryParse()</code>
    is the safe variant — it returns <code>null</code> rather than throwing when the input
    is malformed, making it suitable for validating external data.
  </p>
</div>

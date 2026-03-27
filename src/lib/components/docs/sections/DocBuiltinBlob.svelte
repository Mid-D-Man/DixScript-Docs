<!-- src/lib/components/docs/sections/DocBuiltinBlob.svelte -->
<script lang="ts">
  const instanceMethods = [
    { name: '.size()',              returns: 'int',    desc: 'Size of the decoded binary data in bytes' },
    { name: '.mimeType()',          returns: 'string', desc: 'Detect MIME type from magic bytes (e.g. "image/png", "application/pdf")' },
    { name: '.toHex()',             returns: 'string', desc: 'Hex string representation of the binary data' },
    { name: '.toBytes()',           returns: 'array',  desc: 'Array of byte values (0–255)' },
    { name: '.isValid()',           returns: 'bool',   desc: 'True if the blob contains valid base64-encoded data' },
    { name: '.slice(start, end)',   returns: 'blob',   desc: 'Sub-blob from byte offset start to end (exclusive)' },
  ];

  // b\u003A is Unicode for b: — avoids esbuild treating it as a JS label inside template literals
  const usageExample = [
    '@QUICKFUNCS(',
    '  ~certSize<int>(cert<blob>) {',
    '    return cert.size()',
    '  }',
    '',
    '  ~isImage<bool>(data<blob>) {',
    '    let mime = data.mimeType()',
    '    return mime.startsWith("image/")',
    '  }',
    '',
    '  ~byteSummary<string>(data<blob>) {',
    '    let bytes = data.size()',
    '    return $"{bytes.toString()} bytes ({data.mimeType()})"',
    '  }',
    ')',
    '',
    '@DATA(',
    '  // Inline base64 blob — useful for embedding small binary assets',
    '  icon<blob>        = b\u003A("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==")',
    '  certificate<blob> = b\u003A("LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t")',
    '',
    '  // MIME type detected at compile time:',
    '  icon_type   = isImage(icon)       // true',
    '  icon_bytes  = certSize(icon)      // 68',
    '  cert_info   = byteSummary(certificate)',
    ')',
  ].join('\n');

  const constructionExample = [
    '// Blob constructor — value must be valid Base64:',
    'icon<blob>  = b\u003A("iVBORw0KGgo=")',
    'cert<blob>  = b\u003A("LS0tLS1CRUdJTi==")',
    '',
    '// Inside a QuickFunc:',
    'let data<blob> = b\u003A("SGVsbG8gV29ybGQ=")',
  ].join('\n');

  const encodingNote = [
    '// Blobs use standard Base64 encoding (RFC 4648).',
    '// To embed a binary file, base64-encode it first:',
    '//',
    "//   Unix:     base64 -i myfile.png | tr -d '\\n'",
    '//   Windows:  [Convert]::ToBase64String([IO.File]::ReadAllBytes("myfile.png"))',
    "//   Node.js:  fs.readFileSync('myfile.png').toString('base64')",
    '//',
    '// Then wrap it in the b:() constructor:',
    'icon = b\u003A("iVBORw0KGgo...")',
  ].join('\n');
</script>

<div class="doc-page">
  <h1>Blob Methods</h1>
  <p class="page-lead">
    Instance methods available on <code>blob</code> values (constructed with <code>b:()</code>).
    Blobs hold raw binary data encoded as Base64. They are useful for embedding certificates,
    icons, checksums, and other binary assets directly in a <code>.mdix</code> file without
    external file references.
  </p>

  <h2>Construction</h2>
  <pre><code>{constructionExample}</code></pre>

  <h2>Encoding Note</h2>
  <pre><code>{encodingNote}</code></pre>

  <h2>Instance Methods</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each instanceMethods as m}
          <tr>
            <td><code>{m.name}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Usage Examples</h2>
  <pre><code>{usageExample}</code></pre>

  <h2>When to Use Blobs</h2>
  <p>
    Blobs are appropriate when you need to bundle binary data that would otherwise
    require a separate file: TLS certificates, small icons, embedded fonts, pre-computed
    checksums, or encrypted sub-payloads. For anything larger than a few kilobytes,
    prefer a file reference in your application code rather than embedding in the config.
  </p>
</div>

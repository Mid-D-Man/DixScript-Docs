<!-- src/lib/components/docs/sections/php/DocPhpErrorHandling.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const errorApi = `use MidManStudio\\Mdix\\MdixError;
use MidManStudio\\Mdix\\ErrorKind;

try {
    $port = $db->getInt('server.port');
} catch (MdixError $e) {
    match ($e->kind) {
        ErrorKind::NotFound     => /* path doesn't exist */ null,
        ErrorKind::TypeMismatch => /* wrong accessor for the stored type */ null,
        ErrorKind::NullHandle,
        ErrorKind::Closed       => /* database or builder already closed */ null,
        ErrorKind::InvalidPath  => /* malformed dotted path */ null,
        ErrorKind::Parse        => /* source failed to compile */ null,
        ErrorKind::Io           => /* file read/write failure */ null,
        ErrorKind::Native       => /* error surfaced from the Rust core */ null,
    };
    echo $e->getMessage();
}

// MdixError::fromMessage($str) infers an ErrorKind from a raw Rust error
// string when one isn't already known — used internally by the wrapper,
// but available if you're constructing errors of your own.

// The try*() / MdixResult family (see above) avoids exceptions entirely —
// prefer it at call sites where you don't want a try/catch per call.`;
</script>

<div class="doc-page">
  <h1>Error Handling — MdixError &amp; ErrorKind</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>. Every throw-style
    call that fails raises <code>MdixError</code> (extends
    <code>\\RuntimeException</code>) carrying a typed <code>ErrorKind</code>
    so you can branch on failure category without string-matching the
    message.
  </p>
  <CodeBlock code={errorApi} lang="php" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>ErrorKind</th><th>Meaning</th></tr></thead>
      <tbody>
        {#each [
          { m: 'NotFound',       d: 'The requested path does not exist.' },
          { m: 'TypeMismatch',   d: 'Wrong accessor called for the stored type.' },
          { m: 'NullHandle',     d: 'The underlying native handle is null.' },
          { m: 'Closed',         d: 'The database or builder has already been closed.' },
          { m: 'InvalidPath',    d: 'A malformed dotted path string.' },
          { m: 'Parse',          d: 'The source failed to compile.' },
          { m: 'Io',             d: 'A file read/write failure.' },
          { m: 'Native',         d: 'An error surfaced directly from the Rust core, uncategorized further.' },
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

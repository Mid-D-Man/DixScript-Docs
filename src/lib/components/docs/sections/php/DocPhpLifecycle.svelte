<!-- src/lib/components/docs/sections/php/DocPhpLifecycle.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const lifecycleApi = `// Both MdixDatabase and MdixBuilder wrap a native FFI handle — close it
// explicitly when you're done, especially in long-running processes
// (workers, queue consumers) where __destruct() timing isn't predictable.
$db->entryCount();   // int — total entries in the flat store
$db->isValid();      // bool — false after close()
$db->close();        // releases the native handle; safe to call once

// __destruct() calls close() automatically as a safety net, but don't
// rely on it for anything time-sensitive (file handles, locks, etc.)
// held on the native side.

$builder->entryCount();
$builder->close();`;
</script>

<div class="doc-page">
  <h1>Lifecycle &amp; Cleanup</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>. Both
    <code>MdixDatabase</code> and <code>MdixBuilder</code> hold a native
    FFI handle under the hood. <code>__destruct()</code> frees it
    automatically, but call <code>close()</code> explicitly in long-running
    processes rather than waiting on PHP's garbage collector.
  </p>
  <CodeBlock code={lifecycleApi} lang="php" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'entryCount()',    d: 'Total entries in the flat store.' },
          { m: 'isValid()',       d: 'False once close() has been called.' },
          { m: 'close()',         d: 'Release the native handle explicitly — safe to call once.' },
          { m: '__destruct()',    d: 'Calls close() automatically as a safety net — do not rely on its timing.' },
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

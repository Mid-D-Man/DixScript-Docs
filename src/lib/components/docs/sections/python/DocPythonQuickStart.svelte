<!-- src/lib/components/docs/sections/python/DocPythonQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const quickStart = `from midmanstudio.mdix import MdixDatabase, MdixBuilder, MdixError, MdixResult

# Context manager — auto-frees the native handle
with MdixDatabase.load_str('@DATA( port = 8080, host = "localhost" )') as db:
    port = db.get_int("port")
    host = db.get_string("host", "localhost")   # second arg = default if missing
    keys = db.get_keys()

# Direct load — raises MdixError on failure
db = MdixDatabase.load("config.mdix")
try:
    port = db.get_int("server.port")
except MdixError as e:
    print(f"load failed: {e}")
finally:
    db.close()`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">Part of the <a href="#python-api">Python Runtime API</a>.</p>
  <CodeBlock code={quickStart} lang="python" />
</div>

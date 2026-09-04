<!-- src/lib/components/docs/sections/python/DocPythonHotReload.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const watchApi = `from midmanstudio.mdix import MdixWatcher

watcher = MdixWatcher("config.mdix")

# Call from your own update loop / tick / timer — nothing runs on a
# background thread for you.
db, changed = watcher.check()
if changed:
    apply_new_config(db)   # db is None when changed is False

# Force a reload regardless of whether the file's mtime changed:
db = watcher.force_reload()

watcher.has_changed()   # bool, without reloading
watcher.has_loaded      # property — True once at least one reload succeeded`;
</script>

<div class="doc-page">
  <h1>Hot Reload</h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>.
    <code>MdixWatcher</code> is a manual, poll-based watcher — call
    <code>.check()</code> on your own schedule.
  </p>
  <CodeBlock code={watchApi} lang="python" />

  <p>
    Encrypted <code>.mdix</code> files are not supported —
    <code>force_reload()</code> always reloads through the plaintext loader
    path internally. A core Runtime limitation shared by every binding,
    not something specific to Python.
  </p>
</div>

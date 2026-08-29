<!-- src/lib/components/docs/sections/php/DocPhpQuickStart.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const quickStart = `<?php
use MidManStudio\\Mdix\\MdixDatabase;

$db = MdixDatabase::load('config.mdix');

$port  = $db->getInt('server.port');
$host  = $db->getString('server.host', 'localhost'); // 2nd arg = default
$debug = $db->getBool('debug', false);

$db->close();`;
</script>

<div class="doc-page">
  <h1>Quick Start</h1>
  <p class="page-lead">Part of the <a href="#php-api">PHP Runtime API</a>.</p>
  <CodeBlock code={quickStart} lang="php" />
</div>

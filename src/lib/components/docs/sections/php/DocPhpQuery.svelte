<!-- src/lib/components/docs/sections/php/DocPhpQuery.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';

  const queryPhp = `$enemies = $db->queryMany('levels.*.enemies');   // MdixQuery over every match

$topThreats = $enemies
    ->where(fn($e) => $e['hp'] > 50)
    ->orderByDescending(fn($e) => $e['hp'])
    ->take(3)
    ->toArray();

$totalHp = $enemies->sumInt(fn($e) => $e['hp']);
$avgHp   = $enemies->avgFloat(fn($e) => (float) $e['hp']);   // ?float — null if empty
$byName  = $enemies->groupBy(fn($e) => $e['name'][0]);        // array<string, array>

$boss = $enemies->maxByKey(fn($e) => $e['hp']);
$first = $enemies->first();                 // mixed, or null if empty
$firstOrDefault = $enemies->firstOr(['name' => 'none', 'hp' => 0]);`;
</script>

<div class="doc-page">
  <h1>Query</h1>
  <p class="page-lead">
    Part of the <a href="#php-api">PHP Runtime API</a>. <code>MdixDatabase::query($path)</code>
    (single fixed path) and <code>queryMany($pattern)</code> (whole-segment
    <code>*</code> wildcard across sibling paths) both return an
    <code>MdixQuery</code> — a fluent, chainable wrapper for filtering,
    projecting, and aggregating the results.
  </p>

  <CodeBlock code={queryPhp} lang="php" />

  <p>
    Chainable filter/transform methods (<code>where</code>,
    <code>whereFieldEquals</code>, <code>skip</code>, <code>take</code>,
    <code>distinct</code>, <code>orderBy</code>,
    <code>orderByDescending</code>) return a new <code>MdixQuery</code> for
    further chaining. Terminal methods (<code>select</code>,
    <code>selectField</code>, <code>groupBy</code>, <code>toArray</code>,
    <code>count</code>, <code>any</code>, <code>all</code>,
    <code>first</code>/<code>firstOr</code>/<code>last</code>/<code>nth</code>,
    <code>sumInt</code>/<code>sumFloat</code>/<code>avgFloat</code>/<code>minByKey</code>/<code>maxByKey</code>)
    end the chain and return a plain value.
  </p>
</div>

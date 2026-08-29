<!-- src/lib/components/docs/sections/php/DocPhpResult.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const resultApi = `use MidManStudio\\Mdix\\MdixResult;

$result = MdixDatabase::tryLoadStr($source)
    ->andThen(fn($db) => $db->tryGetInt('port'))
    ->ensure(fn($p) => $p > 1024, 'port must be > 1024')
    ->map(fn($p) => $p * 2)
    ->unwrapOr(3000);

// fold — explicit success / failure branches in one call
$message = MdixDatabase::tryLoad('config.mdix')
    ->andThen(fn($db) => $db->tryGetString('server.host'))
    ->map('strtoupper')
    ->tap(fn($v) => error_log("host = $v"))
    ->fold(
        onSuccess: fn($v) => "Loaded: $v",
        onFailure: fn($e) => "Failed: $e",
    );

// Full combinator set: ok / err / fromThrowable / isSuccess / isFailure /
// getValue / getError / orRaise / unwrap / unwrapOr / unwrapOrElse /
// map / andThen / ensure / or / fold / tap / tapError`;
</script>

<div class="doc-page">
  <h1>MdixResult — Railway Programming</h1>
  <p class="page-lead">Part of the <a href="#php-api">PHP Runtime API</a>.</p>
  <CodeBlock code={resultApi} lang="php" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: 'MdixResult::ok($value) / ::err($msg)', d: 'Construct a result directly.' },
          { m: '::fromThrowable($e)',                   d: 'Wrap a caught exception as a failed result.' },
          { m: '->isSuccess() / ->isFailure()',         d: 'State checks.' },
          { m: '->getValue() / ->getError()',           d: 'Raw access — getValue() throws if failed.' },
          { m: '->orRaise() / ->unwrap()',              d: 'Terminal — throw the original error on failure.' },
          { m: '->unwrapOr($fallback)',                 d: 'Terminal — fallback value on failure.' },
          { m: '->unwrapOrElse($factory)',              d: 'Terminal — fallback factory on failure.' },
          { m: '->map($f) / ->andThen($f)',              d: 'Transform the success value / chain another Result-returning call.' },
          { m: '->ensure($predicate, $msg)',            d: 'Turn success into failure if the predicate fails.' },
          { m: '->or($fallbackResult)',                 d: 'Use fallbackResult if this one failed.' },
          { m: '->fold($onSuccess, $onFailure)',        d: 'Collapse to a single value via two callbacks.' },
          { m: '->tap($f) / ->tapError($f)',            d: 'Side-effect only, result passes through unchanged.' },
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

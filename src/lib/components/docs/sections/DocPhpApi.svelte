<!-- src/lib/components/docs/sections/DocPhpApi.svelte -->
<script lang="ts">
  const install = `composer require midmanstudio/mdix

# Requires the PHP FFI extension enabled (ffi.enable=true in php.ini —
# or ffi.enable=preload if you're preloading). PHP 8.1+.`;

  const quickStart = `<?php
use MidManStudio\\Mdix\\MdixDatabase;

$db = MdixDatabase::load('config.mdix');

$port  = $db->getInt('server.port');
$host  = $db->getString('server.host', 'localhost'); // 2nd arg = default
$debug = $db->getBool('debug', false);

$db->close();`;

  const loadApi = `use MidManStudio\\Mdix\\MdixDatabase;

// Direct — throws MdixException on failure
MdixDatabase::load(string $path);
MdixDatabase::loadStr(string $source);
MdixDatabase::fromJson(string $json);
MdixDatabase::fromToml(string $toml);
MdixDatabase::loadEncrypted(string $encPath, ?string $keyPath = null);
MdixDatabase::loadEncryptedPassword(string $encPath, string $password);

// Railway — return MdixResult instead of throwing
MdixDatabase::tryLoad(string $path): MdixResult;
MdixDatabase::tryLoadStr(string $source): MdixResult;
MdixDatabase::tryFromJson(string $json): MdixResult;
MdixDatabase::tryFromToml(string $toml): MdixResult;`;

  const readApi = `$db->exists('server.host');            // bool
$db->valueTypeAt('server.port');       // ValueType enum
$db->arrayLength('enemies');           // int
$db->keys(prefix: '');                 // string[]

$db->getString('server.host', default: null);
$db->getInt('server.port', default: null);
$db->getFloat('ratio', default: null);
$db->getDouble('pi', default: null);
$db->getBool('debug', default: null);
$db->getJson('server');                // raw JSON string of a nested object/array

$db->getEnumName('log_level');         // "LogLevel"
$db->getEnumField('log_level');        // "INFO"
$db->getEnumValue('log_level');        // resolved int

// try* twins — return MdixResult instead of throwing
$db->tryGetString('server.host'): MdixResult;
$db->tryGetInt('server.port'): MdixResult;
$db->tryGetFloat('ratio'): MdixResult;
$db->tryGetDouble('pi'): MdixResult;
$db->tryGetBool('debug'): MdixResult;
$db->tryGetJson('server'): MdixResult;

// Export
$db->toJson(indented: true);
$db->toMdix(FormatMode::Default);
$db->toToml();
(string) $db;   // __toString() -> same as toMdix()`;

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

  const builderApi = `use MidManStudio\\Mdix\\MdixBuilder;

$db = (new MdixBuilder())
    ->setString('app_name', 'MyGame')
    ->setInt('port', 8080)
    ->setFloat('ratio', 0.75)
    ->setBool('ssl', true)
    ->setDate('release', new DateTimeImmutable('2025-12-31'))
    ->setTimestamp('created_at', new DateTimeImmutable('now'))
    ->toDatabase();

// Introspect / mutate before finishing
$builder->hasKey('app_name');   // bool
$builder->remove('app_name');   // bool
$builder->clear();              // reset everything, returns self

// Finish
$builder->saveToFile('profile.mdix');
$src = $builder->toMdixString();
$db  = $builder->toDatabase();          // throws on failure
$result = $builder->tryToDatabase();     // MdixResult instead

// Builders also expose typed getters for values already staged in them:
$builder->getString('app_name');
$builder->getInt('port');`;

  const converterApi = `use MidManStudio\\Mdix\\MdixConverter;

MdixConverter::toJson($db, indented: true);
MdixConverter::toMdix($db, FormatMode::Pretty);
MdixConverter::toToml($db);

MdixConverter::fromJson($jsonStr);
MdixConverter::fromToml($tomlStr);

MdixConverter::formatSource($source, FormatMode::Default);
MdixConverter::minifySource($source);

MdixConverter::jsonRoundTrip($db);   // db -> JSON -> db, useful for deep-cloning

// Railway twins
MdixConverter::tryToJson($db): MdixResult;
MdixConverter::tryFromJson($jsonStr): MdixResult;
MdixConverter::tryFromToml($tomlStr): MdixResult;
MdixConverter::tryFormatSource($source): MdixResult;`;
</script>

<div class="doc-page">
  <h1>PHP Runtime API</h1>
  <p class="page-lead">
    <code>midmanstudio/mdix</code> binds to the Rust core through PHP's FFI
    extension. Like Python, every method has both a throw-on-failure form
    and a <code>try*()</code> twin returning <code>MdixResult</code> for
    railway-style chaining — pick whichever fits the call site.
  </p>

  <h2>Install</h2>
  <pre><code>{install}</code></pre>

  <h2>Quick Start</h2>
  <pre><code>{quickStart}</code></pre>

  <h2>Loading</h2>
  <pre><code>{loadApi}</code></pre>

  <h2>Reading Values</h2>
  <pre><code>{readApi}</code></pre>

  <h2>MdixResult — Railway Programming</h2>
  <pre><code>{resultApi}</code></pre>

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

  <h2>Building Programmatically</h2>
  <pre><code>{builderApi}</code></pre>

  <h2>Format Conversion</h2>
  <pre><code>{converterApi}</code></pre>
</div>

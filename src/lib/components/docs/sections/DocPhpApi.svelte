<!-- src/lib/components/docs/sections/DocPhpApi.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `composer require midmanstudio/mdix

# Requires the PHP FFI extension enabled (ffi.enable=true in php.ini —
# or ffi.enable=preload if you're preloading). PHP 8.1+.`;

  const nativeLib = `# Composer installs the PHP wrapper — it does NOT ship a compiled binary.
# FFI needs the actual native shared library, resolved in this order:
#
#   1. MDIX_LIB_PATH env var — absolute path to the .so/.dylib/.dll
#   2. vendor/midmanstudio/mdix/lib/<platform file>  (or mdix-php/lib/ in
#      a source checkout) — this is what CI populates
#   3. The OS library loader (LD_LIBRARY_PATH, PATH, etc.) as a last resort

# Build it yourself from a DixScript-Rust checkout:
cargo build -p mdix-ffi --release

# Then copy the platform output into lib/:
#   Linux:   target/release/libmdix_ffi.so   -> lib/libmdix_ffi.so
#   macOS:   target/release/libmdix_ffi.dylib -> lib/libmdix_ffi.dylib
#   Windows: target/release/mdix_ffi.dll      -> lib/mdix_ffi.dll

# Or point at a prebuilt copy without moving it:
export MDIX_LIB_PATH=/path/to/libmdix_ffi.so`;

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

  const valueTypeApi = `use MidManStudio\\Mdix\\ValueType;

// Returned by $db->valueTypeAt($path)
enum ValueType: int {
    case Unknown; case Null; case Bool; case Int; case Float; case Double;
    case String; case Date; case Timestamp; case HexColor; case Blob;
    case Regex; case Array; case Object; case Tuple; case Enum;
}

$type = $db->valueTypeAt('server.port');
$type->label();     // "int" — human-readable
$type->isScalar();  // true for Bool/Int/Float/Double/String only

use MidManStudio\\Mdix\\FormatMode;

// Passed to toMdix() / formatSource()
enum FormatMode: int {
    case Default;   // 2-space indentation
    case Pretty;    // 4-space indentation, sorted keys
    case Compact;   // trailing whitespace removed, blank lines collapsed
    case Minified;  // all unnecessary whitespace stripped
}`;

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
  <h1>PHP Runtime API</h1>
  <p class="page-lead">
    <code>midmanstudio/mdix</code> binds to the Rust core through PHP's FFI
    extension. Like Python, every method has both a throw-on-failure form
    and a <code>try*()</code> twin returning <code>MdixResult</code> for
    railway-style chaining — pick whichever fits the call site.
  </p>

  <h2 id="install">Install</h2>
  <CodeBlock code={install} lang="bash" />

  <h3>Native library setup</h3>
  <p>
    Composer installs the PHP wrapper class only — FFI still needs the
    compiled Rust shared library, which isn't published to Packagist. Build
    it once and point the loader at it.
  </p>
  <CodeBlock code={nativeLib} lang="bash" />

  <h2 id="quickstart">Quick Start</h2>
  <CodeBlock code={quickStart} lang="php" />

  <h2 id="loading">Loading</h2>
  <CodeBlock code={loadApi} lang="php" />

  <h2 id="reading">Reading Values</h2>
  <CodeBlock code={readApi} lang="php" />

  <h2 id="error-handling">Error Handling — MdixError &amp; ErrorKind</h2>
  <p>
    Every throw-style call that fails raises <code>MdixError</code> (extends
    <code>\\RuntimeException</code>) carrying a typed <code>ErrorKind</code> so
    you can branch on failure category without string-matching the message.
  </p>
  <CodeBlock code={errorApi} lang="php" />

  <h2 id="result">MdixResult — Railway Programming</h2>
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

  <h2 id="builder">Building Programmatically</h2>
  <CodeBlock code={builderApi} lang="php" />

  <h2 id="format-conversion">Format Conversion</h2>
  <CodeBlock code={converterApi} lang="php" />

  <h2 id="types">Types — ValueType &amp; FormatMode</h2>
  <p>
    <code>ValueType</code> is what <code>$db-&gt;valueTypeAt($path)</code> returns —
    every discriminant DixScript's runtime value enum can hold.
    <code>FormatMode</code> controls output shape for
    <code>toMdix()</code> / <code>formatSource()</code>.
  </p>
  <CodeBlock code={valueTypeApi} lang="php" />

  <h2 id="lifecycle">Lifecycle &amp; Cleanup</h2>
  <p>
    Both <code>MdixDatabase</code> and <code>MdixBuilder</code> hold a native
    FFI handle under the hood. <code>__destruct()</code> frees it
    automatically, but call <code>close()</code> explicitly in long-running
    processes rather than waiting on PHP's garbage collector.
  </p>
  <CodeBlock code={lifecycleApi} lang="php" />
</div>

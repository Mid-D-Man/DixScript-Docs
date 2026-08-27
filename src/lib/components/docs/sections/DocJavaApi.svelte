<!-- src/lib/components/docs/sections/DocJavaApi.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `<!-- Maven -->
<dependency>
    <groupId>com.midmanstudio</groupId>
    <artifactId>dixscript</artifactId>
    <version>LATEST</version>
</dependency>

// Gradle
implementation("com.midmanstudio:dixscript:LATEST")

// Java 11+`;

  const quickStart = `import com.midmanstudio.dixscript.DixScript;
import com.midmanstudio.dixscript.Database;

try (Database db = DixScript.load("config.mdix")) {
    int port     = db.getInt("server.port");
    String host  = db.getString("server.host", "localhost"); // overload w/ default
    boolean debug = db.getBool("debug", false);
} catch (MdixException e) {
    System.err.println("load failed: " + e.getMessage());
}`;

  const facadeApi = `import com.midmanstudio.dixscript.DixScript;

DixScript.version();                              // -> String
DixScript.load(String path);                       // -> Database, throws MdixException
DixScript.loadStr(String source);                   // -> Database
DixScript.loadEncrypted(String encPath, String keyPath);         // -> Database
DixScript.loadEncryptedPassword(String encPath, String password); // -> Database
DixScript.loadJson(String json);                    // -> Database
DixScript.loadToml(String toml);                    // -> Database
DixScript.newBuilder();                             // -> Builder
DixScript.convert();                                // -> Converter`;

  const readApi = `db.exists("server.host");                 // boolean
db.valueTypeAt("server.port");            // ValueType enum
db.arrayLength("enemies");                // int
db.keys("server");                        // List<String> — direct children
db.keys();                                // List<String> — top-level keys

db.getString("server.host");              // throws MdixException if missing
db.getString("server.host", "localhost"); // overload — returns default instead

db.getInt("server.port");
db.getInt("server.port", 8080);
db.getLong("session_id");
db.getLong("session_id", 0L);
db.getFloat("ratio");
db.getFloat("ratio", 1.0f);
db.getDouble("pi");
db.getDouble("pi", 0.0);
db.getBool("debug");
db.getBool("debug", false);

db.getEnumName("log_level");   // "LogLevel"
db.getEnumField("log_level");  // "INFO"
db.getEnumValue("log_level");  // resolved int

db.getJson("server");          // raw JSON string of a nested object/array`;

  const exceptionApi = `import com.midmanstudio.dixscript.MdixException;

try {
    int port = db.getInt("server.port");
} catch (MdixException e) {
    // getMessage() carries the underlying error text; there is currently
    // no separate ErrorKind enum on the Java side (unlike C#/Go/Python) —
    // if you need to branch on error category, parse getMessage() or
    // check exists()/valueTypeAt() defensively before the get*() call.
    log.error("dixscript read failed", e);
}

// Every getter has a two-argument default overload specifically so you
// can avoid try/catch for optional fields — prefer those over blanket
// try/catch where a sensible default exists.`;

  const builderApi = `import com.midmanstudio.dixscript.Builder;
import com.midmanstudio.dixscript.Database;

Builder b = new Builder();

b.setString("profile.name", "player1")
 .setInt("profile.level", 42)
 .setLong("profile.xp", 9_000_000_000L)
 .setFloat("profile.ratio", 0.75f)
 .setDouble("profile.score", 9876.5)
 .setBool("profile.active", true)
 .setDate("profile.joined", LocalDate.now())
 .setTimestamp("profile.created", Instant.now());

b.hasKey("profile.name");    // boolean
b.remove("profile.name");    // boolean
b.entryCount();               // int
b.clear();                    // reset the builder

b.saveToFile("profile.mdix");        // throws MdixException
String src = b.toMdixString();
Database db = b.toDatabase();
b.close();                            // Builder implements AutoCloseable`;

  const converterApi = `import com.midmanstudio.dixscript.Converter;

Converter c = DixScript.convert();

c.toJson(db, true);                          // indented JSON string
c.toMdix(db, FormatMode.DEFAULT);
c.toToml(db);

c.fromJson(jsonStr);                         // -> Database
c.fromToml(tomlStr);                         // -> Database

c.formatSource(source, FormatMode.DEFAULT);
c.minifySource(source);

c.jsonRoundTrip(db);   // db -> JSON -> db, useful for deep-cloning a Database`;

  const kotlinExample = `DixScript.load("config.mdix").use { db ->
    val port = db.getInt("server.port")
}`;

  const queryApi = `// query(path) — chainable LINQ-style helpers over a single array value
MdixQuery enemies = db.query("enemies");

MdixValue boss = enemies
    .where_(e -> e.field("hp").asInt() > 100)
    .orderByDescending(e -> e.field("hp").asInt())
    .first();

List<String> names = enemies.select(e -> e.field("name").asString());
long totalHp        = enemies.sumInt(); // sums the query's own numeric values, not a field
Map<Object, List<MdixValue>> byFirstLetter =
    enemies.groupBy(e -> e.field("name").asString().substring(0, 1));

// queryMany(pattern) — whole-segment glob across sibling paths,
// native select_many under the hood (not a client-side loop)
MdixQuery allEnemies = db.queryMany("levels.*.enemies");

// where_ has a trailing underscore — "where" isn't reserved in Java,
// but the API keeps it for readability alongside Kotlin/Scala usage.
MdixQuery cheap = db.query("items").whereFieldEquals("rarity", MdixValue.of("common"));`;

  const schemaApi = `SchemaBuilder schema = new SchemaBuilder()
    .requireString("app_name")
    .requireInt("server.port")
    .requireBool("ssl")
    .optionalString("description")
    .optionalInt("timeout");

SchemaBuilder.Report report = schema.validate(db);

if (!report.isValid()) {
    for (SchemaBuilder.ValidationError err : report.errors) {
        System.out.println(err.path + ": expected " + err.expected + ", got " + err.actual);
    }
    System.out.println(report.failedPaths());
}

// require(path, type) / requireWith(path, type, validator) accept an
// ExpectedType directly for anything beyond the typed requireString/
// requireInt/... shorthands above. ExpectedType.ANY accepts any value type.`;

  const mergeApi = `// Source strings — sources[0] gets the highest implicit weight
Merge.Result merged = Merge.sources(baseSrc, overlaySrc);
Database db = merged.database;
if (merged.hasConflicts()) {
    for (Merge.Conflict c : merged.conflicts) {
        System.out.println(c.path + ": source " + c.winningSource + " (" + c.winningLabel + ") won");
    }
}

// Explicit weights + strategy
Merge.Result weighted = Merge.sourcesWeighted(
    List.of(baseSrc, overlaySrc),
    new double[]{ 1.0, 0.5 },
    Merge.Strategy.WEIGHTED_PRIORITY,
    Merge.ArrayStrategy.CONCAT_DEDUP
);

// Already-loaded Databases instead of source text — each is round-tripped
// through toMdix() first, since a loaded Database only retains resolved
// data, not the AST the merger needs for weighted conflict resolution.
Merge.Result fromDbs = Merge.databases(baseDb, overlayDb);`;

  const hotReloadApi = `HotReload watcher = new HotReload("config.mdix");

// Poll on your own schedule — no background thread is started for you.
if (watcher.hasChanged()) {
    Optional<Database> reloaded = watcher.checkAndReload();
    reloaded.ifPresent(db -> System.out.println("config reloaded"));
}

// Or force a reload regardless of the mtime check:
Database db = watcher.forceReload();

watcher.hasLoaded();  // true once at least one successful load has happened
watcher.path();       // the source path being watched
watcher.close();      // implements Closeable — use try-with-resources`;
</script>

<div class="doc-page">
  <h1>Java / Kotlin Runtime API</h1>
  <p class="page-lead">
    <code>com.midmanstudio.dixscript</code> wraps the Rust core with a
    conventional Java surface — <code>Database</code> and
    <code>Builder</code> both implement <code>AutoCloseable</code>, and
    every fallible call throws <code>MdixException</code> rather than
    returning a Result type. Query, schema validation, merging, and
    file-watch-based hot reload are all here too — there's no async
    layer, which is the one real gap relative to C#.
  </p>

  <h2>Install</h2>
  <CodeBlock code={install} lang="text" />

  <h2>Quick Start</h2>
  <CodeBlock code={quickStart} lang="java" />

  <h2>DixScript Facade</h2>
  <CodeBlock code={facadeApi} lang="java" />

  <h2>Reading Values</h2>
  <p>
    Every typed getter has two overloads: a strict form that throws
    <code>MdixException</code> if the path is missing or the wrong type,
    and a form that takes a default value instead.
  </p>
  <CodeBlock code={readApi} lang="java" />

  <h2>Error Handling</h2>
  <CodeBlock code={exceptionApi} lang="java" />

  <h2>Building Programmatically</h2>
  <CodeBlock code={builderApi} lang="java" />

  <h2>Format Conversion</h2>
  <CodeBlock code={converterApi} lang="java" />

  <h2>Query — Chainable Helpers</h2>
  <p>
    <code>db.query(path)</code> starts an <code>MdixQuery</code> over an
    array value; <code>db.queryMany(pattern)</code> does the same across a
    whole-segment glob like <code>"levels.*.enemies"</code>, resolved
    natively rather than looped client-side.
  </p>
  <CodeBlock code={queryApi} lang="java" />

  <h2>Schema Validation</h2>
  <p>
    <code>SchemaBuilder</code> — fluent, declarative required/optional
    field validation against a loaded <code>Database</code>.
  </p>
  <CodeBlock code={schemaApi} lang="java" />

  <h2>Merging Databases</h2>
  <p>
    <code>Merge</code> — AST-level merge, no JSON round-trip. Works from
    either raw source strings (<code>Merge.sources</code>) or
    already-loaded <code>Database</code> instances
    (<code>Merge.databases</code>).
  </p>
  <CodeBlock code={mergeApi} lang="java" />

  <h2>Hot Reload</h2>
  <p>
    <code>HotReload</code> is a manual, poll-based watcher — call
    <code>hasChanged()</code>/<code>checkAndReload()</code> on your own
    schedule (a game loop tick, a scheduled task); nothing runs on a
    background thread automatically.
  </p>
  <CodeBlock code={hotReloadApi} lang="java" />

  <h2>Kotlin</h2>
  <p>
    No separate Kotlin package — the Java API is used as-is. Kotlin's
    <code>.use &#123; &#125;</code> extension on <code>AutoCloseable</code> works
    directly in place of try-with-resources:
  </p>
  <CodeBlock code={kotlinExample} lang="kotlin" />
</div>

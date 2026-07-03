<!-- src/lib/components/docs/sections/DocJavaApi.svelte -->
<script lang="ts">
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
</script>

<div class="doc-page">
  <h1>Java / Kotlin Runtime API</h1>
  <p class="page-lead">
    <code>com.midmanstudio.dixscript</code> wraps the Rust core with a
    conventional Java surface — <code>Database</code> and
    <code>Builder</code> both implement <code>AutoCloseable</code>, and
    every fallible call throws <code>MdixException</code> rather than
    returning a Result type. This is the one binding without a merge,
    schema, or async layer yet — if you need those, the C# wrapper
    (<code>MdixMerge</code> / <code>MdixSchema</code>) is the closest
    reference for the shape they should take.
  </p>

  <h2>Install</h2>
  <pre><code>{install}</code></pre>

  <h2>Quick Start</h2>
  <pre><code>{quickStart}</code></pre>

  <h2>DixScript Facade</h2>
  <pre><code>{facadeApi}</code></pre>

  <h2>Reading Values</h2>
  <p>
    Every typed getter has two overloads: a strict form that throws
    <code>MdixException</code> if the path is missing or the wrong type,
    and a form that takes a default value instead.
  </p>
  <pre><code>{readApi}</code></pre>

  <h2>Error Handling</h2>
  <pre><code>{exceptionApi}</code></pre>

  <h2>Building Programmatically</h2>
  <pre><code>{builderApi}</code></pre>

  <h2>Format Conversion</h2>
  <pre><code>{converterApi}</code></pre>

  <h2>Kotlin</h2>
  <p>
    No separate Kotlin package — the Java API is used as-is. Kotlin's
    <code>.use { }</code> extension on <code>AutoCloseable</code> works
    directly in place of try-with-resources:
  </p>
  <pre><code>{kotlinExample}</code></pre>
</div>

<!-- src/lib/components/docs/sections/DocQuickFuncs.svelte -->
<script lang="ts">
  const syntaxOverview = `// Full syntax:
// ~ FunctionName < ReturnType > ( Parameters ) { Body }
//
// Return type:   REQUIRED
// Type annotations on parameters: OPTIONAL
// Scope declaration: OPTIONAL — global by default

~myFunc<string>(name<string>, count<int>, flag) {
  // 'flag' has no annotation — type is inferred from usage
  return $"{name} × {count.toString()}"
}`;

  const returnTypes = `// Return types map to DixScript types:
~getName<string>()         { return "Alice" }
~getCount<int>()           { return 42 }
~getRatio<float>()         { return 0.5f }
~isEnabled<bool>()         { return true }
~getCoord<tuple>()         { return t:(10, 20) }
~buildItem<object>(id, n)  { return { id = id, name = n } }
~getList<array>(n<int>)    { return Array.range(1, n) }
~getEnv<enum>()            { return Environment.PROD }`;

  const scopeExample = `@QUICKFUNCS(
  // No scope declaration = global (default)
  // This function is visible everywhere and can be imported by other files
  ~makeServer<object>(host<string>, port<int>) {
    return { host = host, port = port, ssl = false }
  }

  // Scoped to a specific data path — only resolved within that path
  ~internalCalc<int>(x<int>) => servers {
    return x * 2
  }

  // Scoped to multiple paths
  ~sharedHelper<string>(s<string>) => servers, logging {
    return s.toUpper()
  }
)`;

  const controlFlowExample = `@QUICKFUNCS(
  ~classify<string>(score<int>) {
    // Ternary expression (preferred for simple branches)
    return score >= 90 ? "A" :
           score >= 80 ? "B" :
           score >= 70 ? "C" : "F"
  }

  ~describe<string>(env<enum>) {
    // if: / elif: / else — for multi-statement branches
    if: env == Environment.PROD {
      return "Production"
    } elif: env == Environment.STAGING {
      return "Staging"
    } else {
      return "Development"
    }
  }

  ~check<string>(status<enum>) {
    // chk: (switch) — pattern matching on enum or literal
    chk: status {
      -> Status.ACTIVE   { return "online" }
      -> Status.INACTIVE { return "offline" }
      -> miss            { return "unknown" }
    }
  }
)`;

  const functionCallExample = `@QUICKFUNCS(
  // Functions can call other functions defined in the same @QUICKFUNCS block
  ~baseUrl<string>(host<string>, tls<bool>) {
    let scheme = tls ? "https" : "http"
    return $"{scheme}://{host}"
  }

  ~apiEndpoint<string>(host<string>, path<string>, tls<bool>) {
    // Calling another QuickFunc
    let base = baseUrl(host, tls)
    return $"{base}/{path}"
  }

  // Static built-in calls inside functions
  ~clampedPort<int>(port<int>) {
    return Math.clamp(port, 1024, 65535)
  }

  // String methods on values
  ~slugify<string>(label<string>) {
    return label.toLower().replace(" ", "-").trim()
  }

  // Array built-ins
  ~buildRange<array>(n<int>) {
    return Array.range(1, n)
  }

  // DateTime built-ins
  ~isFuture<bool>(target<date>) {
    let diff = DateTime.subtract(target, DateTime.today())
    return diff > 0
  }
)`;

  const lambdaExample = `@QUICKFUNCS(
  // QuickFuncs ARE the lambda — each function is a named compile-time lambda.
  // There is no separate anonymous lambda syntax.
  // To achieve lambda-like composition, call one function from another:

  ~double<int>(x<int>)       { return x * 2 }
  ~addTen<int>(x<int>)       { return x + 10 }
  ~doubleThenAdd<int>(x<int>) { return addTen(double(x)) }
)`;

  const noLoopsExample = `// DixScript does NOT have loops (for, while, forEach etc.)
// Repetition is achieved through:
//   1. Calling a QuickFunc multiple times in @DATA arrays
//   2. Array built-ins like Array.range(), Array.fill()
//   3. Recursion (limited depth enforced by compiler)

@QUICKFUNCS(
  // WRONG — no loop syntax:
  // ~buildItems<array>(n<int>) {
  //   for i in 0..n { ... }   // invalid
  // }

  // RIGHT — use Array built-ins:
  ~ports<array>(base<int>, count<int>) {
    return Array.range(base, base + count - 1)
  }

  // RIGHT — call multiple times from @DATA:
  ~item<object>(id<string>, name<string>, price<double>) {
    return { id = id, name = name, price = price }
  }
)

@DATA(
  // Repetition handled here — no loop needed in the function:
  ports  = ports(8080, 5)    // [8080, 8081, 8082, 8083, 8084]

  items::
    item("I001", "Sword",  25.0),
    item("I002", "Shield", 40.0),
    item("I003", "Potion", 5.0)
)`;

  const arithmeticOps = `@QUICKFUNCS(
  ~pricing<object>(damage<int>) {
    let sell = damage * 2
    let buy  = damage * 8
    let tax  = (buy * 0.15f).toInt()    // method chaining + cast
    return { sell = sell, buy = buy, tax = tax }
  }

  ~normalise<double>(value<double>, min<double>, max<double>) {
    return (value - min) / (max - min)
  }
)`;

  const invalidExamples = `// INVALID — return type is required:
~badFunc(x) { return x }          // missing <returnType>

// INVALID — no loops:
~badLoop<int>(n<int>) {
  for i in 0..n { }               // no loop syntax
}

// INVALID — cannot reference @DATA values from inside a func:
~badRef<string>() {
  return app_name                  // @DATA properties not in scope
}

// INVALID — function bodies only inside @QUICKFUNCS:
@DATA(
  val = ~inner<int>() { return 1 } // cannot define func inline in @DATA
)

// VALID — call a func from @DATA:
@DATA(
  val = myFunc(arg)   // calling is fine
)`;
</script>

<div class="doc-page">
  <h1>@QUICKFUNCS</h1>
  <p class="page-lead">
    Compile-time functions that execute at parse time. Every QuickFunc is evaluated once
    during compilation — no function call appears in the output. QuickFuncs can handle
    most basic and intermediate programming patterns: branching, arithmetic, string
    manipulation, object construction, and calling other QuickFuncs. The main limitations
    are: no loops, no mutation of external state, and no access to runtime values.
    Requires <code>features -> "advanced"</code> (the default).
  </p>

  <h2>Syntax</h2>
  <pre><code>{syntaxOverview}</code></pre>

  <div class="kv-table">
    {#each [
      { key: '~',             type: 'required', desc: 'Function declaration prefix — distinguishes QuickFuncs from regular identifiers.' },
      { key: 'FunctionName',  type: 'required', desc: 'Any valid identifier. Used to call the function from @DATA or other QuickFuncs.' },
      { key: '<ReturnType>',  type: 'required', desc: 'Must always be specified. Use <object> for structs, <array> for lists, <string> etc.' },
      { key: 'Parameters',    type: 'optional', desc: 'Comma-separated. Type annotations per-parameter are optional — compiler infers.' },
      { key: '=> scope',      type: 'optional', desc: 'Scope restriction. If omitted the function is global (accessible everywhere).' },
      { key: '{ Body }',      type: 'required', desc: 'One or more statements followed by a return statement.' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Return Types</h2>
  <p>
    The return type annotation is always required. It determines what the compiler
    expects the <code>return</code> statement to produce.
  </p>
  <pre><code>{returnTypes}</code></pre>

  <h2>Scope</h2>
  <p>
    Scope is global by default — a function with no scope declaration is accessible
    from <code>@DATA</code>, from other QuickFuncs, and can be imported by other
    <code>.mdix</code> files via <code>@IMPORTS</code>. Use <code>=></code> followed
    by a data path to restrict a function to a specific section of your data tree.
  </p>
  <pre><code>{scopeExample}</code></pre>

  <h2>Control Flow</h2>
  <p>
    QuickFuncs support ternary expressions, <code>if:</code> / <code>elif:</code> /
    <code>else</code> blocks, and <code>chk:</code> (switch) statements.
  </p>
  <pre><code>{controlFlowExample}</code></pre>

  <h2>Calling Other Functions and Built-ins</h2>
  <p>
    A QuickFunc may call any other QuickFunc defined earlier in the same
    <code>@QUICKFUNCS</code> block, as well as any static built-in object
    (<code>Math</code>, <code>String</code>, <code>Array</code>, <code>DateTime</code>,
    <code>Random</code>, <code>Guid</code>, <code>IpAddress</code>, <code>Dix</code>).
    Instance methods on values — such as <code>.toLower()</code>, <code>.length()</code>,
    <code>.toInt()</code> — are also available.
  </p>
  <pre><code>{functionCallExample}</code></pre>

  <h2>Arithmetic and Operators</h2>
  <p>
    All standard arithmetic operators are available: <code>+</code>, <code>-</code>,
    <code>*</code>, <code>/</code>, <code>%</code>, and exponentiation <code>^</code>.
    Assignment operators <code>+=</code>, <code>-=</code>, <code>*=</code>, <code>/=</code>,
    <code>%=</code> work on <code>let mut</code> variables.
    Comparison operators: <code>==</code>, <code>!=</code>, <code>&gt;</code>,
    <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>.
    Logical: <code>&amp;&amp;</code> / <code>and</code>, <code>||</code> / <code>or</code>,
    <code>!</code> / <code>not</code>.
  </p>
  <pre><code>{arithmeticOps}</code></pre>

  <h2>Composition — QuickFuncs as Lambdas</h2>
  <p>
    There is no separate anonymous lambda syntax. QuickFuncs are the lambda — each is a
    named compile-time function. Achieve composition by calling one function from another.
  </p>
  <pre><code>{lambdaExample}</code></pre>

  <h2>No Loops</h2>
  <p>
    DixScript does not have loop constructs (<code>for</code>, <code>while</code>,
    <code>forEach</code>). Repetition is handled at the <code>@DATA</code> level by
    calling a QuickFunc multiple times within an array group, or by using Array
    built-in constructors like <code>Array.range()</code> and <code>Array.fill()</code>.
    Limited recursion is allowed — the compiler enforces a maximum recursion depth.
  </p>
  <pre><code>{noLoopsExample}</code></pre>

  <h2>Invalid Syntax</h2>
  <pre><code>{invalidExamples}</code></pre>
</div>

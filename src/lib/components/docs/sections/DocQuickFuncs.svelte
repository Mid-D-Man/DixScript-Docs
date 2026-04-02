<!-- src/lib/components/docs/sections/DocQuickFuncs.svelte -->
<script lang="ts">
  // EBNF-correct syntax:
  // ~Name<ReturnType> => scope(s) (params) { body }
  // Scope declaration comes BEFORE the parameter list, not after.

  const syntaxOverview = `// Full syntax — scope declaration (if present) comes BEFORE the parameter list:
// ~ FunctionName < ReturnType > => scope  ( Parameters ) { Body }
//                                 ^^^^^^^
//                                 optional, but must come BEFORE the opening parenthesis

// Global function (no scope — available everywhere and importable):
~myFunc<string>(name<string>, count<int>) {
  return $"{name} × {count.toString()}"
}

// Scoped to a single data path — only resolved within that path:
~internalCalc<int> => servers (x<int>) {
  return x * 2
}

// Scoped to multiple paths:
~sharedHelper<string> => servers, logging (s<string>) {
  return s.toUpper()
}`;

  const returnTypes = `// Return type annotation is always required:
~getName<string>()          { return "Alice" }
~getCount<int>()            { return 42 }
~getRatio<float>()          { return 0.5f }
~isEnabled<bool>()          { return true }
~getCoord<tuple>()          { return t:(10, 20) }
~buildItem<object>(id, n)   { return { id = id, name = n } }
~getList<array>(n<int>)     { return Array.range(1, n) }
~getEnv<enum>()             { return Environment.PROD }`;

  const controlFlowExample = `@QUICKFUNCS(
  // Ternary — preferred for simple single-expression branches
  ~classify<string>(score<int>) {
    return score >= 90 ? "A" :
           score >= 80 ? "B" :
           score >= 70 ? "C" : "F"
  }

  // if: / elif: / else — for multi-statement branches
  ~describe<string>(env<enum>) {
    if: env == Environment.PROD {
      return "Production"
    } elif: env == Environment.STAGING {
      return "Staging"
    } else {
      return "Development"
    }
  }

  // chk: (switch) — pattern matching on enum values or literals
  ~statusLabel<string>(status<enum>) {
    chk: status {
      -> Status.ACTIVE   { return "online"  }
      -> Status.INACTIVE { return "offline" }
      -> miss            { return "unknown" }
    }
  }

  // Nested ternary chained with string interpolation
  ~tierName<string>(level<int>) {
    let label = level >= 3 ? "Gold"   :
                level >= 2 ? "Silver" : "Bronze"
    return $"Tier: {label}"
  }
)`;

  const arithmeticExample = `@QUICKFUNCS(
  // All standard arithmetic operators:
  // +  -  *  /  %  ^  (exponentiation)
  ~pricing<object>(damage<int>) {
    let sell = damage * 2
    let buy  = damage * 8
    let tax  = (buy * 0.15f).toInt()
    return { sell = sell, buy = buy, tax = tax }
  }

  // Compound assignment on mutable variables:
  // +=  -=  *=  /=  %=
  ~sumItems<double>(prices<array>) {
    let mut total = 0.0
    // Note: no loops — accumulation is done outside via multiple calls
    // or via Array.sum() instead:
    total = prices.sum()
    return total
  }

  // Comparison operators: ==  !=  >  <  >=  <=
  ~isInRange<bool>(val<int>, lo<int>, hi<int>) {
    return val >= lo && val <= hi
  }

  // Logical operators:  &&  ||  !   (also: "and"  "or"  "not")
  ~canProceed<bool>(active<bool>, level<int>) {
    return active && level > 0
  }

  // Exponentiation operator: ^
  ~squared<double>(x<double>) {
    return x ^ 2.0
  }
)`;

  const variablesExample = `@QUICKFUNCS(
  ~buildUrl<string>(host<string>, port<int>, tls<bool>) {
    // let — immutable by default (cannot be reassigned)
    let scheme = tls ? "https" : "http"

    // let mut — explicit mutable variable, can be reassigned
    let mut path = $"{scheme}://{host}"
    path += $":{port.toString()}"

    // const — compile-time constant, right-hand side must be a literal
    const MAX_LEN = 2048

    return path.substring(0, MAX_LEN)
  }

  // Type annotations on variables are optional — compiler infers:
  ~inferDemo<string>(x<int>) {
    let value  = x * 2          // inferred: int
    let label  = value.toString() // inferred: string
    let result = $"Value: {label}"
    return result
  }
)`;

  const builtinCallsExample = `@QUICKFUNCS(
  // Calling static objects: Math, Array, DateTime, Random, Guid, IpAddress, Dix
  ~clampedPort<int>(port<int>) {
    return Math.clamp(port, 1024, 65535)
  }

  ~buildRange<array>(n<int>) {
    return Array.range(1, n)
  }

  ~isFuture<bool>(d<date>) {
    return DateTime.subtract(d, DateTime.today()) > 0.0
  }

  ~newId<string>() {
    return Guid.new()
  }

  ~safeHost<string>(host<string>) {
    let parsed = IpAddress.tryParse(host)
    return parsed == null ? IpAddress.localhost() : parsed
  }

  // Calling instance methods on values inside a QuickFunc:
  ~slugify<string>(label<string>) {
    return label.toLower().replace(" ", "-").trim()
  }

  ~firstTag<string>(tags<array>) {
    return tags.isEmpty() ? "none" : tags.first().toString()
  }

  ~roundedRatio<double>(raw<double>) {
    return raw.round(4)
  }

  // Calling one QuickFunc from another (defined earlier in the same block):
  ~baseUrl<string>(host<string>, tls<bool>) {
    let safe = safeHost(host)
    let scheme = tls ? "https" : "http"
    return $"{scheme}://{safe}"
  }

  ~apiEndpoint<string>(host<string>, path<string>, tls<bool>) {
    return $"{baseUrl(host, tls)}/{path}"
  }
)`;

  const noLoopsExample = `// DixScript has NO loop constructs (for, while, forEach, etc.)
// Repetition is handled at the @DATA level or via Array built-ins.

@QUICKFUNCS(
  // WRONG — no loop syntax exists:
  // ~sumPrices<int>(n<int>) {
  //   for i in 0..n { total += i }   // INVALID
  // }

  // RIGHT — use Array built-ins for numeric sequences:
  ~ports<array>(base<int>, count<int>) {
    return Array.range(base, base + count - 1)
  }

  // RIGHT — define the per-item function, call it multiple times from @DATA:
  ~item<object>(id<string>, name<string>, price<double>) {
    return { id = id, name = name, price = price }
  }
)

@DATA(
  // Repetition handled by listing calls — not by looping inside the function:
  ports = ports(8080, 5)     // [8080, 8081, 8082, 8083, 8084]

  items::
    item("I001", "Sword",  25.0),
    item("I002", "Shield", 40.0),
    item("I003", "Potion",  5.0)
)`;

  const scopeExample = `@QUICKFUNCS(
  // No scope declaration = global (default)
  // Callable from @DATA, from other QuickFuncs, and importable by other .mdix files
  ~makeServer<object>(host<string>, port<int>) {
    return { host = host, port = port, ssl = false }
  }

  // Scope declaration comes BEFORE the parameter list
  // This function is only resolved within the "servers" data path
  ~internalCalc<int> => servers (x<int>) {
    return x * 2
  }

  // Scoped to multiple paths — still before the parameter list
  ~sharedHelper<string> => servers, logging (s<string>) {
    return s.toUpper()
  }
)`;

  const importedFunctionsExample = `// Calling functions from an imported namespace:
@IMPORTS(
  Base    from "lib/base_types.mdix"
  Helpers from_cloud "https://dixscript-docs.pages.dev/api/registry/game/game_helpers.mdix"
)

@QUICKFUNCS(
  // Prefix with the import alias dot the function name
  ~buildEnemy<object>(id<string>, name<string>, hp<int>) {
    return Helpers.makeEnemy(id, name, hp, Difficulty.NORMAL)
  }

  // Mixing local and imported calls inside one function
  ~fullEnemy<object>(id<string>, name<string>, hp<int>, rare<enum>) {
    let base  = Helpers.makeEnemy(id, name, hp, Difficulty.HARD)
    let value = Base.scaledValue(hp, rare)
    return {
      id       = base.id
      name     = base.name
      health   = base.health
      xp_value = value
    }
  }
)`;

  const invalidExamples = `// INVALID — return type is required:
~badFunc(x) { return x }                   // missing <ReturnType>

// INVALID — scope must come BEFORE the parameter list:
~badScope<string>(x<string>) => servers { return x }  // scope is AFTER params — wrong

// CORRECT scope syntax (scope before params):
~goodScope<string> => servers (x<string>) { return x }

// INVALID — no loop syntax:
~badLoop<int>(n<int>) {
  for i in 0..n { }                        // no for/while/forEach
}

// INVALID — cannot read @DATA values inside a QuickFunc:
~badRef<string>() {
  return app_name                           // @DATA properties not in scope
}

// INVALID — cannot define a function body inline in @DATA:
@DATA(
  val = ~inner<int>() { return 1 }          // function definitions only in @QUICKFUNCS
)

// VALID — calling a QuickFunc from @DATA is fine:
@DATA(
  val = myFunc("hello", 42)
)

// INVALID — do NOT use arithmetic or builtin calls directly in @DATA:
@DATA(
  bad_val = 5 * 2                          // arithmetic not allowed directly in @DATA
  bad_val2 = Math.max(1, 2)               // static builtin calls not allowed in @DATA
  bad_val3 = "hello".toUpper()            // instance calls not allowed in @DATA
  // Wrap these in a QuickFunc and call that instead
)`;

  const operatorsTable = [
    { op: '+',   kind: 'Arithmetic', desc: 'Addition (numbers) or string concatenation', example: 'x + y' },
    { op: '-',   kind: 'Arithmetic', desc: 'Subtraction', example: 'x - y' },
    { op: '*',   kind: 'Arithmetic', desc: 'Multiplication', example: 'x * y' },
    { op: '/',   kind: 'Arithmetic', desc: 'Division (float result if operands are float/double)', example: 'x / y' },
    { op: '%',   kind: 'Arithmetic', desc: 'Remainder / modulo', example: 'x % y' },
    { op: '^',   kind: 'Arithmetic', desc: 'Exponentiation (base ^ exponent)', example: 'x ^ 2.0' },
    { op: '+=',  kind: 'Compound',   desc: 'Add and assign (requires let mut)', example: 'total += price' },
    { op: '-=',  kind: 'Compound',   desc: 'Subtract and assign', example: 'hp -= damage' },
    { op: '*=',  kind: 'Compound',   desc: 'Multiply and assign', example: 'val *= 2' },
    { op: '/=',  kind: 'Compound',   desc: 'Divide and assign', example: 'val /= 100.0' },
    { op: '%=',  kind: 'Compound',   desc: 'Modulo and assign', example: 'val %= 10' },
    { op: '==',  kind: 'Comparison', desc: 'Equal to', example: 'a == b' },
    { op: '!=',  kind: 'Comparison', desc: 'Not equal to', example: 'a != b' },
    { op: '>',   kind: 'Comparison', desc: 'Greater than', example: 'a > b' },
    { op: '<',   kind: 'Comparison', desc: 'Less than', example: 'a < b' },
    { op: '>=',  kind: 'Comparison', desc: 'Greater than or equal', example: 'a >= b' },
    { op: '<=',  kind: 'Comparison', desc: 'Less than or equal', example: 'a <= b' },
    { op: '&&',  kind: 'Logical',    desc: 'Logical AND (also: "and")', example: 'a && b' },
    { op: '||',  kind: 'Logical',    desc: 'Logical OR (also: "or")', example: 'a || b' },
    { op: '!',   kind: 'Logical',    desc: 'Logical NOT (also: "not")', example: '!active' },
    { op: '? :', kind: 'Ternary',    desc: 'Conditional expression — condition ? if_true : if_false', example: 'x > 0 ? "pos" : "neg"' },
  ];
</script>

<div class="doc-page">
  <h1>@QUICKFUNCS</h1>
  <p class="page-lead">
    Compile-time functions that execute at parse time. Every QuickFunc is evaluated once
    during compilation — no function call appears in the output. QuickFuncs support
    branching, arithmetic, string manipulation, object construction, and calling other
    QuickFuncs and built-in methods. The main limitations are: no loops, no mutation of
    external state, and no access to <code>@DATA</code> values.
    Requires <code>features → "advanced"</code> (the default).
  </p>

  <h2>Syntax</h2>
  <pre><code>{syntaxOverview}</code></pre>

  <div class="kv-table">
    {#each [
      { key: '~',              type: 'required', desc: 'Function declaration prefix.' },
      { key: 'FunctionName',   type: 'required', desc: 'Any valid identifier used to call the function.' },
      { key: '<ReturnType>',   type: 'required', desc: 'Always required. Use <object> for structs, <array> for lists, etc.' },
      { key: '=> scope',       type: 'optional', desc: 'Scope restriction — must come BEFORE the parameter list. If omitted the function is global.' },
      { key: '(Parameters)',   type: 'required', desc: 'Comma-separated parameters. Type annotations per-parameter are optional.' },
      { key: '{ Body }',       type: 'required', desc: 'One or more statements followed by a return statement.' },
    ] as row}
      <div class="kv-row">
        <code class="kv-key">{row.key}</code>
        <span class="kv-type">{row.type}</span>
        <span class="kv-desc">{row.desc}</span>
      </div>
    {/each}
  </div>

  <h2>Scope Declaration — Position Matters</h2>
  <p>
    When a scope restriction is declared, it <strong>must appear between the return type
    annotation and the opening parenthesis</strong> of the parameter list. Placing it after
    the closing parenthesis is a syntax error.
  </p>
  <pre><code>{scopeExample}</code></pre>

  <h2>Return Types</h2>
  <p>The return type annotation is always required.</p>
  <pre><code>{returnTypes}</code></pre>

  <h2>Variables</h2>
  <p>
    Variables are local to the function body. <code>let</code> is immutable by default.
    <code>let mut</code> allows reassignment. <code>const</code> requires a literal on the
    right-hand side and cannot reference other variables.
  </p>
  <pre><code>{variablesExample}</code></pre>

  <h2>Operators</h2>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Operator</th><th>Kind</th><th>Description</th><th>Example</th></tr></thead>
      <tbody>
        {#each operatorsTable as row}
          <tr>
            <td><code>{row.op}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.kind}</td>
            <td style="color:var(--muted-foreground)">{row.desc}</td>
            <td><code style="color:var(--primary);font-size:0.8125rem">{row.example}</code></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Arithmetic and Operators in Practice</h2>
  <pre><code>{arithmeticExample}</code></pre>

  <h2>Control Flow</h2>
  <p>
    Three forms: ternary expressions (preferred for single-value branches), <code>if:</code>
    / <code>elif:</code> / <code>else</code> blocks for multi-statement branches, and
    <code>chk:</code> for pattern-matching on enum values or literals.
    The <code>miss</code> keyword is the default/fallthrough arm in a <code>chk:</code> block.
  </p>
  <pre><code>{controlFlowExample}</code></pre>

  <h2>Calling Built-ins and Other Functions</h2>
  <p>
    A QuickFunc may call any static built-in object (<code>Math</code>, <code>Array</code>,
    <code>DateTime</code>, <code>Random</code>, <code>Guid</code>, <code>IpAddress</code>,
    <code>Dix</code>, <code>Enum</code>) and any instance method on a value
    (<code>.toLower()</code>, <code>.length()</code>, <code>.toInt()</code>, etc.).
    It may also call other QuickFuncs defined earlier in the same <code>@QUICKFUNCS</code> block.
    Functions from imported namespaces are called with the alias prefix.
  </p>
  <pre><code>{builtinCallsExample}</code></pre>

  <h2>Calling Imported Functions</h2>
  <pre><code>{importedFunctionsExample}</code></pre>

  <h2>No Loops</h2>
  <p>
    DixScript has no loop constructs. Repetition is handled at the <code>@DATA</code> level
    by calling a QuickFunc multiple times within an array group, or by using Array built-in
    constructors like <code>Array.range()</code> and <code>Array.fill()</code>.
    Limited recursion is allowed — the compiler enforces a maximum recursion depth.
  </p>
  <pre><code>{noLoopsExample}</code></pre>

  <h2>What Is and Is Not Allowed</h2>
  <pre><code>{invalidExamples}</code></pre>

  <h2>What QuickFuncs Cannot Do</h2>
  <ul>
    <li>No loops — <code>for</code>, <code>while</code>, <code>forEach</code> do not exist.</li>
    <li>Cannot read <code>@DATA</code> property values — data flows one way: QuickFuncs are resolved first, then their results populate <code>@DATA</code>.</li>
    <li>Cannot mutate external state — every function is a pure compile-time transformation.</li>
    <li>Cannot define nested functions — function bodies cannot contain <code>~</code> declarations.</li>
    <li>Cannot use arithmetic, builtin calls, or instance method calls directly in <code>@DATA</code> — those belong inside a QuickFunc body.</li>
    <li>Cannot call functions defined later in the same block (forward references are not supported — define helpers before callers).</li>
  </ul>
</div>

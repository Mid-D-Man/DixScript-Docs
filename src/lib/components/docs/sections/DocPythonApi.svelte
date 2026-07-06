<!-- src/lib/components/docs/sections/DocPythonApi.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `pip install midmanstudio-mdix

# Pre-built wheels — no Rust toolchain required.
# Requires Python 3.8+

# Optional ML extras (numpy / pandas / torch / tensorflow) — see the
# "ML Extras" section below. Install whichever of those you actually use;
# midmanstudio.mdix.ml imports them lazily.`;

  const quickStart = `from midmanstudio.mdix import MdixDatabase, MdixBuilder, MdixError, MdixResult

# Context manager — auto-frees the native handle
with MdixDatabase.load_str('@DATA( port = 8080, host = "localhost" )') as db:
    port = db.get_int("port")
    host = db.get_string("host", "localhost")   # second arg = default if missing
    keys = db.get_keys()

# Direct load — raises MdixError on failure
db = MdixDatabase.load("config.mdix")
try:
    port = db.get_int("server.port")
except MdixError as e:
    print(f"load failed: {e}")
finally:
    db.close()`;

  const railway = `from midmanstudio.mdix import MdixDatabase

# Railway-style chaining — every try_* method returns MdixResult, never raises
value = (MdixDatabase.try_load_str(source)
         .and_then(lambda db: db.try_get_int("port"))
         .ensure(lambda p: p > 1024, "port must be > 1024")
         .map(lambda p: p * 2)
         .unwrap_or(3000))

# fold — explicit success / failure branches, one call
message = (MdixDatabase.try_load("config.mdix")
           .and_then(lambda db: db.try_get_string("server.host"))
           .map(str.upper)
           .tap(lambda v: print(f"host = {v}"))
           .fold(
               on_success=lambda v: f"Loaded: {v}",
               on_failure=lambda e: f"Failed: {e}"))

result = MdixDatabase.try_load("config.mdix")
if result:                       # bool(result) is True on success
    db = result.value
else:
    print(result.error)

# Full combinator set: ok / err / is_success / is_failure / value / error /
# or_raise / unwrap / unwrap_or / unwrap_or_else / map / and_then / ensure /
# or_ / fold / tap / tap_error`;

  const loadingApi = `from midmanstudio.mdix import MdixDatabase

# Direct — raise on failure
MdixDatabase.load(path)
MdixDatabase.load_str(source)
MdixDatabase.from_json(json_str)
MdixDatabase.from_toml(toml_str)
MdixDatabase.load_encrypted(enc_path, key_path=None)
MdixDatabase.load_encrypted_password(enc_path, password)

# Railway — never raise
MdixDatabase.try_load(path)
MdixDatabase.try_load_str(source)
MdixDatabase.try_from_json(json_str)
MdixDatabase.try_from_toml(toml_str)`;

  const readApi = `db.exists("server.host")           # bool
db.get_type("server.port")         # str, e.g. "int"
db.get_array_length("enemies")     # int
db.get_keys(prefix="")             # List[str]

db.get_string("server.host", default=None)
db.get_int("server.port", default=None)
db.get_float("ratio", default=None)
db.get_double("pi", default=None)
db.get_bool("debug", default=None)
db.get_json("server")              # raw JSON string of a nested object/array
db.get_enum_name("log_level")      # "LogLevel"
db.get_enum_field("log_level")     # "INFO"

# try_* twins — return MdixResult instead of raising
db.try_get_string("server.host")
db.try_get_int("server.port")
db.try_get_float("ratio")
db.try_get_double("pi")
db.try_get_bool("debug")
db.try_get_json("server")

# Export
db.to_json(indented=True)
db.to_toml()
db.to_mdix()`;

  const builderApi = `from midmanstudio.mdix import MdixBuilder

db = (MdixBuilder()
      .set_config("version", "1.0.0")
      .add_enum("LogLevel", ["DEBUG", "INFO", "WARN", "ERROR"])
      # tier 1 — flat properties must come first
      .set_string("app_name", "MyGame")
      .set_int("port", 8080)
      .set_bool("ssl", True)
      .set_date("release", "2025-12-31")
      .set_hex_color("brand", "#2D6A9F")
      .set_enum("log_level", "LogLevel", "INFO")
      # tier 2 — grouped, after all flat properties
      .with_table_properties("server", {"host": "localhost", "port": 8080})
      .with_group_array("enemies", [
          {"name": "Goblin", "hp": 50},
          {"name": "Orc",    "hp": 100},
      ])
      .to_database())

# Or get the source string / a railway result instead of raising
src = MdixBuilder().set_string("a", "b").serialize()
result = MdixBuilder().set_string("a", "b").try_to_database()

# reset_grouped() / reset() clear tier-2-only or everything, same as the
# Lua and Go builders, for reusing a builder across multiple generations.`;

  const mergerApi = `from midmanstudio.mdix import MdixMerger

# Merge multiple .mdix sources with weighted or strict conflict resolution
db = (MdixMerger()
      .with_strategy("primary_wins")        # or "secondary_wins", etc.
      .with_array_strategy("concat")        # array-specific merge strategy
      .merge_strings([
          ("base",    '@DATA( name = "App", port = 8080 )', 1.0),
          ("overlay", '@DATA( name = "Override", debug = true )', 0.5),
      ]))

# From files instead of strings
db2 = MdixMerger().merge_files(["base.mdix", "overrides.mdix"])
db3 = MdixMerger().merge_files_weighted([("base.mdix", 1.0), ("local.mdix", 0.8)])

# Railway variants
result  = MdixMerger().try_merge_files(["base.mdix", "overrides.mdix"])
result2 = MdixMerger().try_merge_files_weighted([("base.mdix", 1.0)])`;

  const schemaApi = `from midmanstudio.mdix import MdixSchemaBuilder

report = (MdixSchemaBuilder()
          .require_string("name")
          .require_int("port")
          .require_bool("ssl")
          .require_long("session_id")
          .require_array("enemies")
          .require_enum("log_level")
          .optional_bool("debug")
          .optional_string("description")
          .with_description("basic app config")
          .validate(db))

if not report.is_valid:
    for err in report.errors:
        print(f"{err.path}: expected {err.expected}, got {err.actual} ({err.kind})")
    print(report.failed_paths())
    print(report.errors_of_kind("type_mismatch"))

print(bool(report))   # same as report.is_valid`;

  const mlNumpy = `from midmanstudio.mdix import MdixDatabase, MdixBuilder
from midmanstudio.mdix.ml import MdixNumpy

# Store a numpy array as a blob field, with shape/dtype metadata alongside it
import numpy as np
weights = np.random.rand(64, 128).astype(np.float32)

builder = MdixBuilder()
MdixNumpy.store(builder, "model.weights", weights)
db = builder.to_database()

# Load it back
arr = MdixNumpy.load(db, "model.weights")          # -> np.ndarray, raises on failure
result = MdixNumpy.try_load(db, "model.weights")    # -> MdixResult

info = MdixNumpy.array_info(db, "model.weights")    # {"shape": [...], "dtype": "...", ...}`;

  const mlTensor = `from midmanstudio.mdix.ml import MdixTensor

# Same idea, framework-specific loaders on top of the same stored blob
MdixTensor.store(builder, "model.weights", weights)

np_arr    = MdixTensor.load_numpy(db, "model.weights")
torch_t   = MdixTensor.load_torch(db, "model.weights")   # requires torch installed
tf_tensor = MdixTensor.load_tf(db, "model.weights")       # requires tensorflow installed`;

  const mlDataFrame = `from midmanstudio.mdix.ml import MdixDataFrame

# Store/load a pandas DataFrame as a .mdix group array + column metadata
import pandas as pd
df = pd.DataFrame({"epoch": [1, 2, 3], "loss": [0.9, 0.5, 0.2]})

MdixDataFrame.store(builder, "training.history", df)
loaded = MdixDataFrame.load(db, "training.history")       # -> pd.DataFrame
result = MdixDataFrame.try_load(db, "training.history")    # -> MdixResult`;

  const mlConfig = `from midmanstudio.mdix.ml import MdixMLConfig

# A small convention layer over MdixDatabase/MdixBuilder aimed at ML
# experiment configs — hyperparameters, architecture, dataset paths, and
# label maps all read back with typed accessors instead of raw get_*() calls.
cfg = MdixMLConfig.load("experiment.mdix")

lr          = cfg.hyperparameter("learning_rate", default=1e-3)
layers      = cfg.architecture("hidden_layers")
dataset     = cfg.dataset_path("train")
epochs      = cfg.training("epochs", default=10)
label_map   = cfg.label_map("labels")            # -> Dict[str, int]
all_hparams = cfg.all_hyperparameters()

weights     = cfg.load_weights("model.weights")   # np.ndarray, via MdixNumpy under the hood
info        = cfg.weights_info("model.weights")

# Build one programmatically instead of loading from disk
cfg2 = MdixMLConfig.builder()  # -> MdixBuilder pre-shaped for ML config conventions`;
</script>

<div class="doc-page">
  <h1>Python Runtime API</h1>
  <p class="page-lead">
    <code>midmanstudio-mdix</code> is a PyO3 binding over the Rust core,
    shipped as pre-built wheels — no Rust toolchain required. Beyond the
    core load/read/build surface, it ships <code>MdixMerger</code> and
    <code>MdixSchemaBuilder</code> (neither of which are in the package's
    own README) plus an ML-focused extras module for storing model weights,
    training history, and experiment configs directly inside
    <code>.mdix</code> files.
  </p>

  <h2>Install</h2>
  <CodeBlock code={install} lang="bash" />

  <h2>Quick Start</h2>
  <CodeBlock code={quickStart} lang="python" />

  <h2>MdixResult — Railway Programming</h2>
  <p>
    Every <code>load</code>/<code>get</code> method has a <code>try_*</code>
    twin that returns <code>MdixResult</code> instead of raising — chain
    operations with <code>and_then</code>/<code>map</code>/<code>ensure</code>
    instead of nested try/except.
  </p>
  <CodeBlock code={railway} lang="python" />

  <h2>Loading</h2>
  <CodeBlock code={loadingApi} lang="python" />

  <h2>Reading Values</h2>
  <CodeBlock code={readApi} lang="python" />

  <h2>MdixBuilder — Building Programmatically</h2>
  <p>
    Two-tier <code>@DATA</code> ordering is enforced: flat properties must
    be added before any table properties or group arrays, same as every
    other language binding.
  </p>
  <CodeBlock code={builderApi} lang="python" />

  <h2>MdixMerger — Combining Sources</h2>
  <CodeBlock code={mergerApi} lang="python" />

  <h2>MdixSchemaBuilder — Validation</h2>
  <CodeBlock code={schemaApi} lang="python" />

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Description</th></tr></thead>
      <tbody>
        {#each [
          { m: '.require(path, type) / .require_string/int/long/float/double/bool/array/object/enum(path)', d: 'Declare a required field. Typed shorthands for the common cases.' },
          { m: '.optional(path, type) / .optional_string/int/long/float/double/bool/array/object(path)', d: 'Declare an optional field — absence is not an error.' },
          { m: '.with_description(text)',   d: 'Attach a human-readable description to the schema (for tooling/errors).' },
          { m: '.field_count() / .paths()', d: 'Introspect the declared schema itself.' },
          { m: '.validate(db)',             d: 'Run validation, returns MdixValidationReport.' },
        ] as row}
          <tr>
            <td><code style="font-size:0.75rem">{row.m}</code></td>
            <td style="color:var(--muted-foreground);font-size:0.8125rem">{row.d}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>ML Extras <span class="badge">Python-only</span></h2>
  <p>
    <code>midmanstudio.mdix.ml</code> is an optional module (imports numpy /
    pandas / torch / tensorflow lazily, only when you actually call into
    them) that layers ML-experiment conventions on top of the core
    runtime. There's no equivalent in any other language binding — if
    you're storing model weights or training metrics in <code>.mdix</code>
    from another language, you'd currently do it by hand as a
    <code>blob</code> field.
  </p>

  <h3>MdixNumpy — array storage</h3>
  <CodeBlock code={mlNumpy} lang="python" />

  <h3>MdixTensor — framework-agnostic tensor loading</h3>
  <CodeBlock code={mlTensor} lang="python" />

  <h3>MdixDataFrame — pandas DataFrames</h3>
  <CodeBlock code={mlDataFrame} lang="python" />

  <h3>MdixMLConfig — experiment config convention layer</h3>
  <CodeBlock code={mlConfig} lang="python" />
</div>

<style>
  .badge {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    background: rgba(46, 168, 160, 0.14);
    color: #2ea8a0;
    border: 1px solid rgba(46, 168, 160, 0.35);
    vertical-align: middle;
    margin-left: 0.4rem;
  }
</style>

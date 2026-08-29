<!-- src/lib/components/docs/sections/python/DocPythonMlExtras.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
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
  <h1>ML Extras <span class="badge">Python-only</span></h1>
  <p class="page-lead">
    Part of the <a href="#python-api">Python Runtime API</a>.
    <code>midmanstudio.mdix.ml</code> is an optional module (imports numpy /
    pandas / torch / tensorflow lazily, only when you actually call into
    them) that layers ML-experiment conventions on top of the core
    runtime. There's no equivalent in any other language binding — if
    you're storing model weights or training metrics in <code>.mdix</code>
    from another language, you'd currently do it by hand as a
    <code>blob</code> field.
  </p>

  <h2>MdixNumpy — array storage</h2>
  <CodeBlock code={mlNumpy} lang="python" />

  <h2>MdixTensor — framework-agnostic tensor loading</h2>
  <CodeBlock code={mlTensor} lang="python" />

  <h2>MdixDataFrame — pandas DataFrames</h2>
  <CodeBlock code={mlDataFrame} lang="python" />

  <h2>MdixMLConfig — experiment config convention layer</h2>
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

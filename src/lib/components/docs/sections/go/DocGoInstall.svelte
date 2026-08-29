<!-- src/lib/components/docs/sections/go/DocGoInstall.svelte -->
<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  const install = `go get github.com/Mid-D-Man/dixscript-go

# Requirements:
#   Go 1.21+
#   CGO_ENABLED=1        (default for native builds — does NOT work with CGO_ENABLED=0)
#   a C compiler (gcc/clang), needed by cgo
#
# One-time setup after cloning DixScript-Rust:
#   cargo build -p mdix-ffi --release
#   mkdir -p mdix-go/internal/lib/linux-amd64
#   cp target/release/libmdix_ffi.so mdix-go/internal/lib/linux-amd64/
#   # (darwin-arm64 / windows-amd64 equivalents also exist under internal/lib/)`;
</script>

<div class="doc-page">
  <h1>Install</h1>
  <p class="page-lead">Part of the <a href="#go-api">Go Runtime API</a>.</p>
  <CodeBlock code={install} lang="bash" />
</div>

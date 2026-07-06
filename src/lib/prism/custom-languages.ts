// src/lib/prism/custom-languages.ts
//
// Prism has no built-in grammar for DixScript (.mdix) or Odin. This module
// registers minimal-but-useful grammars for both. Import this once, before
// any Prism.highlight() call — CodeBlock.svelte does this for you.

import Prism from 'prismjs';

Prism.languages.dixscript = {
  comment: /\/\/.*/,
  section: {
    pattern: /@(CONFIG|ENUMS|QUICKFUNCS|DATA|DLM|SECURITY|IMPORTS)\b/,
    alias: 'keyword',
  },
  string: {
    pattern: /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/,
    greedy: true,
  },
  'interpolated-string': {
    pattern: /\$"(?:\\.|\{[^}]*\}|[^"\\\n])*"/,
    greedy: true,
    alias: 'string',
  },
  'type-annotation': {
    pattern: /<[a-zA-Z][a-zA-Z0-9_<>]*>/,
    alias: 'class-name',
  },
  prefixed: {
    // t:(...) tuple, b:(...) blob, r:(...) regex literals
    pattern: /\b[tbr]:(?=\()/,
    alias: 'function',
  },
  quickfunc: {
    pattern: /~[a-zA-Z_][a-zA-Z0-9_]*(?=\()/,
    alias: 'function',
  },
  boolean: /\b(?:true|false|null)\b/,
  number:
    /\b0[xX][0-9a-fA-F_]+[Ll]?\b|\b0[bB][01_]+[Ll]?\b|\b\d[\d_]*\.\d[\d_]*(?:[eE][+-]?\d+)?[fF]?\b|\b\d[\d_]*[Ll]?\b/,
  operator: /->|::|=>|[=+\-*/%]/,
  punctuation: /[{}()\[\],.:;]/,
};

Prism.languages.odin = {
  comment: [
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
    { pattern: /\/\/.*/, greedy: true },
  ],
  string: {
    pattern: /"(?:\\.|[^"\\\n])*"|`[^`]*`/,
    greedy: true,
  },
  keyword:
    /\b(?:package|import|using|proc|struct|union|enum|map|dynamic|distinct|defer|return|if|else|for|switch|case|in|not_in|break|continue|fallthrough|do|when|where|context|foreign|bit_set|typeid|cast|transmute|auto_cast|or_else|or_return)\b/,
  boolean: /\b(?:true|false|nil)\b/,
  'class-name': {
    pattern: /\b(?:i8|i16|i32|i64|i128|u8|u16|u32|u64|u128|int|uint|f16|f32|f64|bool|string|cstring|rune|rawptr|any|byte)\b/,
    alias: 'builtin',
  },
  function: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*::\s*proc)|\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/,
  number: /\b0[xX][0-9a-fA-F_]+\b|\b0[bB][01_]+\b|\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?\b/,
  operator: /::|:=|->|\.\.[<=]?|[=+\-*/%<>!&|^~]+/,
  punctuation: /[{}()\[\],.:;]/,
};

export {};

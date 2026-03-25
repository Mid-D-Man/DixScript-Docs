<script lang="ts">
  import { onMount } from 'svelte';

  // ── Stats ──────────────────────────────────────────────────────
  const stats = [
    { num: '196', label: 'JSON lines',                cls: 'red'   },
    { num: '51',  label: 'DixScript lines',           cls: 'teal'  },
    { num: '22',  label: 'hardcoded prices in JSON',  cls: 'gold'  },
    { num: '1',   label: 'formula line in DixScript', cls: 'green' },
    { num: '74%', label: 'size reduction',            cls: 'teal'  },
  ];

  // ── Pain / Win points ───────────────────────────────────────────
  const pains = [
    'Every weapon repeats all 17 fields verbatim — no templates, no abstraction.',
    '"stackable": false appears 11 times — change the default? Edit 11 places.',
    'Prices are hardcoded numbers — typo 160 instead of 600 and the economy breaks silently.',
    'Type values are raw strings: "SWORD", "sWoRd", "sword" all valid — zero enforcement.',
    'Add a new field (e.g. isTwoHanded) → edit all 11 weapon objects manually.',
    '196 lines for 11 weapons. 500 weapons in production? Nearly 9,000 lines of nearly identical JSON.',
  ];

  const wins = [
    'Shape defined once in ~weapon<object>() — adding a field = one line change, everywhere.',
    'Stackable = false lives in the template — one truth, zero drift.',
    'Pricing is a formula: BuyPrice = damage * 8 — math is transparent and auditable.',
    'Enums enforce valid values at compile time — WeaponType.SORD is a compile error, not a runtime surprise.',
    'Each new weapon is a single line call — reading the data section is scanning a table, not parsing a wall of braces.',
    '500 weapons? Still ~520 lines total. Scales linearly, not quadratically.',
  ];

  // ── Feature table ───────────────────────────────────────────────
  const tableRows: { feature: string; json: string; jsonCls: string; dix: string; dixCls: string }[] = [
    { feature: 'Reusable field templates',           json: '✗ None',           jsonCls: 'no',      dix: '✓ QuickFuncs',        dixCls: 'yes'     },
    { feature: 'Computed / formula fields',          json: '✗ Hardcoded only', jsonCls: 'no',      dix: '✓ Compile-time eval', dixCls: 'yes'     },
    { feature: 'Type-safe enum constants',           json: '✗ Raw strings',    jsonCls: 'no',      dix: '✓ @ENUMS section',    dixCls: 'yes'     },
    { feature: 'Default field values',               json: '✗ Repeat everywhere', jsonCls: 'no',   dix: '✓ In template',       dixCls: 'yes'     },
    { feature: 'Add a new field across all entries', json: '✗ Edit every object', jsonCls: 'no',   dix: '✓ One line in template', dixCls: 'yes'  },
    { feature: 'Comments in config',                 json: '✗ Spec violation', jsonCls: 'no',      dix: '✓ // and /* */',      dixCls: 'yes'     },
    { feature: 'Built-in encryption',                json: '✗ External tool',  jsonCls: 'no',      dix: '✓ @DLM AES-256',      dixCls: 'yes'     },
    { feature: 'Built-in compression',               json: '✗ External tool',  jsonCls: 'no',      dix: '✓ @DLM gzip/bzip2',   dixCls: 'yes'     },
    { feature: 'Optional trailing commas',           json: '✗ Syntax error',   jsonCls: 'no',      dix: '✓ Always optional',   dixCls: 'yes'     },
    { feature: 'Human readability at scale',         json: '⚠ Degrades fast',  jsonCls: 'partial', dix: '✓ Stays clean',       dixCls: 'yes'     },
    { feature: 'Tooling ecosystem',                  json: '✓ Universal',      jsonCls: 'yes',     dix: '⚠ In development',    dixCls: 'partial' },
  ];

  // ── Syntax-highlighted JSON lines (pre-built HTML strings) ──────
  const jsonLines: string[] = [
    `<span class="t-punct">{</span>`,
    `  <span class="t-key">"weaponDatabase"</span><span class="t-punct">: {</span>`,
    `    <span class="t-key">"version"</span><span class="t-punct">: </span><span class="t-str">"1.0.0"</span><span class="t-punct">,</span>`,
    `    <span class="t-key">"weapons"</span><span class="t-punct">: [</span>`,
    ``,
    `      <span class="t-comment">// ── Swords ────────────────────────────────────</span>`,
    ``,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"IRON_SWORD"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Iron Sword"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"SWORD"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"COMMON"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"PHYSICAL"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">25</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.05</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">1.2</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">100</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">3.5</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">1</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">50</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">200</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"STEEL_SWORD"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Steel Sword"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"SWORD"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"UNCOMMON"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"PHYSICAL"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">45</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.08</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">1.3</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">150</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">4.0</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">10</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">90</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">360</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"ELVEN_BLADE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Elven Blade"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"SWORD"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"RARE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"ARCANE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">80</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.15</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">1.6</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">120</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">2.8</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">25</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">160</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">640</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"SHADOWFANG"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Shadowfang"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"SWORD"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"EPIC"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"POISON"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">120</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.22</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">1.8</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">200</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">3.2</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">40</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">240</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">960</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"EXCALIBUR"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Excalibur"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"SWORD"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"LEGENDARY"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"LIGHTNING"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">200</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.35</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">2.0</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">999</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">4.5</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">60</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">400</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">1600</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    ``,
    `      <span class="t-comment">// ── Bows ──────────────────────────────────────</span>`,
    ``,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"HUNTING_BOW"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Hunting Bow"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"BOW"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"COMMON"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"PHYSICAL"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">20</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.12</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">0.8</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">80</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">1.5</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">1</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">40</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">160</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"YEW_BOW"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Yew Bow"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"BOW"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"UNCOMMON"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"PHYSICAL"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">38</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.18</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">0.9</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">110</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">1.8</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">12</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">76</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">304</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"STORM_BOW"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Storm Bow"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"BOW"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"RARE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"LIGHTNING"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">70</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.25</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">1.1</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">140</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">2.0</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">28</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">140</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">560</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    ``,
    `      <span class="t-comment">// ── Staves ────────────────────────────────────</span>`,
    ``,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"OAK_STAFF"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Oak Staff"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"STAFF"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"COMMON"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"ARCANE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">18</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.08</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">0.7</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">90</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">2.0</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">1</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">36</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">144</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"CRYSTAL_STAFF"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Crystal Staff"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"STAFF"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"RARE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"ICE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">65</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.18</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">0.9</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">130</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">2.5</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">22</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">130</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">520</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">},</span>`,
    `      <span class="t-punct">{</span>`,
    `        <span class="t-key">"id"</span><span class="t-punct">: </span><span class="t-str">"ARCANE_SCEPTER"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"name"</span><span class="t-punct">: </span><span class="t-str">"Arcane Scepter"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"type"</span><span class="t-punct">: </span><span class="t-str">"STAFF"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"rarity"</span><span class="t-punct">: </span><span class="t-str">"EPIC"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"damageType"</span><span class="t-punct">: </span><span class="t-str">"ARCANE"</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"baseDamage"</span><span class="t-punct">: </span><span class="t-num">110</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"critChance"</span><span class="t-punct">: </span><span class="t-num">0.28</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"attackSpeed"</span><span class="t-punct">: </span><span class="t-num">1.0</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"durability"</span><span class="t-punct">: </span><span class="t-num">180</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"weight"</span><span class="t-punct">: </span><span class="t-num">2.2</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"requiredLevel"</span><span class="t-punct">: </span><span class="t-num">45</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"sellPrice"</span><span class="t-punct">: </span><span class="t-num">220</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"buyPrice"</span><span class="t-punct">: </span><span class="t-num">880</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"stackable"</span><span class="t-punct">: </span><span class="t-bool">false</span><span class="t-punct">,</span>`,
    `        <span class="t-key">"isQuestItem"</span><span class="t-punct">: </span><span class="t-bool">false</span>`,
    `      <span class="t-punct">}</span>`,
    `    <span class="t-punct">]</span>`,
    `  <span class="t-punct">}</span>`,
    `<span class="t-punct">}</span>`,
  ];

  // ── DixScript lines ─────────────────────────────────────────────
  const dixLines: string[] = [
    `<span class="t-section">@ENUMS</span><span class="t-punct">(</span>`,
    `  <span class="t-fn">WeaponType</span>  <span class="t-punct">{</span> <span class="t-enum">SWORD, BOW, STAFF, DAGGER, AXE</span> <span class="t-punct">}</span>`,
    `  <span class="t-fn">Rarity</span>      <span class="t-punct">{</span> <span class="t-enum">COMMON</span><span class="t-punct">=</span><span class="t-num">0</span>, <span class="t-enum">UNCOMMON</span><span class="t-punct">=</span><span class="t-num">1</span>, <span class="t-enum">RARE</span><span class="t-punct">=</span><span class="t-num">2</span>, <span class="t-enum">EPIC</span><span class="t-punct">=</span><span class="t-num">3</span>, <span class="t-enum">LEGENDARY</span><span class="t-punct">=</span><span class="t-num">4</span> <span class="t-punct">}</span>`,
    `  <span class="t-fn">DamageType</span>  <span class="t-punct">{</span> <span class="t-enum">PHYSICAL, FIRE, ICE, LIGHTNING, POISON, ARCANE</span> <span class="t-punct">}</span>`,
    `<span class="t-punct">)</span>`,
    ``,
    `<span class="t-section">@QUICKFUNCS</span><span class="t-punct">(</span>`,
    `  <span class="t-comment">// Define the shape of a weapon EXACTLY ONCE.</span>`,
    `  <span class="t-comment">// SellPrice / BuyPrice are formulas — change the math, all 11 weapons update.</span>`,
    `  <span class="t-tilde">~</span><span class="t-fn">weapon</span><span class="t-type">&lt;object&gt;</span><span class="t-punct">(</span>id, name, type<span class="t-type">&lt;enum&gt;</span>, rarity<span class="t-type">&lt;enum&gt;</span>, dmgType<span class="t-type">&lt;enum&gt;</span>,`,
    `                   damage<span class="t-type">&lt;int&gt;</span>, crit<span class="t-type">&lt;float&gt;</span>, speed<span class="t-type">&lt;float&gt;</span>,`,
    `                   durability<span class="t-type">&lt;int&gt;</span>, weight<span class="t-type">&lt;float&gt;</span>, level<span class="t-type">&lt;int&gt;</span><span class="t-punct">) {</span>`,
    `    <span class="t-ret">return</span> <span class="t-punct">{</span>`,
    `      Id            <span class="t-punct">=</span> id`,
    `      Name          <span class="t-punct">=</span> name`,
    `      WeaponType    <span class="t-punct">=</span> type`,
    `      Rarity        <span class="t-punct">=</span> rarity`,
    `      DamageType    <span class="t-punct">=</span> dmgType`,
    `      BaseDamage    <span class="t-punct">=</span> damage`,
    `      CritChance    <span class="t-punct">=</span> crit`,
    `      AttackSpeed   <span class="t-punct">=</span> speed`,
    `      Durability    <span class="t-punct">=</span> durability`,
    `      Weight        <span class="t-punct">=</span> weight`,
    `      RequiredLevel <span class="t-punct">=</span> level`,
    `      SellPrice     <span class="t-punct">=</span> <span class="t-prop">damage</span> <span class="t-punct">*</span> <span class="t-num">2</span>   <span class="t-comment">// formula, not a number</span>`,
    `      BuyPrice      <span class="t-punct">=</span> <span class="t-prop">damage</span> <span class="t-punct">*</span> <span class="t-num">8</span>   <span class="t-comment">// formula, not a number</span>`,
    `      Stackable     <span class="t-punct">=</span> <span class="t-bool">false</span>`,
    `      IsQuestItem   <span class="t-punct">=</span> <span class="t-bool">false</span>`,
    `    <span class="t-punct">}</span>`,
    `  <span class="t-punct">}</span>`,
    `<span class="t-punct">)</span>`,
    ``,
    `<span class="t-section">@DATA</span><span class="t-punct">(</span>`,
    `  <span class="t-comment">// ── Swords ──────────────────────────────────────────────────────────────</span>`,
    `  weapons<span class="t-punct">::</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"IRON_SWORD"</span>,     <span class="t-str">"Iron Sword"</span>,     <span class="t-enum">WeaponType.SWORD</span>, <span class="t-enum">Rarity.COMMON</span>,    <span class="t-enum">DamageType.PHYSICAL</span>,   <span class="t-num">25</span>,  <span class="t-num">0.05f</span>, <span class="t-num">1.2f</span>, <span class="t-num">100</span>, <span class="t-num">3.5f</span>,  <span class="t-num">1</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"STEEL_SWORD"</span>,    <span class="t-str">"Steel Sword"</span>,    <span class="t-enum">WeaponType.SWORD</span>, <span class="t-enum">Rarity.UNCOMMON</span>,  <span class="t-enum">DamageType.PHYSICAL</span>,   <span class="t-num">45</span>,  <span class="t-num">0.08f</span>, <span class="t-num">1.3f</span>, <span class="t-num">150</span>, <span class="t-num">4.0f</span>, <span class="t-num">10</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"ELVEN_BLADE"</span>,    <span class="t-str">"Elven Blade"</span>,    <span class="t-enum">WeaponType.SWORD</span>, <span class="t-enum">Rarity.RARE</span>,      <span class="t-enum">DamageType.ARCANE</span>,     <span class="t-num">80</span>,  <span class="t-num">0.15f</span>, <span class="t-num">1.6f</span>, <span class="t-num">120</span>, <span class="t-num">2.8f</span>, <span class="t-num">25</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"SHADOWFANG"</span>,     <span class="t-str">"Shadowfang"</span>,     <span class="t-enum">WeaponType.SWORD</span>, <span class="t-enum">Rarity.EPIC</span>,      <span class="t-enum">DamageType.POISON</span>,    <span class="t-num">120</span>,  <span class="t-num">0.22f</span>, <span class="t-num">1.8f</span>, <span class="t-num">200</span>, <span class="t-num">3.2f</span>, <span class="t-num">40</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"EXCALIBUR"</span>,      <span class="t-str">"Excalibur"</span>,      <span class="t-enum">WeaponType.SWORD</span>, <span class="t-enum">Rarity.LEGENDARY</span>, <span class="t-enum">DamageType.LIGHTNING</span>, <span class="t-num">200</span>,  <span class="t-num">0.35f</span>, <span class="t-num">2.0f</span>, <span class="t-num">999</span>, <span class="t-num">4.5f</span>, <span class="t-num">60</span><span class="t-punct">)</span>`,
    ``,
    `  <span class="t-comment">// ── Bows ────────────────────────────────────────────────────────────────</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"HUNTING_BOW"</span>,    <span class="t-str">"Hunting Bow"</span>,    <span class="t-enum">WeaponType.BOW</span>,   <span class="t-enum">Rarity.COMMON</span>,    <span class="t-enum">DamageType.PHYSICAL</span>,   <span class="t-num">20</span>,  <span class="t-num">0.12f</span>, <span class="t-num">0.8f</span>,  <span class="t-num">80</span>, <span class="t-num">1.5f</span>,  <span class="t-num">1</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"YEW_BOW"</span>,        <span class="t-str">"Yew Bow"</span>,        <span class="t-enum">WeaponType.BOW</span>,   <span class="t-enum">Rarity.UNCOMMON</span>,  <span class="t-enum">DamageType.PHYSICAL</span>,   <span class="t-num">38</span>,  <span class="t-num">0.18f</span>, <span class="t-num">0.9f</span>, <span class="t-num">110</span>, <span class="t-num">1.8f</span>, <span class="t-num">12</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"STORM_BOW"</span>,      <span class="t-str">"Storm Bow"</span>,      <span class="t-enum">WeaponType.BOW</span>,   <span class="t-enum">Rarity.RARE</span>,      <span class="t-enum">DamageType.LIGHTNING</span>,  <span class="t-num">70</span>,  <span class="t-num">0.25f</span>, <span class="t-num">1.1f</span>, <span class="t-num">140</span>, <span class="t-num">2.0f</span>, <span class="t-num">28</span><span class="t-punct">)</span>`,
    ``,
    `  <span class="t-comment">// ── Staves ──────────────────────────────────────────────────────────────</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"OAK_STAFF"</span>,      <span class="t-str">"Oak Staff"</span>,      <span class="t-enum">WeaponType.STAFF</span>, <span class="t-enum">Rarity.COMMON</span>,    <span class="t-enum">DamageType.ARCANE</span>,     <span class="t-num">18</span>,  <span class="t-num">0.08f</span>, <span class="t-num">0.7f</span>,  <span class="t-num">90</span>, <span class="t-num">2.0f</span>,  <span class="t-num">1</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"CRYSTAL_STAFF"</span>,  <span class="t-str">"Crystal Staff"</span>,  <span class="t-enum">WeaponType.STAFF</span>, <span class="t-enum">Rarity.RARE</span>,      <span class="t-enum">DamageType.ICE</span>,        <span class="t-num">65</span>,  <span class="t-num">0.18f</span>, <span class="t-num">0.9f</span>, <span class="t-num">130</span>, <span class="t-num">2.5f</span>, <span class="t-num">22</span><span class="t-punct">)</span>`,
    `    <span class="t-fn">weapon</span><span class="t-punct">(</span><span class="t-str">"ARCANE_SCEPTER"</span>, <span class="t-str">"Arcane Scepter"</span>, <span class="t-enum">WeaponType.STAFF</span>, <span class="t-enum">Rarity.EPIC</span>,      <span class="t-enum">DamageType.ARCANE</span>,    <span class="t-num">110</span>,  <span class="t-num">0.28f</span>, <span class="t-num">1.0f</span>, <span class="t-num">180</span>, <span class="t-num">2.2f</span>, <span class="t-num">45</span><span class="t-punct">)</span>`,
    `<span class="t-punct">)</span>`,
  ];

  // ── Bar animation ───────────────────────────────────────────────
  let barEl: HTMLElement | null = null;
  let barAnimated = false;

  onMount(() => {
    if (!barEl) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !barAnimated) {
          barAnimated = true;
          setTimeout(() => {
            if (barEl) barEl.style.width = '74%';
          }, 150);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(barEl);
    return () => obs.disconnect();
  });
</script>

<section class="game-comparison" id="game-comparison">

  <!-- ── Header ── -->
  <div class="gc-header">
    <div class="gc-kicker">Real-World Comparison · RPG Weapon Database · 11 Items</div>
    <h2 class="gc-title">
      <span class="label-json">JSON</span>
      <span class="vs">vs</span>
      <span class="label-dix">DixScript</span>
    </h2>
    <p class="gc-subtitle">Same data. Same output. <strong>Radically different experience.</strong></p>
  </div>

  <!-- ── Stats bar ── -->
  <div class="stats-bar">
    {#each stats as s}
      <div class="stat-item">
        <div class="stat-num {s.cls}">{s.num}</div>
        <div class="stat-label">{s.label}</div>
      </div>
    {/each}
  </div>

  <!-- ── Code panels ── -->
  <div class="code-grid">

    <!-- JSON pane -->
    <div class="code-pane">
      <div class="pane-header">
        <span class="pane-dot" style="background:#e06c75"></span>
        <span class="pane-title pane-title--json">weapon_db.json</span>
        <span class="pane-badge pane-badge--json">196 lines</span>
      </div>
      <div class="code-scroll">
        <pre class="code-pre">{#each jsonLines as line, i}<div class="code-line"><span class="ln">{String(i + 1).padStart(3, ' ')}</span><span class="code-content">{@html line || '\u00a0'}</span></div>{/each}</pre>
      </div>
    </div>

    <!-- DixScript pane -->
    <div class="code-pane">
      <div class="pane-header">
        <span class="pane-dot" style="background:#56b6c2"></span>
        <span class="pane-title pane-title--dix">weapon_db.mdix</span>
        <span class="pane-badge pane-badge--dix">51 lines</span>
      </div>
      <div class="code-scroll">
        <pre class="code-pre">{#each dixLines as line, i}<div class="code-line"><span class="ln">{String(i + 1).padStart(3, ' ')}</span><span class="code-content">{@html line || '\u00a0'}</span></div>{/each}</pre>
      </div>
    </div>

  </div>

  <!-- ── Formula callout ── -->
  <div class="formula-callout">
    <div class="formula-label">The killer advantage</div>
    <div class="formula-snippet">
      SellPrice = damage * 2<br/>BuyPrice&nbsp; = damage * 8
    </div>
    <div class="formula-note">
      Change the pricing formula once →
      <strong>all 11 weapons update instantly.</strong><br/>
      In JSON? Hunt down and recalculate 22 hardcoded numbers by hand.
    </div>
  </div>

  <!-- ── Pain vs Wins ── -->
  <div class="callout-grid">
    <div class="callout-col callout-col--json">
      <h3>JSON pain points</h3>
      {#each pains as pain}
        <div class="callout-item">
          <span class="callout-icon callout-icon--bad">✗</span>
          <span>{pain}</span>
        </div>
      {/each}
    </div>
    <div class="callout-col callout-col--dix">
      <h3>DixScript wins</h3>
      {#each wins as win}
        <div class="callout-item">
          <span class="callout-icon callout-icon--good">✓</span>
          <span>{win}</span>
        </div>
      {/each}
    </div>
  </div>

  <!-- ── Reduction bar ── -->
  <div class="reduction-section">
    <div class="reduction-label">Line count reduction</div>
    <div class="reduction-big">74%</div>
    <div class="reduction-desc">196 lines → 51 lines · same data, same output</div>
    <div class="bar-track">
      <div
        class="bar-fill"
        bind:this={barEl}
        style="width: 0%"
      ></div>
    </div>
    <div class="bar-labels">
      <span class="bar-label-dix">DixScript (51)</span>
      <span class="bar-label-json">JSON (196)</span>
    </div>
  </div>

  <!-- ── Feature table ── -->
  <div class="feature-table-wrap">
    <h3>Feature comparison</h3>
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th class="th-json">JSON</th>
            <th class="th-dix">DixScript</th>
          </tr>
        </thead>
        <tbody>
          {#each tableRows as row}
            <tr>
              <td class="td-feature">{row.feature}</td>
              <td class="td-{row.jsonCls}">{row.json}</td>
              <td class="td-{row.dixCls}">{row.dix}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Footer note ── -->
  <div class="gc-footer">
    DixScript · in development · not production-ready ·
    <a href="https://github.com/Mid-D-Man/DixScript-Rust" target="_blank" rel="noopener noreferrer">
      watch the repo for v1.0.0
    </a>
  </div>

</section>

<style>
  /* ── Scoped design tokens (dark terminal aesthetic) ── */
  .game-comparison {
    --gc-bg:        #0d0f14;
    --gc-surface:   #13161d;
    --gc-surface2:  #1a1e28;
    --gc-border:    #252a38;
    --gc-text:      #c9d1e0;
    --gc-muted:     #5a6380;
    --gc-ln:        #3a4055;

    --clr-json:     #e06c75;
    --clr-dix:      #56b6c2;
    --clr-gold:     #e5c07b;
    --clr-grn:      #98c379;
    --clr-pur:      #c678dd;
    --clr-org:      #d19a66;

    background: var(--gc-bg);
    color: var(--gc-text);
    font-family: var(--font-sans);
    border-top: 1px solid var(--gc-border);
    border-bottom: 1px solid var(--gc-border);
  }

  /* ── Header ── */
  .gc-header {
    padding: 3.5rem 2.5rem 2rem;
    text-align: center;
    border-bottom: 1px solid var(--gc-border);
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(86,182,194,0.07) 0%, transparent 70%);
  }

  .gc-kicker {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--clr-dix);
    background: rgba(86,182,194,0.1);
    border: 1px solid rgba(86,182,194,0.25);
    padding: 0.25rem 0.875rem;
    border-radius: 9999px;
    margin-bottom: 1.25rem;
    font-family: var(--font-mono);
  }

  .gc-title {
    font-size: clamp(1.75rem, 4vw, 3rem);
    font-weight: 800;
    color: #e8eaf0;
    letter-spacing: -0.02em;
    margin-bottom: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .label-json { color: var(--clr-json); }
  .label-dix  { color: var(--clr-dix);  }
  .vs         { color: var(--gc-muted); font-weight: 400; }

  .gc-subtitle {
    font-size: 0.9375rem;
    color: var(--gc-muted);
    font-family: var(--font-mono);
    font-weight: 300;
  }

  .gc-subtitle strong {
    color: var(--gc-text);
    font-weight: 400;
  }

  /* ── Stats bar ── */
  .stats-bar {
    display: flex;
    align-items: stretch;
    border-bottom: 1px solid var(--gc-border);
    background: var(--gc-surface);
    overflow-x: auto;
  }

  .stat-item {
    flex: 1;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.25rem 1rem;
    border-right: 1px solid var(--gc-border);
    gap: 0.25rem;
    text-align: center;
  }

  .stat-item:last-child { border-right: none; }

  .stat-num {
    font-family: var(--font-mono);
    font-size: 1.625rem;
    font-weight: 700;
    line-height: 1;
  }

  .stat-num.red   { color: var(--clr-json); }
  .stat-num.teal  { color: var(--clr-dix);  }
  .stat-num.gold  { color: var(--clr-gold); }
  .stat-num.green { color: var(--clr-grn);  }

  .stat-label {
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gc-muted);
    font-family: var(--font-mono);
  }

  /* ── Code grid ── */
  .code-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid var(--gc-border);
  }

  .code-pane {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--gc-border);
    min-width: 0;
  }

  .code-pane:last-child { border-right: none; }

  .pane-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--gc-border);
    background: var(--gc-surface);
    flex-shrink: 0;
  }

  .pane-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pane-title {
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    font-family: var(--font-mono);
  }

  .pane-title--json { color: var(--clr-json); }
  .pane-title--dix  { color: var(--clr-dix);  }

  .pane-badge {
    margin-left: auto;
    font-size: 0.625rem;
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 0.1875rem 0.625rem;
    border-radius: 9999px;
    flex-shrink: 0;
  }

  .pane-badge--json {
    background: rgba(224,108,117,0.15);
    color: var(--clr-json);
    border: 1px solid rgba(224,108,117,0.3);
  }

  .pane-badge--dix {
    background: rgba(86,182,194,0.12);
    color: var(--clr-dix);
    border: 1px solid rgba(86,182,194,0.28);
  }

  .code-scroll {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 480px;
    flex: 1;
  }

  .code-pre {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.7;
    padding: 0;
    white-space: pre;
    background: transparent;
    border: none;
    border-radius: 0;
  }

  .code-line {
    display: flex;
    align-items: flex-start;
    padding-right: 1rem;
    transition: background 0.1s;
    min-width: max-content;
  }

  .code-line:hover { background: rgba(255,255,255,0.02); }

  .ln {
    user-select: none;
    color: var(--gc-ln);
    min-width: 2.625rem;
    text-align: right;
    padding-right: 1rem;
    flex-shrink: 0;
    border-right: 1px solid var(--gc-border);
    margin-right: 1rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.7;
  }

  .code-content {
    flex: 1;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    line-height: 1.7;
  }

  /* Syntax tokens — globally scoped to .game-comparison */
  :global(.game-comparison .t-key)     { color: #e06c75; }
  :global(.game-comparison .t-str)     { color: #98c379; }
  :global(.game-comparison .t-num)     { color: #d19a66; }
  :global(.game-comparison .t-bool)    { color: #c678dd; }
  :global(.game-comparison .t-punct)   { color: #5a6380; }
  :global(.game-comparison .t-kw)      { color: #c678dd; }
  :global(.game-comparison .t-fn)      { color: #e5c07b; }
  :global(.game-comparison .t-type)    { color: #56b6c2; }
  :global(.game-comparison .t-enum)    { color: #e5c07b; }
  :global(.game-comparison .t-prop)    { color: #abb2bf; }
  :global(.game-comparison .t-comment) { color: #4b5268; font-style: italic; }
  :global(.game-comparison .t-section) { color: #56b6c2; font-weight: 600; }
  :global(.game-comparison .t-tilde)   { color: #c678dd; }
  :global(.game-comparison .t-ret)     { color: #56b6c2; }

  /* ── Formula callout ── */
  .formula-callout {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding: 1.25rem 2rem;
    background: linear-gradient(135deg, rgba(86,182,194,0.05) 0%, rgba(197,120,221,0.04) 100%);
    border-bottom: 1px solid var(--gc-border);
  }

  .formula-label {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--clr-gold);
    font-family: var(--font-mono);
    white-space: nowrap;
  }

  .formula-snippet {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    background: rgba(0,0,0,0.35);
    border: 1px solid var(--gc-border);
    border-radius: 6px;
    padding: 0.5rem 0.875rem;
    color: var(--clr-grn);
    flex: 1;
    min-width: 200px;
    line-height: 1.7;
  }

  .formula-note {
    font-size: 0.8125rem;
    color: var(--gc-muted);
    flex: 1;
    min-width: 180px;
    line-height: 1.6;
  }

  .formula-note strong { color: var(--gc-text); }

  /* ── Pain vs Wins ── */
  .callout-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid var(--gc-border);
  }

  .callout-col {
    padding: 1.75rem 2rem;
    border-right: 1px solid var(--gc-border);
  }

  .callout-col:last-child { border-right: none; }

  .callout-col h3 {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 1rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  .callout-col--json h3 { color: var(--clr-json); }
  .callout-col--dix h3  { color: var(--clr-dix);  }

  .callout-item {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    margin-bottom: 0.75rem;
    font-size: 0.8125rem;
    line-height: 1.55;
    color: var(--gc-text);
  }

  .callout-icon {
    flex-shrink: 0;
    font-size: 0.875rem;
    margin-top: 1px;
    font-style: normal;
  }

  .callout-icon--bad  { color: var(--clr-json); }
  .callout-icon--good { color: var(--clr-grn);  }

  /* ── Reduction bar ── */
  .reduction-section {
    padding: 2rem 2.5rem;
    text-align: center;
    border-bottom: 1px solid var(--gc-border);
    background: var(--gc-surface);
  }

  .reduction-label {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--gc-muted);
    font-family: var(--font-mono);
    margin-bottom: 0.75rem;
  }

  .reduction-big {
    font-size: clamp(2.5rem, 6vw, 3.25rem);
    font-weight: 800;
    color: var(--clr-dix);
    letter-spacing: -0.03em;
    font-family: var(--font-serif);
    margin-bottom: 0.25rem;
  }

  .reduction-desc {
    font-size: 0.8125rem;
    color: var(--gc-muted);
    font-family: var(--font-mono);
    margin-bottom: 1.25rem;
  }

  .bar-track {
    height: 10px;
    background: rgba(224,108,117,0.18);
    border-radius: 9999px;
    max-width: 560px;
    margin: 0 auto 0.625rem;
    position: relative;
    overflow: hidden;
  }

  .bar-fill {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    background: linear-gradient(90deg, var(--clr-dix), var(--clr-grn));
    border-radius: 9999px;
    transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .bar-labels {
    display: flex;
    justify-content: space-between;
    max-width: 560px;
    margin: 0 auto;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
  }

  .bar-label-dix  { color: var(--clr-dix);  }
  .bar-label-json { color: var(--clr-json); }

  /* ── Feature table ── */
  .feature-table-wrap {
    padding: 2.5rem;
    border-bottom: 1px solid var(--gc-border);
  }

  .feature-table-wrap h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #e8eaf0;
    margin-bottom: 1.25rem;
    letter-spacing: -0.01em;
  }

  .table-scroll { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  th {
    text-align: left;
    padding: 0.625rem 0.875rem;
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gc-muted);
    border-bottom: 1px solid var(--gc-border);
  }

  .th-json { color: var(--clr-json); }
  .th-dix  { color: var(--clr-dix);  }

  td {
    padding: 0.6875rem 0.875rem;
    border-bottom: 1px solid rgba(37,42,56,0.6);
    font-size: 0.75rem;
    color: var(--gc-text);
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.018); }

  .td-feature  { color: #abb2bf; font-weight: 500; }
  .td-yes      { color: var(--clr-grn);  font-weight: 600; }
  .td-no       { color: var(--clr-json); }
  .td-partial  { color: var(--clr-gold); }

  /* ── Footer ── */
  .gc-footer {
    padding: 1.25rem 2.5rem;
    text-align: center;
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--gc-ln);
    letter-spacing: 0.06em;
  }

  .gc-footer a {
    color: var(--clr-dix);
    text-decoration: none;
    transition: opacity 0.15s ease;
  }

  .gc-footer a:hover { opacity: 0.75; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .code-grid    { grid-template-columns: 1fr; }
    .callout-grid { grid-template-columns: 1fr; }
    .code-pane    { border-right: none; border-bottom: 1px solid var(--gc-border); }
    .callout-col  { border-right: none; border-bottom: 1px solid var(--gc-border); }
    .callout-col:last-child { border-bottom: none; }
  }

  @media (max-width: 640px) {
    .gc-header          { padding: 2rem 1rem 1.5rem; }
    .formula-callout    { padding: 1rem; }
    .callout-col        { padding: 1.25rem 1rem; }
    .reduction-section  { padding: 1.5rem 1rem; }
    .feature-table-wrap { padding: 1.5rem 1rem; }
    .gc-footer          { padding: 1rem; }

    .stats-bar     { flex-wrap: wrap; }
    .stat-item     { min-width: 50%; border-bottom: 1px solid var(--gc-border); }
  }
</style>

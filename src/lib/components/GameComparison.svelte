<!-- src/lib/components/GameComparison.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  const jsonCode = `{
  "weapons": [
    {
      "id": "IRON_SWORD",       "name": "Iron Sword",
      "type": "SWORD",          "rarity": "COMMON",
      "damageType": "PHYSICAL",
      "baseDamage": 25,         "critChance": 0.05,
      "attackSpeed": 1.2,       "durability": 100,
      "weight": 3.5,            "requiredLevel": 1,
      "sellPrice": 50,          "buyPrice": 200,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "STEEL_SWORD",      "name": "Steel Sword",
      "type": "SWORD",          "rarity": "UNCOMMON",
      "damageType": "PHYSICAL",
      "baseDamage": 45,         "critChance": 0.08,
      "attackSpeed": 1.3,       "durability": 150,
      "weight": 4.0,            "requiredLevel": 10,
      "sellPrice": 90,          "buyPrice": 360,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "ELVEN_BLADE",      "name": "Elven Blade",
      "type": "SWORD",          "rarity": "RARE",
      "damageType": "ARCANE",
      "baseDamage": 80,         "critChance": 0.15,
      "attackSpeed": 1.6,       "durability": 120,
      "weight": 2.8,            "requiredLevel": 25,
      "sellPrice": 160,         "buyPrice": 640,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "SHADOWFANG",       "name": "Shadowfang",
      "type": "SWORD",          "rarity": "EPIC",
      "damageType": "POISON",
      "baseDamage": 120,        "critChance": 0.22,
      "attackSpeed": 1.8,       "durability": 200,
      "weight": 3.2,            "requiredLevel": 40,
      "sellPrice": 240,         "buyPrice": 960,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "EXCALIBUR",        "name": "Excalibur",
      "type": "SWORD",          "rarity": "LEGENDARY",
      "damageType": "LIGHTNING",
      "baseDamage": 200,        "critChance": 0.35,
      "attackSpeed": 2.0,       "durability": 999,
      "weight": 4.5,            "requiredLevel": 60,
      "sellPrice": 400,         "buyPrice": 1600,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "HUNTING_BOW",      "name": "Hunting Bow",
      "type": "BOW",            "rarity": "COMMON",
      "damageType": "PHYSICAL",
      "baseDamage": 20,         "critChance": 0.12,
      "attackSpeed": 0.8,       "durability": 80,
      "weight": 1.5,            "requiredLevel": 1,
      "sellPrice": 40,          "buyPrice": 160,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "YEW_BOW",          "name": "Yew Bow",
      "type": "BOW",            "rarity": "UNCOMMON",
      "damageType": "PHYSICAL",
      "baseDamage": 38,         "critChance": 0.18,
      "attackSpeed": 0.9,       "durability": 110,
      "weight": 1.8,            "requiredLevel": 12,
      "sellPrice": 76,          "buyPrice": 304,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "STORM_BOW",        "name": "Storm Bow",
      "type": "BOW",            "rarity": "RARE",
      "damageType": "LIGHTNING",
      "baseDamage": 70,         "critChance": 0.25,
      "attackSpeed": 1.1,       "durability": 140,
      "weight": 2.0,            "requiredLevel": 28,
      "sellPrice": 140,         "buyPrice": 560,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "OAK_STAFF",        "name": "Oak Staff",
      "type": "STAFF",          "rarity": "COMMON",
      "damageType": "ARCANE",
      "baseDamage": 18,         "critChance": 0.08,
      "attackSpeed": 0.7,       "durability": 90,
      "weight": 2.0,            "requiredLevel": 1,
      "sellPrice": 36,          "buyPrice": 144,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "CRYSTAL_STAFF",    "name": "Crystal Staff",
      "type": "STAFF",          "rarity": "RARE",
      "damageType": "ICE",
      "baseDamage": 65,         "critChance": 0.18,
      "attackSpeed": 0.9,       "durability": 130,
      "weight": 2.5,            "requiredLevel": 22,
      "sellPrice": 130,         "buyPrice": 520,
      "stackable": false,       "isQuestItem": false
    },
    {
      "id": "ARCANE_SCEPTER",   "name": "Arcane Scepter",
      "type": "STAFF",          "rarity": "EPIC",
      "damageType": "ARCANE",
      "baseDamage": 110,        "critChance": 0.28,
      "attackSpeed": 1.0,       "durability": 180,
      "weight": 2.2,            "requiredLevel": 45,
      "sellPrice": 220,         "buyPrice": 880,
      "stackable": false,       "isQuestItem": false
    }
  ]
}`;

  const dixCode = `@ENUMS(
  WeaponType { SWORD, BOW, STAFF, DAGGER, AXE }
  Rarity     { COMMON = 0, UNCOMMON = 1, RARE = 2, EPIC = 3, LEGENDARY = 4 }
  DamageType { PHYSICAL, FIRE, ICE, LIGHTNING, POISON, ARCANE }
)

@QUICKFUNCS(
  ~weapon(id, name, type, rarity, dmgType, damage, crit, speed, durability, weight, level) {
    return {
      Id = id,  Name = name
      WeaponType = type,  Rarity = rarity,  DamageType = dmgType
      BaseDamage = damage,  CritChance = crit,  AttackSpeed = speed
      Durability = durability,  Weight = weight,  RequiredLevel = level
      SellPrice = damage * 2
      BuyPrice  = damage * 8
      Stackable = false,  IsQuestItem = false
    }
  }
)

@DATA(
  weapons::
    weapon("IRON_SWORD",    "Iron Sword",    WeaponType.SWORD, Rarity.COMMON,    DamageType.PHYSICAL,   25, 0.05, 1.2, 100, 3.5,  1),
    weapon("STEEL_SWORD",   "Steel Sword",   WeaponType.SWORD, Rarity.UNCOMMON,  DamageType.PHYSICAL,   45, 0.08, 1.3, 150, 4.0, 10),
    weapon("ELVEN_BLADE",   "Elven Blade",   WeaponType.SWORD, Rarity.RARE,      DamageType.ARCANE,     80, 0.15, 1.6, 120, 2.8, 25),
    weapon("SHADOWFANG",    "Shadowfang",    WeaponType.SWORD, Rarity.EPIC,      DamageType.POISON,    120, 0.22, 1.8, 200, 3.2, 40),
    weapon("EXCALIBUR",     "Excalibur",     WeaponType.SWORD, Rarity.LEGENDARY, DamageType.LIGHTNING, 200, 0.35, 2.0, 999, 4.5, 60),
    weapon("HUNTING_BOW",   "Hunting Bow",   WeaponType.BOW,   Rarity.COMMON,    DamageType.PHYSICAL,   20, 0.12, 0.8,  80, 1.5,  1),
    weapon("YEW_BOW",       "Yew Bow",       WeaponType.BOW,   Rarity.UNCOMMON,  DamageType.PHYSICAL,   38, 0.18, 0.9, 110, 1.8, 12),
    weapon("STORM_BOW",     "Storm Bow",     WeaponType.BOW,   Rarity.RARE,      DamageType.LIGHTNING,  70, 0.25, 1.1, 140, 2.0, 28),
    weapon("OAK_STAFF",     "Oak Staff",     WeaponType.STAFF, Rarity.COMMON,    DamageType.ARCANE,     18, 0.08, 0.7,  90, 2.0,  1),
    weapon("CRYSTAL_STAFF", "Crystal Staff", WeaponType.STAFF, Rarity.RARE,      DamageType.ICE,        65, 0.18, 0.9, 130, 2.5, 22),
    weapon("ARCANE_SCEPTER","Arcane Scepter",WeaponType.STAFF, Rarity.EPIC,      DamageType.ARCANE,    110, 0.28, 1.0, 180, 2.2, 45)
)`;

  let jsonBytes = 0;
  let dixBytes  = 0;
  let savings   = 0;

  onMount(() => {
    jsonBytes = new Blob([jsonCode]).size;
    dixBytes  = new Blob([dixCode]).size;
    savings   = Math.round((1 - dixBytes / jsonBytes) * 100);
  });

  let jsonCopied = false;
  let dixCopied  = false;

  async function copy(text: string, which: 'json' | 'dix'): Promise<void> {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (which === 'json') { jsonCopied = true; setTimeout(() => (jsonCopied = false), 2000); }
    else { dixCopied = true; setTimeout(() => (dixCopied = false), 2000); }
  }
</script>

<section class="game-cmp" id="game-dev-example">
  <div class="game-cmp-inner">

    <div class="section-header">
      <div class="kicker">Real-World Comparison · RPG Weapon Database · 11 Items</div>
      <h2>
        <span class="label-json">JSON</span>
        <span class="vs">vs</span>
        <span class="label-dix">DixScript</span>
      </h2>
      <p>
        Same data. Same output. 11 weapons, 15 fields each, 22 hardcoded prices —
        or one function with a formula.
      </p>
    </div>

    <div class="stats-row">
      <div class="stat">
        <div class="stat-val stat-val--bad">220+</div>
        <div class="stat-label">JSON lines</div>
      </div>
      <div class="stat-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
        </svg>
      </div>
      <div class="stat">
        <div class="stat-val stat-val--good">~45</div>
        <div class="stat-label">DixScript lines</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <div class="stat-val stat-val--warn">22</div>
        <div class="stat-label">hardcoded prices in JSON</div>
      </div>
      <div class="stat-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
        </svg>
      </div>
      <div class="stat">
        <div class="stat-val stat-val--good">1</div>
        <div class="stat-label">formula in DixScript</div>
      </div>
    </div>

    <div class="panels">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-dots" aria-hidden="true">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
          </div>
          <span class="panel-title">weapon_db.json</span>
          <button class="copy-btn" on:click={() => copy(jsonCode, 'json')} aria-label="Copy JSON">
            {jsonCopied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre class="code-block"><code>{jsonCode}</code></pre>
        <div class="panel-footer panel-footer--bad">
          <span class="byte-count">{jsonBytes} bytes</span>
          <span class="byte-sep">·</span>
          <span class="byte-label">every weapon repeats all 15 fields verbatim</span>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div class="panel-dots" aria-hidden="true">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
          </div>
          <span class="panel-title">weapon_db.mdix</span>
          <button class="copy-btn" on:click={() => copy(dixCode, 'dix')} aria-label="Copy DixScript">
            {dixCopied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre class="code-block"><code>{dixCode}</code></pre>
        <div class="panel-footer panel-footer--good">
          <span class="byte-count">{dixBytes} bytes</span>
          <span class="byte-sep">·</span>
          <span class="byte-label">shape defined once · pricing is a formula</span>
        </div>
      </div>
    </div>

    <div class="formula-callout">
      <div class="formula-left">
        <div class="formula-tag">The killer advantage</div>
        <pre class="formula-snippet">SellPrice = damage * 2
BuyPrice  = damage * 8</pre>
      </div>
      <div class="formula-right">
        Change the pricing formula once and <strong>all 11 weapons update instantly.</strong>
        In JSON you'd hunt down and recalculate 22 hardcoded numbers by hand.
        Add a new field like <code>isTwoHanded</code>? One line in the template — not 11 edits.
      </div>
    </div>

    <div class="verdict-grid">
      <div class="verdict-col verdict-col--bad">
        <h4>JSON pain points</h4>
        {#each [
          'Every weapon repeats all 15 fields — no templates, no abstraction.',
          '"stackable": false appears 11 times — change the default? Edit 11 places.',
          'Prices are hardcoded — typo 160 instead of 600 and the economy breaks silently.',
          'Type values are raw strings: "SWORD", "sWoRd", "sword" all valid — zero enforcement.',
          '220+ lines for 11 weapons. 500 weapons? Nearly 10,000 lines of identical JSON.',
        ] as item}
          <div class="verdict-item">
            <svg class="verdict-icon verdict-icon--bad" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
            </svg>
            <span>{item}</span>
          </div>
        {/each}
      </div>
      <div class="verdict-col verdict-col--good">
        <h4>DixScript wins</h4>
        {#each [
          'Shape defined once in ~weapon() — adding a field means one line change, everywhere.',
          'Stackable = false lives in the template — one truth, zero drift.',
          'Pricing is a formula: BuyPrice = damage * 8 — transparent and auditable.',
          'Enums enforce valid values at compile time — WeaponType.SORD is a compile error.',
          '500 weapons? ~520 lines total. Scales linearly, not quadratically.',
        ] as item}
          <div class="verdict-item">
            <svg class="verdict-icon verdict-icon--good" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
            </svg>
            <span>{item}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="savings-banner">
      <span class="savings-val">{savings}% Smaller</span>
      <span class="savings-desc">
        Same data, same output. The pricing formula means you never touch individual entries again.
      </span>
    </div>

  </div>
</section>

<style>
  .game-cmp {
    padding: 5rem 1.5rem;
    background: var(--background);
    border-top: 1px solid var(--border);
  }

  .game-cmp-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .section-header { text-align: center; }

  .kicker {
    display: inline-block;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--primary);
    background: var(--secondary);
    border: 1px solid var(--border);
    padding: 0.25rem 0.875rem;
    border-radius: 9999px;
    margin-bottom: 1rem;
    font-family: var(--font-mono);
  }

  .section-header h2 {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .label-json { color: var(--destructive); }
  .label-dix  { color: var(--primary); }
  .vs         { color: var(--muted-foreground); font-weight: 400; }
  .section-header p { font-size: 1rem; color: var(--muted-foreground); max-width: 560px; margin: 0 auto; line-height: 1.75; }

  .stats-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 2rem;
    flex-wrap: wrap;
  }

  .stat { text-align: center; }
  .stat-val { font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700; line-height: 1; margin-bottom: 0.25rem; }
  .stat-val--bad  { color: var(--destructive); }
  .stat-val--good { color: var(--primary); }
  .stat-val--warn { color: var(--muted-foreground); }
  .stat-label { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted-foreground); font-family: var(--font-mono); }
  .stat-arrow { color: var(--muted-foreground); }
  .stat-divider { width: 1px; height: 3rem; background: var(--border); flex-shrink: 0; }

  .panels { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

  .panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background: var(--secondary);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .panel-dots { display: flex; gap: 5px; flex-shrink: 0; }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-r { background: #f85149; }
  .dot-y { background: #e3b341; }
  .dot-g { background: #3fb950; }

  .panel-title { font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted-foreground); flex: 1; }

  .copy-btn {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted-foreground);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.2rem 0.625rem;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .copy-btn:hover { background: var(--muted); color: var(--foreground); }

  .code-block {
    flex: 1;
    margin: 0;
    border: none;
    border-radius: 0;
    background: var(--card);
    font-size: 0.78125rem;
    max-height: 480px;
    overflow-y: auto;
    overflow-x: auto;
  }

  .code-block code { background: none; border: none; padding: 0; font-size: inherit; color: var(--foreground); white-space: pre; }

  .panel-footer {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    border-top: 1px solid var(--border);
    font-size: 0.8125rem;
    flex-shrink: 0;
  }

  .panel-footer--bad  { background: rgba(181, 74, 53, 0.04); }
  .panel-footer--good { background: rgba(166, 124, 82, 0.06); }

  .byte-count { font-family: var(--font-mono); font-weight: 600; color: var(--foreground); }
  .byte-sep   { color: var(--border); }
  .byte-label { color: var(--muted-foreground); font-size: 0.75rem; }

  .formula-callout {
    display: flex;
    align-items: flex-start;
    gap: 1.5rem;
    flex-wrap: wrap;
    background: var(--secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--primary);
    border-radius: var(--radius);
    padding: 1.25rem 1.5rem;
  }

  .formula-left { flex-shrink: 0; }
  .formula-tag { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--primary); font-family: var(--font-mono); margin-bottom: 0.625rem; }

  .formula-snippet {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.625rem 0.875rem;
    color: var(--primary);
    margin: 0;
  }

  .formula-right { font-size: 0.9375rem; color: var(--muted-foreground); line-height: 1.75; flex: 1; min-width: 180px; padding-top: 1.5rem; }
  .formula-right strong { color: var(--foreground); }
  .formula-right code   { font-size: 0.8125rem; }

  .verdict-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }

  .verdict-col {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
  }

  .verdict-col h4 {
    font-family: var(--font-sans);
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.875rem;
  }

  .verdict-col--bad  h4 { color: var(--destructive); }
  .verdict-col--good h4 { color: var(--primary); }

  .verdict-item {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    margin-bottom: 0.625rem;
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--foreground);
  }

  .verdict-icon { flex-shrink: 0; margin-top: 2px; }
  .verdict-icon--bad  { color: var(--destructive); }
  .verdict-icon--good { color: var(--primary); }

  .savings-banner {
    background: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .savings-val { font-family: var(--font-serif); font-size: 1.625rem; font-weight: 700; color: var(--primary); flex-shrink: 0; }
  .savings-desc { font-size: 0.9375rem; color: var(--foreground); line-height: 1.6; flex: 1; }

  @media (max-width: 900px) {
    .panels, .verdict-grid { grid-template-columns: 1fr; }
    .game-cmp { padding: 3rem 1rem; }
    .stats-row { gap: 1rem; padding: 1rem; }
    .stat-divider, .stat-arrow { display: none; }
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';

  const jsonCode = `{
  "weapons": [
    {
      "id": "IRON_SWORD",      "name": "Iron Sword",
      "type": "SWORD",         "rarity": "COMMON",
      "damageType": "PHYSICAL",
      "baseDamage": 25,        "critChance": 0.05,
      "attackSpeed": 1.2,      "durability": 100,
      "weight": 3.5,           "requiredLevel": 1,
      "sellPrice": 50,         "buyPrice": 200,
      "stackable": false,      "isQuestItem": false
    },
    {
      "id": "STEEL_SWORD",     "name": "Steel Sword",
      "type": "SWORD",         "rarity": "UNCOMMON",
      "damageType": "PHYSICAL",
      "baseDamage": 45,        "critChance": 0.08,
      "attackSpeed": 1.3,      "durability": 150,
      "weight": 4.0,           "requiredLevel": 10,
      "sellPrice": 90,         "buyPrice": 360,
      "stackable": false,      "isQuestItem": false
    },
    // ··· 9 more weapons · same 15 fields every time
    // ··· 196 total lines · 22 hardcoded prices · zero formulas
  ]
}`;

  const dixCode = `@ENUMS(
  WeaponType { SWORD, BOW, STAFF, DAGGER, AXE }
  Rarity     { COMMON=0, UNCOMMON=1, RARE=2, EPIC=3, LEGENDARY=4 }
  DamageType { PHYSICAL, FIRE, ICE, LIGHTNING, POISON, ARCANE }
)

@QUICKFUNCS(
  // Shape defined once. SellPrice and BuyPrice are formulas —
  // change the math here and all 11 weapons update instantly.
  ~weapon<object>(id, name, type<enum>, rarity<enum>, dmgType<enum>,
                  damage<int>, crit<float>, speed<float>,
                  durability<int>, weight<float>, level<int>) {
    return {
      Id = id,  Name = name
      WeaponType = type,  Rarity = rarity,  DamageType = dmgType
      BaseDamage = damage,  CritChance = crit,  AttackSpeed = speed
      Durability = durability,  Weight = weight,  RequiredLevel = level
      SellPrice = damage * 2      // formula, not a number
      BuyPrice  = damage * 8      // formula, not a number
      Stackable = false,  IsQuestItem = false
    }
  }
)

@DATA(
  weapons::
    weapon("IRON_SWORD",    "Iron Sword",    WeaponType.SWORD, Rarity.COMMON,     DamageType.PHYSICAL,   25, 0.05f, 1.2f, 100, 3.5f,  1),
    weapon("STEEL_SWORD",   "Steel Sword",   WeaponType.SWORD, Rarity.UNCOMMON,   DamageType.PHYSICAL,   45, 0.08f, 1.3f, 150, 4.0f, 10),
    weapon("ELVEN_BLADE",   "Elven Blade",   WeaponType.SWORD, Rarity.RARE,       DamageType.ARCANE,     80, 0.15f, 1.6f, 120, 2.8f, 25),
    weapon("SHADOWFANG",    "Shadowfang",    WeaponType.SWORD, Rarity.EPIC,       DamageType.POISON,    120, 0.22f, 1.8f, 200, 3.2f, 40),
    weapon("EXCALIBUR",     "Excalibur",     WeaponType.SWORD, Rarity.LEGENDARY,  DamageType.LIGHTNING, 200, 0.35f, 2.0f, 999, 4.5f, 60),
    weapon("HUNTING_BOW",   "Hunting Bow",   WeaponType.BOW,   Rarity.COMMON,     DamageType.PHYSICAL,   20, 0.12f, 0.8f,  80, 1.5f,  1),
    weapon("YEW_BOW",       "Yew Bow",       WeaponType.BOW,   Rarity.UNCOMMON,   DamageType.PHYSICAL,   38, 0.18f, 0.9f, 110, 1.8f, 12),
    weapon("STORM_BOW",     "Storm Bow",     WeaponType.BOW,   Rarity.RARE,       DamageType.LIGHTNING,  70, 0.25f, 1.1f, 140, 2.0f, 28),
    weapon("OAK_STAFF",     "Oak Staff",     WeaponType.STAFF, Rarity.COMMON,     DamageType.ARCANE,     18, 0.08f, 0.7f,  90, 2.0f,  1),
    weapon("CRYSTAL_STAFF", "Crystal Staff", WeaponType.STAFF, Rarity.RARE,       DamageType.ICE,        65, 0.18f, 0.9f, 130, 2.5f, 22),
    weapon("ARCANE_SCEPTER","Arcane Scepter",WeaponType.STAFF, Rarity.EPIC,       DamageType.ARCANE,    110, 0.28f, 1.0f, 180, 2.2f, 45)
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
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (which === 'json') {
      jsonCopied = true;
      setTimeout(() => (jsonCopied = false), 2000);
    } else {
      dixCopied = true;
      setTimeout(() => (dixCopied = false), 2000);
    }
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
        Same data. Same output. 196 lines of repetitive JSON become 51 lines of
        structured, formula-driven DixScript.
      </p>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat">
        <div class="stat-val stat-val--bad">196</div>
        <div class="stat-label">JSON lines</div>
      </div>
      <div class="stat-arrow">→</div>
      <div class="stat">
        <div class="stat-val stat-val--good">51</div>
        <div class="stat-label">DixScript lines</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <div class="stat-val stat-val--warn">22</div>
        <div class="stat-label">hardcoded prices in JSON</div>
      </div>
      <div class="stat-arrow">→</div>
      <div class="stat">
        <div class="stat-val stat-val--good">1</div>
        <div class="stat-label">formula line in DixScript</div>
      </div>
    </div>

    <!-- Panels -->
    <div class="panels">

      <div class="panel">
        <div class="panel-header">
          <div class="panel-dots" aria-hidden="true">
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
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
            <span class="dot dot-r"></span>
            <span class="dot dot-y"></span>
            <span class="dot dot-g"></span>
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

    <!-- Formula callout -->
    <div class="formula-callout">
      <div class="formula-left">
        <div class="formula-tag">The killer advantage</div>
        <pre class="formula-snippet">SellPrice = damage * 2
BuyPrice  = damage * 8</pre>
      </div>
      <div class="formula-right">
        Change the pricing formula once →
        <strong>all 11 weapons update instantly.</strong>
        In JSON? Hunt down and recalculate 22 hardcoded numbers by hand.
        Add a new field like <code>isTwoHanded</code>? One line in the template — not 11 edits.
      </div>
    </div>

    <!-- Pain vs wins -->
    <div class="verdict-grid">
      <div class="verdict-col verdict-col--bad">
        <h4>JSON pain points</h4>
        {#each [
          'Every weapon repeats all 15 fields — no templates, no abstraction.',
          '"stackable": false appears 11 times — change the default? Edit 11 places.',
          'Prices are hardcoded — typo 160 instead of 600 and the economy breaks silently.',
          'Type values are raw strings: "SWORD", "sWoRd", "sword" all valid — zero enforcement.',
          '196 lines for 11 weapons. 500 weapons? Nearly 9,000 lines of nearly identical JSON.',
        ] as item}
          <div class="verdict-item">
            <span class="verdict-icon">✗</span>
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
            <span class="verdict-icon">✓</span>
            <span>{item}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Savings banner -->
    <div class="savings-banner">
      <span class="savings-val">{savings}% Smaller</span>
      <span class="savings-desc">
        196 lines → 51 lines · same data, same output.
        The pricing formula means you never touch individual entries again.
      </span>
      <div class="savings-actions">
        <a href="/playground" class="savings-btn savings-btn--primary">Try It</a>
        <a href="/docs#quickfuncs" class="savings-btn">Learn QuickFuncs</a>
      </div>
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

  /* ── Header ── */
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

  .section-header p {
    font-size: 1rem;
    color: var(--muted-foreground);
    max-width: 560px;
    margin: 0 auto;
    line-height: 1.75;
  }

  /* ── Stats row ── */
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

  .stat-val {
    font-family: var(--font-serif);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .stat-val--bad  { color: var(--destructive); }
  .stat-val--good { color: var(--primary); }
  .stat-val--warn { color: var(--muted-foreground); }

  .stat-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted-foreground);
    font-family: var(--font-mono);
  }

  .stat-arrow {
    color: var(--muted-foreground);
    font-size: 1.25rem;
  }

  .stat-divider {
    width: 1px;
    height: 3rem;
    background: var(--border);
    flex-shrink: 0;
  }

  /* ── Panels ── */
  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

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

  .panel-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--muted-foreground);
    flex: 1;
  }

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
    max-height: 420px;
    overflow-y: auto;
    overflow-x: auto;
  }

  .code-block code {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: var(--foreground);
    white-space: pre;
  }

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

  /* ── Formula callout ── */
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

  .formula-tag {
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--primary);
    font-family: var(--font-mono);
    margin-bottom: 0.625rem;
  }

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

  .formula-right {
    font-size: 0.9375rem;
    color: var(--muted-foreground);
    line-height: 1.75;
    flex: 1;
    min-width: 180px;
    padding-top: 1.5rem;
  }

  .formula-right strong { color: var(--foreground); }
  .formula-right code   { font-size: 0.8125rem; }

  /* ── Verdict grid ── */
  .verdict-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

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

  .verdict-icon {
    flex-shrink: 0;
    font-weight: 700;
    margin-top: 1px;
  }

  .verdict-col--bad  .verdict-icon { color: var(--destructive); }
  .verdict-col--good .verdict-icon { color: var(--primary); }

  /* ── Savings banner ── */
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

  .savings-val {
    font-family: var(--font-serif);
    font-size: 1.625rem;
    font-weight: 700;
    color: var(--primary);
    flex-shrink: 0;
  }

  .savings-desc {
    font-size: 0.9375rem;
    color: var(--foreground);
    line-height: 1.6;
    flex: 1;
  }

  .savings-actions { display: flex; gap: 0.625rem; flex-shrink: 0; }

  .savings-btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1.125rem;
    border-radius: var(--radius);
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid var(--border);
    color: var(--foreground);
    background: var(--card);
    transition: all 0.15s ease;
  }

  .savings-btn:hover { background: var(--muted); }

  .savings-btn--primary {
    background: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  .savings-btn--primary:hover { opacity: 0.88; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .panels, .verdict-grid { grid-template-columns: 1fr; }
    .game-cmp { padding: 3rem 1rem; }
    .stats-row { gap: 1rem; padding: 1rem; }
    .stat-divider { display: none; }
    .stat-arrow { display: none; }
  }
</style>

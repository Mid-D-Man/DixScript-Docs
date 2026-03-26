<!-- src/lib/components/docs/sections/DocBuiltinDateTime.svelte -->
<script lang="ts">
  const methods = [
    { name: 'DateTime.now()',              returns: 'timestamp', desc: 'Current UTC date and time' },
    { name: 'DateTime.today()',            returns: 'date',      desc: "Today at midnight UTC" },
    { name: 'DateTime.utcNow()',           returns: 'timestamp', desc: 'Current UTC timestamp' },
    { name: 'DateTime.create(y, m, d)',    returns: 'date',      desc: 'Date from year/month/day' },
    { name: 'DateTime.createTime(y,m,d,h,min,s)', returns: 'timestamp', desc: 'Full timestamp from components' },
    { name: 'DateTime.parse(str)',         returns: 'timestamp', desc: 'Parse ISO 8601 string' },
    { name: 'DateTime.parseExact(s, fmt)', returns: 'timestamp', desc: 'Parse with strftime format' },
    { name: 'DateTime.format(dt, fmt)',    returns: 'string',    desc: 'Format date with strftime pattern' },
    { name: 'DateTime.addDays(dt, n)',     returns: 'timestamp', desc: 'Add n days' },
    { name: 'DateTime.addHours(dt, n)',    returns: 'timestamp', desc: 'Add n hours' },
    { name: 'DateTime.addMinutes(dt, n)',  returns: 'timestamp', desc: 'Add n minutes' },
    { name: 'DateTime.addSeconds(dt, n)',  returns: 'timestamp', desc: 'Add n seconds' },
    { name: 'DateTime.addMonths(dt, n)',   returns: 'timestamp', desc: 'Add n months (handles overflow)' },
    { name: 'DateTime.addYears(dt, n)',    returns: 'timestamp', desc: 'Add n years' },
    { name: 'DateTime.subtract(dt1, dt2)',returns: 'double',    desc: 'Difference in days' },
    { name: 'DateTime.compare(dt1, dt2)', returns: 'int',       desc: '-1 / 0 / 1' },
    { name: 'DateTime.isLeapYear(year)',   returns: 'bool',      desc: 'True if leap year' },
    { name: 'DateTime.daysInMonth(y, m)', returns: 'int',       desc: 'Days in a given month' },
    { name: 'DateTime.year(dt)',           returns: 'int',       desc: 'Year component' },
    { name: 'DateTime.month(dt)',          returns: 'int',       desc: 'Month component (1–12)' },
    { name: 'DateTime.day(dt)',            returns: 'int',       desc: 'Day component (1–31)' },
    { name: 'DateTime.hour(dt)',           returns: 'int',       desc: 'Hour component (0–23)' },
    { name: 'DateTime.minute(dt)',         returns: 'int',       desc: 'Minute component (0–59)' },
    { name: 'DateTime.second(dt)',         returns: 'int',       desc: 'Second component (0–59)' },
    { name: 'DateTime.fromUnixTime(n)',    returns: 'timestamp', desc: 'From Unix epoch seconds' },
    { name: 'DateTime.toUnixTime(dt)',     returns: 'double',    desc: 'To Unix epoch seconds' },
    { name: 'DateTime.dayOfWeek(dt)',      returns: 'int',       desc: '0 = Sunday … 6 = Saturday' },
    { name: 'DateTime.dayOfYear(dt)',      returns: 'int',       desc: '1 – 366' },
  ];
</script>

<div class="doc-page">
  <h1>DateTime</h1>
  <p class="page-lead">
    Date and time creation, parsing, formatting, and arithmetic.
    All methods are called as <code>DateTime.methodName(args)</code>.
  </p>

  <pre><code>expiry  = DateTime.addDays(DateTime.today(), 30)
created = DateTime.format(DateTime.now(), "%Y-%m-%dT%H:%M:%SZ")
diff    = DateTime.subtract(endDate, startDate)  // days as double</code></pre>

  <div class="table-scroll">
    <table>
      <thead><tr><th>Method</th><th>Returns</th><th>Description</th></tr></thead>
      <tbody>
        {#each methods as m}
          <tr>
            <td><code>{m.name}</code></td>
            <td><code style="color:var(--primary)">{m.returns}</code></td>
            <td style="color:var(--muted-foreground)">{m.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

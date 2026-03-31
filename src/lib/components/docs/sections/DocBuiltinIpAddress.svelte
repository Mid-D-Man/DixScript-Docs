<!-- src/lib/components/docs/sections/DocBuiltinIpAddress.svelte -->
<script lang="ts">
  const methods = [
    { name: 'IpAddress.parse(str)',             returns: 'string', desc: 'Parse an IP address string — throws if invalid' },
    { name: 'IpAddress.tryParse(str)',          returns: 'string', desc: 'Parse an IP address, returns null if invalid' },
    { name: 'IpAddress.validate(str)',          returns: 'bool',   desc: 'True if the string is a valid IPv4 or IPv6 address' },
    { name: 'IpAddress.isV4(str)',              returns: 'bool',   desc: 'True if the address is IPv4' },
    { name: 'IpAddress.isV6(str)',              returns: 'bool',   desc: 'True if the address is IPv6' },
    { name: 'IpAddress.isPrivate(str)',         returns: 'bool',   desc: 'True if the address is in a private range (10.x, 172.16–31.x, 192.168.x, fc00::/7)' },
    { name: 'IpAddress.isLoopback(str)',        returns: 'bool',   desc: 'True if the address is a loopback (127.0.0.1, ::1)' },
    { name: 'IpAddress.isPublic(str)',          returns: 'bool',   desc: 'True if the address is public (not private, loopback, or link-local)' },
    { name: 'IpAddress.toBytes(str)',           returns: 'array',  desc: 'Convert to byte array — 4 bytes for IPv4, 16 for IPv6' },
    { name: 'IpAddress.fromBytes(array)',       returns: 'string', desc: 'Create an IP address from a 4-byte (IPv4) or 16-byte (IPv6) array' },
    { name: 'IpAddress.inRange(ip, start, end)',returns: 'bool',   desc: 'True if ip is between start and end (inclusive). All three must be the same version.' },
    { name: 'IpAddress.localhost()',            returns: 'string', desc: 'Returns "127.0.0.1"' },
    { name: 'IpAddress.any()',                  returns: 'string', desc: 'Returns "0.0.0.0" (listen on all interfaces)' },
    { name: 'IpAddress.broadcast()',            returns: 'string', desc: 'Returns "255.255.255.255"' },
  ];

  const privateRanges = [
    { range: '10.0.0.0/8',     desc: 'Class A private network' },
    { range: '172.16.0.0/12',  desc: 'Class B private networks (172.16–172.31)' },
    { range: '192.168.0.0/16', desc: 'Class C private network' },
    { range: 'fc00::/7',       desc: 'IPv6 unique local addresses (fc00:: and fd00::)' },
  ];

  const usageExample = `@QUICKFUNCS(
  // Validate an address before using it in a config
  ~validateHost<bool>(host<string>) {
    return IpAddress.validate(host)
  }

  // Only allow public IPs for external endpoints
  ~mustBePublic<bool>(host<string>) {
    if: !IpAddress.validate(host) { return false }
    return IpAddress.isPublic(host)
  }

  // Build a server entry with validated host
  ~makeEndpoint<object>(host<string>, port<int>, label<string>) {
    let safe_host = IpAddress.tryParse(host)
    return {
      host  = safe_host == null ? IpAddress.localhost() : safe_host
      port  = port
      label = label
      is_public = safe_host != null && IpAddress.isPublic(safe_host)
    }
  }

  // Check if an IP falls in the management subnet
  ~isManagementIp<bool>(ip<string>) {
    return IpAddress.inRange(ip, "10.10.1.0", "10.10.1.255")
  }

  // Normalise: guarantee a valid IP string
  ~normaliseHost<string>(host<string>) {
    let parsed = IpAddress.tryParse(host)
    return parsed == null ? IpAddress.localhost() : parsed
  }
)

@DATA(
  // QuickFunc calls only in @DATA — no builtin calls directly
  api_endpoint  = makeEndpoint("203.0.113.5", 443, "external-api")
  mgmt_endpoint = makeEndpoint("10.10.1.42",  8080, "management")
)`;
</script>

<div class="doc-page">
  <h1>IpAddress</h1>
  <p class="page-lead">
    IP address parsing, validation, classification, and range checking for both
    IPv4 and IPv6. Called as <code>IpAddress.methodName(args)</code> inside <code>@QUICKFUNCS</code>.
  </p>

  <h2>Methods</h2>
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

  <h2>Private Address Ranges</h2>
  <p><code>IpAddress.isPrivate()</code> recognises these ranges.</p>
  <div class="table-scroll">
    <table>
      <thead><tr><th>Range</th><th>Description</th></tr></thead>
      <tbody>
        {#each privateRanges as r}
          <tr>
            <td><code>{r.range}</code></td>
            <td style="color:var(--muted-foreground)">{r.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h2>Usage Inside @QUICKFUNCS</h2>
  <pre><code>{usageExample}</code></pre>

  <h2>Byte Arrays</h2>
  <p>
    <code>IpAddress.toBytes()</code> returns 4 integers for IPv4 or 16 integers for IPv6,
    each in the range 0–255. <code>IpAddress.fromBytes()</code> requires exactly 4 or 16
    elements — any other length is a compile error. Both IPv4 and IPv6 are supported but
    you cannot mix versions in a single <code>inRange()</code> call.
  </p>

  <h2>Notes</h2>
  <p>
    <code>IpAddress.tryParse()</code> is the safe variant — it returns <code>null</code>
    rather than throwing when the input is not a valid IP address. Use it whenever the
    host value originates from config data you do not fully control.
    <code>IpAddress.isPublic()</code> returns <code>true</code> for any address that is
    not private, loopback, or link-local (169.254.0.0/16 for IPv4, fe80::/10 for IPv6).
  </p>
</div>

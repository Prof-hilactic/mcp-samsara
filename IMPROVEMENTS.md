# Samsara MCP — Improvement Plan (Reynolds fork)

Assessment of `automationsquadhq/mcp-samsara` (forked) and the changes we want for the Reynolds
fuel-logistics twin. The original is a competent thin wrapper (~879 LOC, single `src/index.ts`,
~20 tools, MIT). It works, but for a commercial control-tower we need it more robust, safer and
fuel-aware. References below point at the original code.

## What's good (keep)
- Single-purpose, dependency-light (just the MCP SDK), MIT-licensed → safe to fork.
- Sensible tool set for vehicles/routes/drivers/HOS/safety/webhooks/addresses/contacts.
- Nice touch: `samsara_update_route` auto-preserves stop IDs (`src/index.ts:580`) to keep
  arrival/departure tracking — a real Samsara gotcha handled well.
- `externalIds` passed through on routes/addresses/contacts → good for TMS/twin correlation.

## Weaknesses → improvements

### 1. Fragile HTTP / retry (correctness)
- 429 handling **recurses with no cap** (`src/index.ts:64-69`) → can loop indefinitely; no retry
  on 5xx or network errors; `Retry-After` only parsed as seconds.
- **Fix:** bounded exponential backoff + jitter, retry 429/5xx/network up to N, honour
  `Retry-After` (seconds *or* HTTP date), surface a clean error after exhaustion. *(implemented)*

### 2. No write/safety guardrails (safety — critical for an LLM)
- Destructive tools (`samsara_delete_route` `:613`, `samsara_delete_webhook` `:764`,
  create/update) are always exposed. An LLM control tower should be **read-only by default**.
- **Fix:** `SAMSARA_ALLOW_WRITES` env (default **false**) — write/delete tools are hidden from
  `ListTools` and blocked in `CallTool` unless explicitly enabled. *(implemented)*

### 3. No input validation (robustness)
- Args are `as Record<string, any>` (`:481`) with no runtime checks; e.g.
  `toolArgs.vehicleIds.join(',')` (`:528`) throws if the field is missing.
- **Fix now:** defensive guards on required fields with friendly errors. *(implemented)*
- **Fix next:** adopt **Zod** schemas per tool; generate `inputSchema` from them (one source of truth).

### 4. Hard-coded vehicle stat types (coverage)
- `samsara_get_vehicle_stats` hard-codes `obdOdometerMeters,obdEngineSeconds,fuelPercents`
  (`:531`) — can't fetch GPS-derived fuel, engine state, DEF, etc.
- **Fix:** optional `types` param (defaulting to the fuel-relevant set). *(implemented)*

### 5. Route "optimization" is naive **and auto-applies** (correctness + safety)
- `optimizeStops` is straight-line nearest-neighbour (`:816`), `distance()` returns `Infinity`
  on any missing coord (`:853`) → can silently mis-order; and it **writes the new order back
  immediately** (`:641`).
- **Fix now:** make it **dry-run by default** (return the proposed order; only apply with
  `apply:true`); skip safely if coordinates are missing. *(implemented)*
- **Fix next:** delegate real optimisation to our OR-Tools/VROOM + Valhalla service; this tool
  should *propose*, not decide.

### 6. Token-heavy responses (LLM cost)
- Every tool dumps full `JSON.stringify(response, null, 2)` (e.g. `:495`). Samsara payloads are
  large and mostly irrelevant per call → wastes context/tokens.
- **Fix next:** field projection / compact `summary` mode on list tools; optionally return MCP
  `structuredContent` so downstream code gets typed data, not a text blob.

### 7. Missing fuel-logistics tools (coverage gaps for us)
Add tools the twin needs: **geofences + geofence events**, **fuel & energy reports**, **fuel
level / fuel-drop alerts**, **engine faults/DTCs**, **idling**, **trailers/assets** (tanker
trailers), **documents & form submissions** (ePOD/BOL), **driver–vehicle assignments**, **tags**,
and **HOS remaining/clocks** (drive-time left → feeds routing feasibility). Parametrising #4 covers
some fuel stats immediately.

### 8. Auth & transport (productisation)
- Static env token only (`:20`); **stdio transport only** (`:871`).
- **Fix next:** add **OAuth 2.0** (token refresh) alongside the static token for multi-org; add a
  **Streamable HTTP** transport option so the control tower can connect remotely with auth.

### 9. Observability & security
- Only a startup log; errors may leak token/PII; no request logging/metrics.
- **Fix next:** structured logging (to stderr) with **secret redaction**, request IDs, and a
  webhook **signature-verification** helper.

### 10. Engineering hygiene (DX)
- One 879-line file; **no tests**; `build` uses `chmod` (`package.json`, breaks on Windows);
  SDK pinned to old `^1.0.4`.
- **Fix next:** modularise (`client/`, `tools/`, `schemas/`), add **vitest** unit tests + a mock
  Samsara server, CI (typecheck+test+lint), cross-platform build, bump the SDK.

## What we changed in this commit (compile-safe, no new endpoints invented)
1. Bounded retry/backoff with jitter; retries 429/5xx/network; `Retry-After` seconds-or-date.
2. `SAMSARA_ALLOW_WRITES` (default false) — read-only by default; writes hidden + blocked.
3. Defensive required-field validation with friendly errors.
4. `types` param on `samsara_get_vehicle_stats`.
5. `samsara_optimize_route` is dry-run by default (`apply:true` to write); coord-safe.

## Roadmap for the rest
Zod validation → token-lean/structured responses → fuel-logistics tool pack (geofences, fuel,
faults, trailers, ePOD, HOS clocks) → OAuth2 + HTTP transport → modularise + tests + CI. Tracked
against `docs/03-integration-samsara.md` in the main project (we own this server going forward).

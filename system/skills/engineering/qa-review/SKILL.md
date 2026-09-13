---
name: qa-review
description: Runtime QA pass over a change — run the Playwright harness, browser-verify unscripted assertions against explicit oracles, explore with a charter, then graduate stable screens into specs.
disable-model-invocation: true
---

# QA Review

Verify a change **at runtime** — drive the real app, not the diff. Complements `/code-review` (static): code review catches logic visible in the code; this catches what only shows up composed on screen (a `locked` hardcoded to `false` across 4 loaders looks fine at every call site and is only visibly wrong in the browser).

Three tiers, cheapest first. The project's QA setup (login route, seed data, reference states, port) lives in the project's QA doc — look for `docs/qa/harness.md`; if absent, ask the user how to reach a running authenticated app before proceeding.

## 1. Harness — scripted specs

If the repo has Playwright specs, run them from Bash (`pnpm playwright test` or the project's script). Near-zero token cost: pass/fail + short log. Only open a trace or screenshot on failure. Patterns for writing/repairing specs: [references/playwright-harness.md](references/playwright-harness.md).

## 2. Browser-verify — `[harness]` assertions with no spec yet

Collect the assertions from the tickets in scope (their `## QA` sections — produced by `/qa-assert`; if none exist, derive assertions from the ticket text first, same scenario+oracle format).

Drive each one in the browser. Rules:

- **Accessibility tree first.** Use the browser tooling's accessibility-tree / page-text extraction (~hundreds of tokens) to decide text, roles, disabled states, URLs. Screenshot (thousands of tokens) only for oracles that are genuinely visual.
- **Explicit oracle, no self-grading.** Pass = the oracle's observables hold, including its negatives ("not still on /login", "no verb rendered on a locked row"). "Looks good" and "no error" are not verdicts.
- **Seeded deep links.** Navigate straight to the state's URL with seeded ids; don't re-walk login and navigation per assertion.

## 3. Explore — `[explore]` assertions and the unknown

One time-boxed pass per screen, under a **charter**: "Explorer [écran] pour découvrir [classe de problème]". Push past the happy path: back button, interrupted flow, repeated action, hostile input, both themes/breakpoints if the project has them.

Log findings as you go, tagged: **BUG** (repro steps), **QUESTION**, **RISK**, **NOTE**. Judgement calls (spacing, hierarchy, consistency) compare against the project's design system doc and wireframes, not taste.

## 4. Report + graduation

Report per assertion: pass / fail (with the observable that broke) / not checkable (say why). Then apply the two **graduation** rules — exploration pays once, never twice:

- **Second visit → spec.** Any screen browser-verified for the second time across sessions gets its Playwright spec written now (this tier-2 work becomes tier-1 forever).
- **Repro'd bug → regression spec.** Every reproducible BUG from tier 3 gets a failing spec before or alongside its fix.

Done when: every assertion has a verdict, and the graduation list (specs to write, with target files) is either written or handed to the user as explicit follow-up.

---
name: qa-assert
description: Turn tickets or a spec into binary QA assertions (scenario + oracle), tagged [harness] or [explore], published into the tickets.
---

# QA Assert

Turn tickets, a spec, or the current conversation into **assertions** — binary, checkable statements about runtime behaviour — and publish them into the tickets so any later QA pass (human, browser agent, or Playwright) verifies the same things.

An assertion has two halves:

- **Scenario** (WHAT): the state and the action. "Écriture verrouillée, ouvrir le détail."
- **Oracle** (HOW to verify): the observable that decides pass/fail. "Aucune row cliquable, switch désactivé, badge cadenas visible."

Scenarios describe behaviour; oracles describe how to verify it. An assertion without an oracle is an opinion.

## Process

### 1. Gather requirements

Work from the conversation, or fetch the tickets/spec the user names (issue tracker workflow: `docs/agents/issue-tracker.md`). Extract every explicit requirement, and note implicit ones (things the spec assumes but never states) — implicit requirements are where regressions hide.

### 2. Enumerate data states

For each screen or flow touched, list its **data states** — the distinct shapes of data that change what renders: empty / partial / filled / locked / error / over-limit. One assertion per data state minimum. A feature tested only in its filled happy state is untested.

Boundary prompts: zero/one/many, max±1, empty string, already-at-100% (a real bug class: "cap works at 300 remaining" passed while "cap at 0 remaining" overshot).

### 3. Build the coverage matrix

Before writing any assertion, map: requirement → data state → assertion → oracle type → tag. Oracle types:

- **UI state** — visible text, role, URL (`getByRole`-style observables, never CSS classes or internals)
- **Persisted data** — what the API/DB holds after the action
- **Side effect** — request fired, navigation happened, analytics event
- **Negative** — what must NOT appear (no error toast, no editable row, not still on /login)

The matrix is the gap-detector: a requirement with no negative oracle, or a state with no assertion, is a hole. Show it to the user before publishing.

### 4. Tag each assertion

- `[harness]` — deterministic, a script can decide pass/fail (URL, text, count, disabled state). These are future Playwright specs.
- `[explore]` — needs judgement (spacing, visual consistency, "feels wrong"). These stay human/agent-eye work.

Most assertions should be `[harness]`. An `[explore]` tag on something a script could check is a cop-out; rewrite the oracle until it's binary or justify the tag.

### 5. Publish

Append a `## QA` section to each ticket (same tracker workflow as the rest of the ticket). Format, one line per assertion:

```
- [harness] verrouillée → detail: aucune row cliquable, switch disabled, badge cadenas
- [harness] reste=0 → lier une écriture poste montant_lettre=0 (négatif: jamais le montant plein)
- [explore] row « Exclue de la compta » → taille/alignement cohérents avec les autres rows
```

Done when: every requirement in the matrix has at least one assertion, every assertion has an oracle, and the sections are on the tickets.

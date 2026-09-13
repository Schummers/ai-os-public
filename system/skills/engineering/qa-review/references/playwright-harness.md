# Playwright harness patterns

Rules for writing the specs that graduation produces. Goal: specs that pass deterministically for years, not once.

## Locators

- `getByRole` / `getByLabel` / `getByText` — what the user sees, never CSS classes, XPath, or DOM nesting.
- `getByTestId` only for elements with no stable role/label, with a comment justifying it.
- Assertions on outcomes (visible text, URL, count, disabled), never implementation details.

## Waiting

- Zero `waitForTimeout`. Web-first assertions auto-retry: `await expect(locator).toBeVisible()`, `toHaveURL`, `toHaveCount`.
- Enforce: `grep -rn 'waitForTimeout' e2e/` must print nothing.

## Auth

- One setup project logs in once and saves `storageState`; all test projects replay it. If the app has a passwordless QA login route (e.g. `/api/qa-login`), the setup project just hits it and saves state — fastest possible.

## Structure

```
e2e/
├── fixtures/        # auth, seeded-data fixtures (compose, auto-teardown)
├── pages/           # page objects — return locators/values, NEVER assert
├── tests/           # one file per screen/flow, grouped by feature
└── global-setup.ts  # storageState auth
```

- Component objects take a root `Locator`, not a `Page`; pages compose them. No god objects, no deep inheritance.
- `test.step()` around logical groups for readable traces.
- Tests independent and atomic: `fullyParallel: true`; `test.describe.serial` only with justification.

## Oracles in spec form

Each spec mirrors its ticket assertion, including the negative:

```ts
test('écriture verrouillée: read-only', async ({ page }) => {
  await page.goto(`/app/compta/depense/${QA.verrouillee}`);
  await expect(page.getByText('Verrouillée')).toBeVisible();
  // négatif de l'oracle : aucun verbe d'action rendu
  await expect(page.getByText('Ajouter')).toHaveCount(0);
});
```

## Determinism

- Seeded data reset before the run (project's bootstrap script), stable ids from the project QA doc.
- `forbidOnly: !!process.env.CI`, no `continue-on-error`, retries only for annotated known-flaky (target: zero).

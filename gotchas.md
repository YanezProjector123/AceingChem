# Gotchas and Edge Cases

## 2025-05-17: GasStoichiometryActivity.js random selection bug

**Issue:**
- In some cases, the random selection logic for `known` or `unknown` substances in `generateGasStoichProblem()` could result in `undefined` values, causing `Cannot read properties of undefined (reading 'formula')` errors.

**Root Cause:**
- `pickRandom` was called on empty arrays if no suitable gas/non-gas substances existed for a given reaction/type combination.

**Solution:**
- Defensive checks were added so `pickRandom` returns `undefined` for empty arrays, and if any required substance is missing, the function re-generates a new problem.

**Prevention:**
- Always check that random selections are valid before accessing properties. If not, re-roll or fallback.

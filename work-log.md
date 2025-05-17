## [2025-05-17] Added IdealGasActivity.js
- Created IdealGasActivity.js for interactive ideal gas law problems, with feedback and periodic table integration.
- Integrated IdealGasActivity into App.js: added lazy import and routing for 'ideal-gas-law', making it accessible from the Topics menu.
- Features:
  - Randomized problem generation (solves for P, V, n, or T).
  - Stepwise, constructive feedback for incorrect answers.
  - 'Next' button after each attempt.
  - Periodic Table button integrated (uses shared `onShowPeriodicTable`).
  - UI consistent with other activities.
- All logic and UI patterns modeled after `MassToMassActivity.js` and `TheoreticalPercentYieldActivity.js`.
- Feedback logic explains the solution process and highlights user mistakes.
- Documentation updated per operational directives.

## [2025-05-18] Added BoylesLawActivity.js and CharlesLawActivity.js
- Created BoylesLawActivity.js for Boyle's Law (P1V1 = P2V2) practice, and CharlesLawActivity.js for Charles's Law (V1/T1 = V2/T2) practice.
- Both activities feature:
  - Randomized question generation (solves for any variable in the law).
  - Calculator-style, stepwise feedback for incorrect answers.
  - Modern, consistent UI matching IdealGasActivity.
  - 'Next' button after each attempt.
  - Seamless integration with Topics menu and App.js routing.
- Updated Topics.js:
  - Added buttons for "Boyle's Law" and "Charles's Law" in the Gas Law Activities section.
  - Buttons dispatch correct keys to `onGasLawActivity` for navigation.
- Updated App.js:
  - Added lazy imports and renderScreen cases for 'boyles-law' and 'charles-law'.
  - Ensured navigation and feedback are consistent with other gas law activities.
- Documentation updated per operational directives.

## [2025-05-17] CollectingGasOverWaterActivity.js Added

### CollectingGasOverWaterActivity.js
- Created for practice with collecting gas over water (Dalton's Law with vapor pressure correction).
- Generates random problems:
  - Find dry gas pressure.
  - Find moles of dry gas (PV = nRT with vapor pressure correction).
  - Find volume of dry gas.
- Uses a vapor pressure table for water at various temperatures.
- Provides immediate feedback and explanations.
- UI matches all other gas law activities (modern card, button-row, etc.).
- Integrated into App.js (lazy import, route) and Topics.js (button in Gas Law Activities).
- All changes are additive and backward compatible.

## [2025-05-17] GrahamLawActivity.js Added & DaltonLawActivity UI Updated

### GrahamLawActivity.js
- Created GrahamLawActivity.js for Graham's Law of Effusion/Diffusion practice.
- Features infinite random question generation:
  - Calculate rate ratio for two gases.
  - Find unknown molar mass given rate ratio.
  - Inverse problems (find heavier gas given lighter and rate ratio).
- Provides stepwise feedback and explanations.
- UI matches all other gas law activities (modern card, button-row, etc.).
- Integrated into App.js (lazy import, route) and Topics.js (button in Gas Law Activities).
- All changes are additive and backward compatible.

### DaltonLawActivity.js
- Refactored UI to exactly match the layout and classNames of other gas law activities for consistency.

## [2025-05-18] Added CombinedGasLawActivity.js

## [2025-05-17] Fixed GasStoichiometryActivity Periodic Table Button

## [2025-05-17] Created DaltonLawActivity.js
- Added DaltonLawActivity.js for Dalton's Law of Partial Pressures, modeled after IdealGasActivity.js and BoylesLawActivity.js.
- Features random question generation (total pressure, missing partial, mole fraction/partial).
- Modern UI with feedback, stepwise explanations, Next, Periodic Table, and Back buttons.
- Requires onBack and onShowPeriodicTable props for navigation and periodic table access.
- All changes are additive and backward compatible.
- Integration with App.js and Topics.js planned next.

- The Periodic Table button in GasStoichiometryActivity was not visible because App.js did not pass the required onShowPeriodicTable prop.
- Updated App.js to pass onShowPeriodicTable in the same manner as BoylesLawActivity, enabling the button and ensuring consistent user experience across gas law activities.
- This change is additive and preserves backward compatibility.

- Created CombinedGasLawActivity.js for Combined Gas Law [(P1V1)/T1 = (P2V2)/T2] practice.
- Features:
  - Randomized question generation (solves for any variable: P1, V1, T1, P2, V2, T2).
  - Calculator-style, stepwise feedback for incorrect answers.
  - Modern, consistent UI matching other gas law activities.
  - 'Next' button after each attempt.
  - Seamless integration with Topics menu and App.js routing.
- Updated Topics.js:
  - Added button for "Combined Gas Law" in the Gas Law Activities section.
  - Button dispatches correct key to `onGasLawActivity` for navigation.
- Updated App.js:
  - Added lazy import and renderScreen case for 'combined-gas-law'.
  - Ensured navigation and feedback are consistent with other gas law activities.
- Documentation updated per operational directives.

## [YYYY-MM-DD] MassToMassActivity - Custom CSS Implementation

- Created `MassToMassActivity.css` for a unique, modern, glassmorphism-inspired look specific to the Mass-to-Mass activity.
- Imported the new CSS file in `MassToMassActivity.js`.
- Updated documentation in `implementation_details.md`.
- No changes made to component logic or structure.

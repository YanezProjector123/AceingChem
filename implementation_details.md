# Implementation Details

## 2025-05-17: DaltonLawActivity.js Implementation
- **Purpose:** Practice for Dalton's Law of Partial Pressures, modeled after IdealGasActivity.js and BoylesLawActivity.js.
- **Question Types:**
  - Find total pressure from a set of partial pressures.
  - Find a missing partial pressure given total and the others.
  - Find partial pressure using mole fraction and total pressure (mole fraction = moles of gas / total moles).
- **UI/UX:**
  - Modern card layout, consistent with other activities.
  - Includes question prompt, numeric input, feedback, stepwise explanation, and buttons for Next, Periodic Table, and Back.
- **Props:**
  - Requires `onBack` and `onShowPeriodicTable` props for navigation and periodic table access.
- **Feedback:**
  - Immediate feedback after answer submission, with tolerance for rounding errors.
  - Stepwise calculator-style explanation for incorrect answers.
- **Additive:**
  - No existing functionality is changed or removed. Fully backward compatible.

## 2025-05-17: GasStoichiometryActivity Periodic Table Button Fix
- The `GasStoichiometryActivity` component requires the `onShowPeriodicTable` prop for the Periodic Table button to be visible and functional.
- Previously, App.js did not pass this prop, so the button did not appear.
- The fix updates App.js to pass `onShowPeriodicTable={() => { setHistoryStack(h => [...h, {screen: 'gas-stoichiometry'}]); handleTransition('ptable'); }}` to `GasStoichiometryActivity`, exactly matching the pattern used for `BoylesLawActivity` and other gas law activities.
- This ensures the button is always rendered and works as expected, maintaining navigation stack consistency and user experience across activities.

# Implementation Details Update: MassToMassActivity Custom CSS

## Summary
A new file, `MassToMassActivity.css`, was created to provide a unique, modern, and glassmorphism-inspired visual style exclusively for the Mass-to-Mass activity. This CSS is imported only in `MassToMassActivity.js` and overrides the default look for this activity, making it more visually engaging and distinct from other activities.

## Key Features
- Vibrant gradient background
- Enhanced card layout with glassmorphism and border glow
- Modern, bold typography for the activity title
- Polished inputs, buttons, and feedback containers with interactive effects
- Responsive design for mobile and desktop
- Subtle animations for card and feedback appearance

## Integration
- The CSS file is imported at the top of `MassToMassActivity.js`.
- No changes were made to the logic or structure of the React component.

## Rationale
This approach ensures that only the Mass-to-Mass activity receives the new aesthetic, preserving the appearance and functionality of other activities. The use of a dedicated CSS file supports modularity, maintainability, and easier future updates.

---
*Update Date: [YYYY-MM-DD]*

### CollectingGasOverWaterActivity.js
- Implements practice for collecting gas over water (Dalton's Law with vapor pressure correction).
- Randomly generates problems:
  - Find the pressure of dry gas given total pressure and vapor pressure.
  - Find moles of dry gas collected (using PV = nRT with vapor pressure correction).
  - Find the volume of dry gas collected.
- Uses a realistic vapor pressure table for water at various temperatures.
- Provides stepwise feedback and explanations for each problem.
- UI matches all other gas law activities (modern card, button-row, etc.).
- Integrated into App.js with lazy import and route, and navigation from Topics.js.

### IdealGasActivity.js Implementation Details
- **Purpose:** Practice for the ideal gas law (PV=nRT), modeled after other activities.
- **Problem Generation:** Randomly selects one variable (P, V, n, T) to solve for; generates plausible values for others.
- **Feedback:** Stepwise, constructive feedback on incorrect answers, including formula, substitution, and calculation steps.
- **Periodic Table:** Button triggers `onShowPeriodicTable` prop, leveraging the shared PeriodicTable component.
- **UI/UX:** Matches the style and flow of existing activities, including navigation and feedback containers.
- **Answer Checking:** Accepts answers within a small tolerance for rounding errors.
- **Documentation:** All changes logged in `work-log.md` and summarized here for maintainability.

## Implementation Details: IdealGasActivity.js

- Implements randomized ideal gas law (PV=nRT) problems.
- Provides stepwise, constructive feedback for incorrect answers.
- Integrates a periodic table button using the shared prop.
- UI and logic are consistent with other activities.
- Includes a "Next" button after each attempt.

### Integration into App.js
- Added a lazy import for `IdealGasActivity` in `App.js`.
- Updated the `renderScreen` function to include a case for `'ideal-gas-law'`, rendering the new activity with props for navigation and periodic table access.
- The activity is now accessible via the "Ideal Gas Law" button in the Gas Law Activities section of the Topics menu.
- Navigation and feedback are consistent with other activities.

---

## Implementation Details: BoylesLawActivity.js & CharlesLawActivity.js

### Purpose
- Practice for Boyle's Law (P1V1 = P2V2) and Charles's Law (V1/T1 = V2/T2), modeled after IdealGasActivity.js for UI/UX consistency.

### Problem Generation
- Each activity randomly selects a variable to solve for, generating plausible values for the others.
- Ensures a diverse set of questions for repeated practice.

### Feedback Logic
- Calculator-style, stepwise feedback for incorrect answers, including formula, substitution, and calculation steps.
- Accepts answers within a small tolerance for rounding errors.

### UI/UX
- Modern, consistent UI matching IdealGasActivity.js.
- Includes a "Next" button after each attempt.
- Navigation and feedback containers match the style and flow of other activities.

### Integration into Topics.js
- Added buttons for "Boyle's Law" and "Charles's Law" in the Gas Law Activities section.
- Buttons dispatch correct keys to `onGasLawActivity` for navigation.

### Integration into App.js
- Added lazy imports and renderScreen cases for 'boyles-law' and 'charles-law', rendering the new activities with required props for navigation and periodic table access.
- Activities are now accessible via the Topics menu.

### Rationale
- Maintains modular, scalable architecture for easy addition of new activities.
- Naming convention for activity keys is consistent (kebab-case), reducing confusion and improving maintainability.

---
*Update Date: 2025-05-18*

## Implementation Details: CombinedGasLawActivity.js

### Purpose
- Practice for the Combined Gas Law [(P1V1)/T1 = (P2V2)/T2], modeled after other gas law activities for UI/UX consistency.

### Problem Generation
- Randomly selects a variable to solve for (P1, V1, T1, P2, V2, T2), generating plausible values for the others.
- Ensures a diverse set of questions for repeated practice.

### Feedback Logic
- Calculator-style, stepwise feedback for incorrect answers, including formula, substitution, and calculation steps.
- Accepts answers within a small tolerance for rounding errors.

### UI/UX
- Modern, consistent UI matching other gas law activities.
- Includes a "Next" button after each attempt.
- Navigation and feedback containers match the style and flow of other activities.

### Integration into Topics.js
- Added button for "Combined Gas Law" in the Gas Law Activities section.
- Button dispatches correct key to `onGasLawActivity` for navigation.

### Integration into App.js
- Added lazy import and renderScreen case for 'combined-gas-law', rendering the new activity with required props for navigation and periodic table access.
- Activity is now accessible via the Topics menu.

### Rationale
- Maintains modular, scalable architecture for easy addition of new activities.
- Naming convention for activity keys is consistent (kebab-case), reducing confusion and improving maintainability.

---
*Update Date: 2025-05-18*

# Implementation Details Update: TheoreticalPercentYieldActivity Integration

## Summary
The `TheoreticalPercentYieldActivity` was integrated into the app as a selectable activity under the Stoichiometry section in `Topics.js`. The button labeled "Theoretical & Percent Yield" now triggers this activity, which is rendered and managed by `App.js`.

## Key Features
- The Stoichiometry section in `Topics.js` includes a button for "Theoretical & Percent Yield".
- Clicking the button triggers `onPeriodicActivity('theoretical-percent-yield')`, which updates the main app state to show the activity.
- The `App.js` render logic for 'theoretical-percent-yield' displays the `TheoreticalPercentYieldActivity` component and passes the required props for navigation, periodic table, and state persistence.
- State for the activity is saved and restored using `savedState` and `setSavedState` props, ensuring user progress is maintained.

## Integration
- The Topics.js button dispatches the correct activity key (`theoretical-percent-yield`) to the app state.
- App.js listens for this state and renders the activity with all required props.
- No changes were made to other activities or unrelated state logic.

## Rationale
This approach maintains a modular and scalable architecture, allowing new activities to be added with minimal changes to the main routing/state logic. The naming convention for activity keys is now consistent (kebab-case), reducing confusion and improving maintainability.

---
*Update Date: 2025-05-17*

# Bug Fix: TheoreticalPercentYieldActivity Routing Key Mismatch

## Issue
When clicking the "Theoretical & Percent Yield" button, the app navigated to the Welcome page instead of the activity. This was due to a mismatch in the routing key: `handlePeriodicActivity` used `'theoreticalPercentYieldActivity'` (camelCase), but `renderScreen` expected `'theoretical-percent-yield'` (kebab-case).

## Solution
The `handlePeriodicActivity` function was updated to use `'theoretical-percent-yield'` as the screen key, matching the key used in `renderScreen`.

## Prevention
- Always use consistent, documented keys for activity routing.
- Prefer kebab-case for new activity keys for clarity and consistency.

---
*Update Date: 2025-05-15*

### CollectingGasOverWaterActivity.js Implementation Details
- **Purpose:** Practice for collecting gas over water (Dalton's Law with vapor pressure correction), modeled after other gas law activities for UI/UX consistency.
- **Problem Generation:** Randomly selects a variable to solve for (P1, V1, T1, P2, V2, T2), generating plausible values for the others.
- **Feedback Logic:** Calculator-style, stepwise feedback for incorrect answers, including formula, substitution, and calculation steps.
- **UI/UX:** Modern, consistent UI matching other gas law activities.
- **Integration into Topics.js:** Added button for "Collecting Gas Over Water" in the Gas Law Activities section.
- **Integration into App.js:** Added lazy import and renderScreen case for 'collecting-gas-over-water', rendering the new activity with required props for navigation and periodic table access.
- **Rationale:** Maintains modular, scalable architecture for easy addition of new activities. Naming convention for activity keys is consistent (kebab-case), reducing confusion and improving maintainability.

---
*Update Date: 2025-05-15*
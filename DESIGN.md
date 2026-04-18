# Design System Specification: The Editorial Health Experience

## 1. Overview & Creative North Star
### Creative North Star: "The Living Journal"
This design system rejects the clinical, spreadsheet-like nature of traditional calorie trackers. Instead, we embrace **"The Living Journal"**—a high-end editorial approach that treats nutritional data with the same aesthetic reverence as a premium lifestyle magazine. 

We move beyond the "template" look by utilizing intentional white space, exaggerated typography scales, and organic depth. The goal is to make the user feel they are curating their life, not just recording their intake. We achieve this through "The Airy Grid": a layout strategy that favors breathability and soft tonal shifts over rigid lines and heavy containers.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the vitality of the 'Granny Smith' green, balanced by a sophisticated neutral foundation that allows food photography and numerical data to pop.

### The "No-Line" Rule
**Borders are a design failure.** In this system, 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined exclusively through:
*   **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
*   **Tonal Transitions:** Using subtle shifts in lightness to imply containment.
*   **Negative Space:** Using the Spacing Scale to create "implied containers."

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper or frosted glass.
*   **Base:** `surface` (#f8faf8) is your canvas.
*   **Sectioning:** Use `surface-container-low` (#f2f4f2) for large background blocks.
*   **Interactivity:** Use `surface-container-lowest` (#ffffff) for primary cards to create a natural, "raised" feel.
*   **Prominence:** Reserve `surface-container-high` (#e6e9e7) for recessed elements like search bars or inactive states.

### The "Glass & Gradient" Rule
To elevate the experience, floating elements (like Bottom Navigation or Modals) should utilize **Glassmorphism**. Use semi-transparent `surface` colors with a 20px+ backdrop-blur. 
*   **Signature Texture:** Primary CTAs should not be flat. Apply a subtle linear gradient from `primary` (#396a05) to `primary-container` (#88c057) at a 135-degree angle to add "soul" and dimension.

---

## 3. Typography: Data as Art
We use a dual-font strategy to balance editorial sophistication with functional clarity.

*   **Display & Headlines (Manrope):** This is our "Editorial" voice. Use `display-lg` and `headline-lg` with tight tracking (-2%) to make calorie totals and daily summaries feel like magazine mastheads.
*   **Body & UI (Inter):** Our "Functional" voice. Inter provides high legibility for nutritional labels and fine print.
*   **Numerical Emphasis:** Numbers are the hero. When displaying "Calories Remaining," use `display-lg` in `on-surface`. Never bury the data; let the typography do the heavy lifting.

---

## 4. Elevation & Depth
Depth is a feeling, not a drop-shadow effect. We achieve it through **Tonal Layering**.

*   **The Layering Principle:** Avoid shadows where possible. A `surface-container-lowest` card sitting on a `surface-container-low` background provides enough "lift" for the eye.
*   **Ambient Shadows:** For elements that truly float (e.g., FABs, Modals), use "Ambient Light" shadows. 
    *   *Values:* 0px 12px 32px rgba(25, 28, 27, 0.06). 
    *   *Note:* The shadow is a tinted version of `on-surface`, never pure black.
*   **The "Ghost Border" Fallback:** If a layout requires a container edge for accessibility, use the `outline-variant` (#c2c9b6) at **15% opacity**. This creates a "breath" of a line rather than a hard stop.

---

## 5. Components

### Cards & Progress
*   **The Card Primitive:** All cards must use `md` (1.5rem/24px) or `lg` (2rem/32px) corner radius. 
*   **Data Visualization:** Use `primary` (#396a05) for positive progress and `secondary` (#8f4e00) or `tertiary` (#b3272e) for overages.
*   **No Dividers:** In lists of food items, never use a line divider. Use 16px of vertical space or a subtle `surface-variant` hover state.

### Buttons
*   **Primary:** High-pill shape (`full` roundedness). Gradient fill (Primary to Primary-Container). No shadow.
*   **Secondary:** Ghost style. No background, `outline-variant` (20% opacity) border, `primary` text.
*   **Tertiary:** Text-only, `on-surface-variant` for low-priority actions like "Cancel."

### Inputs & Fields
*   **Style:** Minimalist. `surface-container-high` background, `md` corners. 
*   **State:** On focus, the background shifts to `surface-container-lowest` with a "Ghost Border" of `primary` at 40% opacity.

### Nutritional Chips
*   **Action Chips:** Used for "Quick Add" (e.g., +100 kcal). Use `primary-fixed` background with `on-primary-fixed` text. This high-contrast pairing signals high interactivity.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Let a "Daily Summary" card take up 70% of the screen width, leaving 30% for "Quick Stats" to create a modern, editorial rhythm.
*   **Use Generous Padding:** If you think there is enough padding inside a card, add 8px more. We want "Airy," not "Cramped."
*   **Tint Your Neutrals:** Always use the `surface` and `surface-container` tokens which are slightly warmed/greened. Avoid pure #FFFFFF or #000000.

### Don't:
*   **Don't use 1px Dividers:** Use white space. If you feel lost, use a tonal background shift.
*   **Don't use Standard Drop Shadows:** If it looks like a "default" shadow, it’s too heavy. It should be barely felt, not seen.
*   **Don't hide the numbers:** Calorie counts and macros are the user's focus. Make them large (`title-lg` or higher) and bold.
*   **Don't use hard corners:** Anything under 16px radius feels too "tech." Keep it organic and soft.
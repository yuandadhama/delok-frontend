// src/constants/action.ts

/** Short anti-spam cooldown (ms) applied after a successful user action so
 *  the user cannot immediately trigger the same action again. It does NOT
 *  delay the API request, cache update, UI update, toast, or navigation. */
export const ACTION_COOLDOWN_MS = 3000;

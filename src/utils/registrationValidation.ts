import React, { useCallback } from 'react';

/**
 * Shared validation helpers for non-traveler registration forms.
 */

export type FieldErrors = Record<string, string>;

interface RequiredFieldRule {
  /** Key used in the errors object and for the field highlight */
  key: string;
  /** The current value of the field */
  value: string;
  /** Human-readable label shown in the error message */
  label: string;
}

/**
 * Validates a set of required text fields.
 * Returns a FieldErrors map — empty when everything is valid.
 */
export function validateRequiredFields(rules: RequiredFieldRule[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const { key, value, label } of rules) {
    if (!value || !value.trim()) {
      errors[key] = `${label} is required`;
    }
  }
  return errors;
}

/**
 * Checks that at least one offering entry exists and returns the
 * appropriate error if not.
 *
 * @param items   The array of offerings added so far
 * @param key     Error key (e.g. "tours", "offerings", "experiences", "spaces")
 * @param label   Human-readable offering name for the message
 */
export function validateAtLeastOneOffering(
  items: unknown[],
  key: string,
  label: string,
): FieldErrors {
  if (items.length === 0) {
    return { [key]: `Please add at least one ${label}` };
  }
  return {};
}

/**
 * Validates sub-fields when the user clicks "Add <offering>".
 * Returns errors for whichever sub-fields are empty.
 */
export function validateOfferingFields(rules: RequiredFieldRule[]): FieldErrors {
  return validateRequiredFields(rules);
}

/**
 * Merges new offering-level errors into the existing fieldErrors state,
 * clearing the given keys first when there are no errors.
 */
export function clearOfferingErrors(
  prev: FieldErrors,
  keys: string[],
): FieldErrors {
  const next = { ...prev };
  for (const k of keys) {
    delete next[k];
  }
  return next;
}

/**
 * Helper to create an onChange handler that clears the error for a given key.
 */
export function clearFieldError(
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
  key: string,
) {
  return () =>
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
}

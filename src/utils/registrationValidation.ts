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

/**
 * Hook that returns a helper to create onChange handlers that
 * update form state and clear the corresponding field error in one call.
 *
 * Usage:
 *   const handleChange = useFieldChange(setFormData, setFieldErrors);
 *   <Input onChange={handleChange('firstName')} />
 */
export function useFieldChange<T extends Record<string, unknown>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>,
) {
  return useCallback(
    (field: keyof T & string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        setFieldErrors((prev) => {
          if (!(field in prev)) return prev;
          const { [field]: _, ...rest } = prev;
          return rest;
        });
      },
    [setFormData, setFieldErrors],
  );
}

/* -------------------------------------------------------------------------- */
/* Strongly typed error model                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Discriminated union describing every shape of error the registration flow
 * is expected to encounter. Using this in place of `any` in catch blocks gives
 * us safe, exhaustive handling of validation, database, and unexpected errors.
 */
export type RegistrationError =
  | {
      kind: 'validation';
      message: string;
      /** Field-level issues from Zod (path + message). */
      issues: Array<{ path: string; message: string }>;
      cause: unknown;
    }
  | {
      kind: 'database';
      message: string;
      /** Postgrest / Supabase error code, e.g. "23505". */
      code?: string;
      details?: string;
      hint?: string;
      cause: unknown;
    }
  | {
      kind: 'network';
      message: string;
      cause: unknown;
    }
  | {
      kind: 'unknown';
      message: string;
      cause: unknown;
    };

/** Shape of a Zod-like validation error without depending on the zod package. */
interface ZodLikeIssue {
  path?: Array<string | number>;
  message?: string;
}
interface ZodLikeError {
  name?: string;
  errors?: ZodLikeIssue[];
  issues?: ZodLikeIssue[];
  message?: string;
}

/** Shape of a Supabase PostgrestError without depending on supabase-js types here. */
interface PostgrestLikeError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isZodLike(value: unknown): value is ZodLikeError {
  if (!isObject(value)) return false;
  if (value.name === 'ZodError') return true;
  return Array.isArray(value.errors) || Array.isArray(value.issues);
}

function isPostgrestLike(value: unknown): value is PostgrestLikeError {
  if (!isObject(value)) return false;
  // Postgrest errors carry at least one of these alongside `message`.
  return (
    typeof value.code === 'string' ||
    typeof value.details === 'string' ||
    typeof value.hint === 'string'
  );
}

function isNetworkError(value: unknown): value is Error {
  if (!(value instanceof Error)) return false;
  // fetch/TypeError network failures across browsers
  return (
    value.name === 'TypeError' &&
    /fetch|network|failed to fetch/i.test(value.message)
  );
}

/**
 * Normalize any thrown value into a `RegistrationError`.
 * Safe to call inside `catch (error: unknown)` blocks.
 */
export function toRegistrationError(
  error: unknown,
  fallback = 'Something went wrong',
): RegistrationError {
  if (typeof error === 'string') {
    return { kind: 'unknown', message: error, cause: error };
  }

  if (isZodLike(error)) {
    const rawIssues = error.issues ?? error.errors ?? [];
    const issues = rawIssues.map((i) => ({
      path: Array.isArray(i.path) ? i.path.join('.') : '',
      message: i.message ?? 'Invalid value',
    }));
    return {
      kind: 'validation',
      message: issues[0]?.message ?? error.message ?? fallback,
      issues,
      cause: error,
    };
  }

  if (isPostgrestLike(error)) {
    return {
      kind: 'database',
      message: error.message ?? fallback,
      code: error.code,
      details: error.details,
      hint: error.hint,
      cause: error,
    };
  }

  if (isNetworkError(error)) {
    return {
      kind: 'network',
      message: error.message || 'Network request failed',
      cause: error,
    };
  }

  if (error instanceof Error) {
    return { kind: 'unknown', message: error.message || fallback, cause: error };
  }

  if (isObject(error) && typeof error.message === 'string') {
    return { kind: 'unknown', message: error.message, cause: error };
  }

  return { kind: 'unknown', message: fallback, cause: error };
}

/**
 * Extracts a human-readable error message from unknown errors.
 * Backed by `toRegistrationError`, so it understands Zod validation errors,
 * Supabase Postgrest errors, network failures, and plain Error instances.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  return toRegistrationError(error, fallback).message;
}

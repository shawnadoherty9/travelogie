import { z } from 'zod';

// Maximum length constraints for text fields
const MAX_NAME_LENGTH = 100;
const MAX_BIO_LENGTH = 2000;
const MAX_TEXT_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_URL_LENGTH = 2048;

// Traveler registration schema
export const travelerFormSchema = z.object({
  firstName: z.string()
    .trim()
    .min(1, 'First name is required')
    .max(MAX_NAME_LENGTH, `First name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .trim()
    .min(1, 'Last name is required')
    .max(MAX_NAME_LENGTH, `Last name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  birthdate: z.string()
    .min(1, 'Birthdate is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 13 && age <= 120;
    }, 'You must be at least 13 years old'),
  
  homeCity: z.string()
    .trim()
    .max(MAX_TEXT_LENGTH, `Home city must be less than ${MAX_TEXT_LENGTH} characters`)
    .optional(),
  
  upcomingTravel: z.string()
    .trim()
    .max(MAX_DESCRIPTION_LENGTH, `Upcoming travel must be less than ${MAX_DESCRIPTION_LENGTH} characters`)
    .optional(),
  
  bio: z.string()
    .trim()
    .max(MAX_BIO_LENGTH, `Bio must be less than ${MAX_BIO_LENGTH} characters`)
    .optional(),
});

// Language validation
export const languageSchema = z.object({
  code: z.string()
    .trim()
    .min(2, 'Language code must be at least 2 characters')
    .max(10, 'Language code must be less than 10 characters')
    .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, 'Invalid language code format'),
  
  name: z.string()
    .trim()
    .min(1, 'Language name is required')
    .max(MAX_NAME_LENGTH, `Language name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s]+$/, 'Language name can only contain letters and spaces'),
  
  fluency: z.enum(['beginner', 'intermediate', 'advanced', 'native']),
});

// Custom interests validation
export const customInterestSchema = z.string()
  .trim()
  .min(1, 'Interest cannot be empty')
  .max(50, 'Interest must be less than 50 characters')
  .regex(/^[a-zA-Z0-9\s-]+$/, 'Interest can only contain letters, numbers, spaces, and hyphens');

// URL validation for social media
export const socialMediaUrlSchema = z.string()
  .trim()
  .max(MAX_URL_LENGTH, `URL must be less than ${MAX_URL_LENGTH} characters`)
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

// Auth form validation
export const authSignUpSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  
  firstName: z.string()
    .trim()
    .min(1, 'First name is required')
    .max(MAX_NAME_LENGTH, `First name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .trim()
    .min(1, 'Last name is required')
    .max(MAX_NAME_LENGTH, `Last name must be less than ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
});

export const authSignInSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  password: z.string()
    .min(1, 'Password is required'),
});

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
};

// Validate and sanitize text input
export const sanitizeTextInput = (input: string, maxLength: number = MAX_TEXT_LENGTH): string => {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove HTML brackets
};

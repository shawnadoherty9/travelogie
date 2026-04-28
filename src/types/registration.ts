/**
 * Shared, strongly-typed models for the registration flow.
 *
 * Centralizing these here lets every registration form expose the same
 * non-any callback signatures to its parents (e.g. props like
 * `onComplete: (data: TravelerFormData) => void`).
 */

/* -------------------------------------------------------------------------- */
/* User types                                                                 */
/* -------------------------------------------------------------------------- */

export type UserType =
  | 'traveler'
  | 'tour_operator'
  | 'language_teacher'
  | 'cultural_experience'
  | 'event_venue';

export const USER_TYPES: readonly UserType[] = [
  'traveler',
  'tour_operator',
  'language_teacher',
  'cultural_experience',
  'event_venue',
] as const;

export function isUserType(value: string): value is UserType {
  return (USER_TYPES as readonly string[]).includes(value);
}

/* -------------------------------------------------------------------------- */
/* Shared traveler-side primitives                                            */
/* -------------------------------------------------------------------------- */

export type FluencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';

export interface Language {
  code: string;
  name: string;
  fluency: FluencyLevel;
  isPrimary: boolean;
}

export interface SocialMedia {
  platform: string;
  username: string;
}

/* -------------------------------------------------------------------------- */
/* Offerings                                                                  */
/* -------------------------------------------------------------------------- */

export type TourType =
  | 'walking'
  | 'driving'
  | 'cycling'
  | 'boat'
  | 'cultural'
  | 'food'
  | 'adventure'
  | 'custom';

export interface TourOffering {
  title: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  type: TourType;
}

export interface LanguageOffering {
  language: string;
  skillLevels: string[];
  isOnline: boolean;
  isInPerson: boolean;
  pricePerHour: number;
  description: string;
}

export interface CulturalExperience {
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  maxParticipants: number;
  isOnline: boolean;
  isInPerson: boolean;
  skillLevel: string;
  materialsProvided: string;
}

export interface VenueSpace {
  name: string;
  description: string;
  capacity: number;
  amenities: string[];
  pricePerHour: number;
  pricePerDay: number;
  spaceType: string;
}

/* -------------------------------------------------------------------------- */
/* Form data shapes                                                           */
/* -------------------------------------------------------------------------- */

export interface BaseProfileFields {
  firstName: string;
  lastName: string;
  birthdate: string;
  homeCity: string;
  bio: string;
  profileImage: File | null;
}

export interface TravelerFormData extends BaseProfileFields {
  upcomingTravel: string;
  languages: Language[];
  interests: string[];
  customInterests: string[];
  socialMedia: SocialMedia[];
  dreamDestinations: string[];
}

export interface TourOperatorFormData extends BaseProfileFields {
  geographicAvailability: string;
  tours: TourOffering[];
}

export interface LanguageTeacherFormData extends BaseProfileFields {
  teachingExperience: string;
  certifications: string;
  offerings: LanguageOffering[];
}

export interface CulturalExperienceFormData extends BaseProfileFields {
  culturalBackground: string;
  experienceYears: string;
  experiences: CulturalExperience[];
}

export interface EventVenueFormData extends BaseProfileFields {
  venueName: string;
  venueAddress: string;
  venueDescription: string;
  businessLicense: string;
  insuranceDetails: string;
  spaces: VenueSpace[];
}

/* -------------------------------------------------------------------------- */
/* Component props                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Standard registration-form prop shape. Forms that need to notify a parent
 * (e.g. the wizard) can opt into these typed callbacks instead of relying on
 * implicit `any`.
 */
export interface RegistrationFormProps<TData> {
  onComplete?: (data: TData) => void;
  onCancel?: () => void;
}

export type TravelerFormProps = RegistrationFormProps<TravelerFormData>;
export type TourOperatorFormProps = RegistrationFormProps<TourOperatorFormData>;
export type LanguageTeacherFormProps = RegistrationFormProps<LanguageTeacherFormData>;
export type CulturalExperienceFormProps = RegistrationFormProps<CulturalExperienceFormData>;
export type EventVenueFormProps = RegistrationFormProps<EventVenueFormData>;

export interface UserTypeSelectionProps {
  onSelectType: (type: UserType) => void;
}

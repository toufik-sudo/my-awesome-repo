// -----------------------------------------------------------------------------
// Launch Wizard Zod Validation Schemas
// Ensures data integrity and security for all wizard form steps
// -----------------------------------------------------------------------------

import { z } from 'zod';
import {
  QUICK,
  FULL,
  FREEMIUM,
  CHALLENGE,
  STANDARD,
  FREQUENCY_TYPE,
  PROGRAM_CONFIDENTIALITY_OPEN,
  PROGRAM_CONFIDENTIALITY_CLOSED,
} from '@/constants/wall/launch';

// -----------------------------------------------------------------------------
// Utility Schemas
// -----------------------------------------------------------------------------

/** Safe string that trims whitespace and validates length */
const safeString = (minLength = 1, maxLength = 255) =>
  z
    .string()
    .trim()
    .min(minLength, { message: `Must be at least ${minLength} characters` })
    .max(maxLength, { message: `Must be less than ${maxLength} characters` });

/** Optional safe string */
const optionalSafeString = (maxLength = 255) =>
  z
    .string()
    .trim()
    .max(maxLength, { message: `Must be less than ${maxLength} characters` })
    .optional()
    .or(z.literal(''));

/** URL validation with length limits */
const safeUrl = z
  .string()
  .trim()
  .max(500, { message: 'URL must be less than 500 characters' })
  .refine(
    (val) => {
      if (!val) return true; // Allow empty
      try {
        new URL(val.startsWith('http') ? val : `https://${val}`);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL format' }
  )
  .optional()
  .or(z.literal(''));

/** Custom URL slug validation (alphanumeric, hyphens, underscores only) */
const safeSlug = z
  .string()
  .trim()
  .max(100, { message: 'Custom URL must be less than 100 characters' })
  .regex(/^[a-zA-Z0-9-_]*$/, {
    message: 'Only letters, numbers, hyphens, and underscores allowed',
  })
  .optional()
  .or(z.literal(''));

/** Positive number validation */
const positiveNumber = z
  .number()
  .min(0, { message: 'Must be a positive number' })
  .max(999999999, { message: 'Value is too large' });

/** Percentage validation (0-100) */
const percentageNumber = z
  .number()
  .min(0, { message: 'Percentage must be at least 0' })
  .max(100, { message: 'Percentage cannot exceed 100' });

/** Hex color validation */
const hexColor = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Must be a valid hex color (e.g., #2563eb)',
  });

// -----------------------------------------------------------------------------
// Step 1: Program Type Schema
// -----------------------------------------------------------------------------

export const programTypeSchema = z.object({
  type: z.enum([QUICK, FULL, FREEMIUM, CHALLENGE, STANDARD], {
    required_error: 'Please select a program type',
    invalid_type_error: 'Invalid program type selected',
  }),
  programJourney: z.enum([QUICK, FULL], {
    required_error: 'Please select a journey type',
    invalid_type_error: 'Invalid journey type',
  }),
});

export type ProgramTypeFormData = z.infer<typeof programTypeSchema>;

// -----------------------------------------------------------------------------
// Step 2: Platform Selection Schema
// -----------------------------------------------------------------------------

export const platformSelectionSchema = z.object({
  platform: z.object(
    {
      id: z.number().positive({ message: 'Invalid platform ID' }),
      name: safeString(1, 255),
    },
    {
      required_error: 'Please select a platform',
      invalid_type_error: 'Invalid platform selection',
    }
  ),
});

export type PlatformSelectionFormData = z.infer<typeof platformSelectionSchema>;

// -----------------------------------------------------------------------------
// Step 3: Program Details Schema
// -----------------------------------------------------------------------------

export const programDetailsSchema = z
  .object({
    programName: safeString(2, 100).refine(
      (val) => !/[<>{}[\]\\\/]/.test(val),
      { message: 'Program name contains invalid characters' }
    ),
    extendUrl: safeSlug,
    duration: z.object({
      start: z.date({ required_error: 'Start date is required' }),
      end: z.date().optional().nullable(),
    }),
  })
  .refine(
    (data) => {
      if (data.duration.end && data.duration.start) {
        return data.duration.end > data.duration.start;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['duration', 'end'],
    }
  );

export type ProgramDetailsFormData = z.infer<typeof programDetailsSchema>;

// -----------------------------------------------------------------------------
// Step 4: Confidentiality Schema
// -----------------------------------------------------------------------------

export const confidentialitySchema = z.object({
  confidentiality: z.enum(
    [PROGRAM_CONFIDENTIALITY_OPEN, PROGRAM_CONFIDENTIALITY_CLOSED],
    {
      required_error: 'Please select confidentiality setting',
    }
  ),
  manualValidation: z.boolean().default(false),
  emailNotify: z.boolean().default(false),
  acceptedEmailInvitation: z.boolean().default(false),
});

export type ConfidentialityFormData = z.infer<typeof confidentialitySchema>;

// -----------------------------------------------------------------------------
// Step 5: Users Invitation Schema
// -----------------------------------------------------------------------------

const invitedFieldSchema = z.enum([
  'firstName',
  'lastName',
  'email',
  'phone',
  'department',
  'position',
  'employeeId',
  'region',
  'team',
  'manager',
]);

export const usersInvitationSchema = z.object({
  invitedUsersFields: z
    .array(invitedFieldSchema)
    .min(1, { message: 'At least one field is required' })
    .refine((fields) => fields.includes('email'), {
      message: 'Email field is required',
    }),
  invitedUserData: z
    .object({
      invitedUsersFile: z
        .string()
        .max(255, { message: 'Filename too long' })
        .optional(),
      fileName: z
        .string()
        .max(255, { message: 'Filename too long' })
        .optional(),
    })
    .optional()
    .nullable(),
});

export type UsersInvitationFormData = z.infer<typeof usersInvitationSchema>;

// -----------------------------------------------------------------------------
// Step 6: Results Configuration Schema
// -----------------------------------------------------------------------------

const resultsFieldSchema = z.enum([
  'dateOfEvent',
  'quantity',
  'description',
  'amount',
  'location',
  'reference',
  'productName',
  'customerName',
]);

export const resultsConfigSchema = z
  .object({
    resultChannel: z.object({
      declarationForm: z.boolean().default(true),
      fileImport: z.boolean().default(false),
    }),
    resultsManualValidation: z.boolean().default(false),
    resultsEmailNotify: z.boolean().default(false),
    resultsUsersFields: z.array(resultsFieldSchema).optional(),
  })
  .refine(
    (data) =>
      data.resultChannel.declarationForm || data.resultChannel.fileImport,
    {
      message: 'At least one result channel must be enabled',
      path: ['resultChannel'],
    }
  );

export type ResultsConfigFormData = z.infer<typeof resultsConfigSchema>;

// -----------------------------------------------------------------------------
// Step 7: Rewards Configuration Schema
// -----------------------------------------------------------------------------

const allocationTypeSchema = z.enum(['fixed', 'variable', 'tiered']);
const frequencyTypeSchema = z.enum(['one-time', 'weekly', 'monthly', 'quarterly', 'yearly']);
const spendTypeSchema = z.enum(['points', 'currency', 'gifts']);
const validityPeriodSchema = z.enum(['3m', '6m', '1y', '2y', 'never']);

export const rewardsConfigSchema = z
  .object({
    allocationType: allocationTypeSchema.default('fixed'),
    frequency: frequencyTypeSchema.default('monthly'),
    spendType: spendTypeSchema.default('points'),
    minAllocation: positiveNumber.default(0),
    maxAllocation: positiveNumber.default(1000),
    fixedValue: positiveNumber.optional(),
    rewardManagers: z.boolean().default(false),
    managerPercentage: percentageNumber.default(10),
    validityPeriod: validityPeriodSchema.default('1y'),
    autoRollover: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.allocationType === 'variable') {
        return data.minAllocation <= data.maxAllocation;
      }
      return true;
    },
    {
      message: 'Minimum allocation cannot exceed maximum allocation',
      path: ['minAllocation'],
    }
  );

export type RewardsConfigFormData = z.infer<typeof rewardsConfigSchema>;

// -----------------------------------------------------------------------------
// Step 8: Products Schema
// -----------------------------------------------------------------------------

const productSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: safeString(1, 255),
  price: positiveNumber.optional(),
  category: z.string().optional(),
  image: safeUrl.optional(),
});

const categorySchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: safeString(1, 255),
  productCount: z.number().optional(),
});

export const productsSchema = z.object({
  products: z.array(productSchema).optional().default([]),
  categories: z.array(categorySchema).optional().default([]),
});

export type ProductsFormData = z.infer<typeof productsSchema>;

// -----------------------------------------------------------------------------
// Step 9: Design Configuration Schema
// -----------------------------------------------------------------------------

const fontFamilySchema = z.enum([
  'inter',
  'roboto',
  'opensans',
  'lato',
  'poppins',
  'montserrat',
  'raleway',
  'playfair',
]);

const backgroundStyleSchema = z.enum([
  'solid',
  'gradient',
  'pattern',
  'image',
]);

export const designConfigSchema = z.object({
  companyName: safeString(1, 100).refine(
    (val) => !/[<>{}[\]\\\/]/.test(val),
    { message: 'Company name contains invalid characters' }
  ),
  logo: safeUrl.nullable(),
  primaryColor: hexColor.default('#2563eb'),
  secondaryColor: hexColor.default('#1e40af'),
  accentColor: hexColor.default('#3b82f6'),
  fontFamily: fontFamilySchema.default('inter'),
  backgroundStyle: backgroundStyleSchema.default('solid'),
});

export type DesignConfigFormData = z.infer<typeof designConfigSchema>;

// -----------------------------------------------------------------------------
// Step 10: Goal Allocation (Cube) Schema
// -----------------------------------------------------------------------------

const goalBracketSchema = z.object({
  id: z.string(),
  from: z
    .union([z.string(), z.number()])
    .transform((val) => String(val)),
  to: z
    .union([z.string(), z.number()])
    .transform((val) => String(val)),
  value: z
    .union([z.string(), z.number()])
    .transform((val) => String(val)),
  errors: z.record(z.string(), z.string()).optional().default({}),
});

const goalMainSchema = z.object({
  min: z
    .union([z.string(), z.number()])
    .transform((val) => String(val)),
  max: z
    .union([z.string(), z.number()])
    .transform((val) => String(val)),
  value: z
    .union([z.string(), z.number()])
    .transform((val) => String(val)),
});

const goalValidatedSchema = z.object({
  measurementType: z.boolean().default(false),
  allocationType: z.boolean().default(false),
  main: z.boolean().default(false),
});

const goalSchema = z.object({
  id: z.string(),
  measurementType: z.number().nullable(),
  measurementName: z.string().max(255).nullable(),
  allocationType: z.string().max(50).nullable(),
  allocationCategory: z.string().max(100).nullable(),
  specificProducts: z.boolean().default(false),
  productIds: z.array(z.string()).default([]),
  main: goalMainSchema,
  brackets: z.array(goalBracketSchema).default([]),
  validated: goalValidatedSchema,
});

const frequencyAllocationSchema = z.nativeEnum(FREQUENCY_TYPE);

export const cubeConfigSchema = z.object({
  goals: z
    .array(goalSchema)
    .min(1, { message: 'At least one goal is required' })
    .max(10, { message: 'Maximum 10 goals allowed' }),
  correlatedGoals: z.boolean().default(false),
  frequencyAllocation: frequencyAllocationSchema.default(FREQUENCY_TYPE.MONTHLY),
  spendType: z.string().default('points'),
  rewardPeopleManagers: z.boolean().default(false),
  managerPercentage: percentageNumber.default(10),
  validityPoints: positiveNumber.optional(),
});

export type CubeConfigFormData = z.infer<typeof cubeConfigSchema>;

// -----------------------------------------------------------------------------
// Step 11: E-Card Selection Schema
// -----------------------------------------------------------------------------

export const eCardSelectionSchema = z.object({
  selectedEcards: z
    .array(z.string().max(100))
    .max(50, { message: 'Maximum 50 e-cards can be selected' })
    .default([]),
});

export type ECardSelectionFormData = z.infer<typeof eCardSelectionSchema>;

// -----------------------------------------------------------------------------
// Complete Launch Data Schema
// Combines all step schemas for final validation before launch
// -----------------------------------------------------------------------------

export const completeLaunchDataSchema = z.object({
  // Program Type
  type: z.string(),
  programJourney: z.enum([QUICK, FULL]),

  // Platform
  platform: platformSelectionSchema.shape.platform.optional(),

  // Program Details
  programName: safeString(2, 100),
  extendUrl: safeSlug,
  duration: z.object({
    start: z.date(),
    end: z.date().optional().nullable(),
  }).optional(),

  // Confidentiality
  confidentiality: z.string().optional(),
  manualValidation: z.boolean().optional(),
  emailNotify: z.boolean().optional(),
  acceptedEmailInvitation: z.boolean().optional(),

  // Users
  invitedUsersFields: z.array(z.string()).optional(),
  invitedUserData: z.any().optional(),

  // Results
  resultChannel: z.object({
    declarationForm: z.boolean(),
    fileImport: z.boolean(),
  }).optional(),
  resultsManualValidation: z.boolean().optional(),
  resultsEmailNotify: z.boolean().optional(),
  resultsUsersFields: z.array(z.string()).optional(),

  // Rewards
  allocationType: z.string().optional(),
  frequency: z.string().optional(),
  spendType: z.string().optional(),
  minAllocation: z.number().optional(),
  maxAllocation: z.number().optional(),
  fixedValue: z.number().optional(),
  rewardManagers: z.boolean().optional(),
  managerPercentage: z.number().optional(),
  validityPeriod: z.string().optional(),
  autoRollover: z.boolean().optional(),

  // Products
  products: z.array(productSchema).optional(),
  categories: z.array(categorySchema).optional(),

  // Design
  companyName: z.string().optional(),
  logo: z.string().nullable().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  fontFamily: z.string().optional(),
  backgroundStyle: z.string().optional(),

  // Cube/Goals
  cube: cubeConfigSchema.optional(),

  // E-Cards
  selectedEcards: z.array(z.string()).optional(),
});

export type CompleteLaunchData = z.infer<typeof completeLaunchDataSchema>;

// -----------------------------------------------------------------------------
// Schema Map for Easy Access
// -----------------------------------------------------------------------------

export const launchWizardSchemas = {
  programType: programTypeSchema,
  platformSelection: platformSelectionSchema,
  programDetails: programDetailsSchema,
  confidentiality: confidentialitySchema,
  usersInvitation: usersInvitationSchema,
  resultsConfig: resultsConfigSchema,
  rewardsConfig: rewardsConfigSchema,
  products: productsSchema,
  designConfig: designConfigSchema,
  cubeConfig: cubeConfigSchema,
  eCardSelection: eCardSelectionSchema,
  complete: completeLaunchDataSchema,
} as const;

export type LaunchWizardSchemaKey = keyof typeof launchWizardSchemas;

import { z } from 'zod';

    export const createOccasionSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email format').min(1, 'Email is required'),
    });

    export const updateOccasionSchema = z.object({
      name: z.string().min(1, 'Name is required').optional(),
      email: z.string().email('Invalid email format').optional(),
    });

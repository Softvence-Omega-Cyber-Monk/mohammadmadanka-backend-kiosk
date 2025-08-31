import { z } from 'zod';

    export const createStickerSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email format').min(1, 'Email is required'),
    });

    export const updateStickerSchema = z.object({
      name: z.string().min(1, 'Name is required').optional(),
      email: z.string().email('Invalid email format').optional(),
    });

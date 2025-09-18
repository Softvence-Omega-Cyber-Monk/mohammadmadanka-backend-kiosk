import { z } from 'zod';

export const logInValidator = z.object({
  body: z.object({
    shopId: z.string(),
    password: z.string().optional(),
  }),
});


export const weblogInValidator = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().optional(),
  }),
});
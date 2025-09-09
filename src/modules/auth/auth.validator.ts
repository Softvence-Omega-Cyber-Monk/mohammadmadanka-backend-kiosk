import { z } from 'zod';

export const logInValidator = z.object({
  body: z.object({
    shopId: z.string(),
    password: z.string().optional(),
  }),
});

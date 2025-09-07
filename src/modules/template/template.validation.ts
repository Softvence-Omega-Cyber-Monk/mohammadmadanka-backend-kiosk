// import { z } from 'zod';

// const holeSchema = z.object({
//   x: z.number(),
//   y: z.number(),
//   height: z.number(),
//   width: z.number(),
// });

// const photoHoleSchema = holeSchema.extend({
//   placeholderLink: z.string().url(),
// });

// const textHoleSchema = holeSchema.extend({
//   placeholderText: z.string(),
// });

// const holesInfoSchema = z.object({
//   photoHoles: z.array(photoHoleSchema),
//   textHoles: z.array(textHoleSchema),
// });

// // export const createTemplateSchema = z.object({
// //   name: z.string().min(1),
// //   SKU: z.string().min(1),
// //   link: z.string().url(),
// //   category: z.string(),
// //   createdBy: z.string(), // Mongo ID
// //   price: z.number(),
// //   holesInfo: z.array(holesInfoSchema),
// // });

// export const updateTemplateSchema = createTemplateSchema.partial();

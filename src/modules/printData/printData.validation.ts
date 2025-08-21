
import { z } from "zod";

export const createPrintDataSchema = z.object({
  templateId: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

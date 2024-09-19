import { z } from "zod";

export const rateFormSchema = z.object({
    image: z.instanceof(File),
});

export type RateFormSchema = typeof rateFormSchema;

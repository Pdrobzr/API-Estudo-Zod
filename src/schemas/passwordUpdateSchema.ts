import { z } from "zod";

export const passwordUpdateSchema = z.object({
    senhaAntiga: z.string().min(8),
    senha: z.string().min(8)
});
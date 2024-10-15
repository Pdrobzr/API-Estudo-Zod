import { z } from "zod";

export const userRegistrationSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha: z.string().min(8)
});


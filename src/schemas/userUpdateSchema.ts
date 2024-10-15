import { z } from "zod";

export const userUpdateSchema = z.object({
    nome: z.string(),
    email: z.string().email()
})
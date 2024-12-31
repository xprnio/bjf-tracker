import { z } from "zod";
import "dotenv/config";

const EnvironmentSchema = z.object({
    HOME: z.string(),
    NODE_ENV: z
        .enum(["development", "production"])
        .optional()
        .default("development"),
    CMC_API_KEY: z.string(),
});

export const env = EnvironmentSchema.parse(process.env);

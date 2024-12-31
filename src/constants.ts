import fs from "node:fs/promises";
import path from "node:path";

import { env } from "@src/env";

export const constants = {
    CMC_API_URL: "https://pro-api.coinmarketcap.com",

    DATA_DIR: path.join(env.HOME, ".local/share/bjf-tracker"),
} as const;

export async function dataDir() {
    if (await fs.exists(constants.DATA_DIR)) {
        const stat = await fs.lstat(constants.DATA_DIR);
        if (!stat.isDirectory()) {
            throw new Error(`Expected ${constants.DATA_DIR} to be a directory`);
        }
        return constants.DATA_DIR;
    }

    await fs.mkdir(constants.DATA_DIR, { recursive: true });
    return constants.DATA_DIR;
}

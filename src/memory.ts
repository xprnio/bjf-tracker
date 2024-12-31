import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { dataDir } from "@src/constants";

const AssetSchema = z.object({
    timestamp: z.date({ coerce: true }),
    previous: z.number({ coerce: true }),
    value: z.number({ coerce: true }),
});

export type Memory = Awaited<ReturnType<typeof memory>>;

export async function memory() {
    const [assets, ledger] = await loadAssets();

    return {
        getPreviousValue() {
            if (assets.length > 1) {
                const previous = assets[assets.length - 2];
                return previous.value;
            }

            return -1;
        },
        getCurrentValue() {
            if (assets.length > 0) {
                const last = assets[assets.length - 1];
                return last.value;
            }

            return -1;
        },
        getLastChange() {
            const previous = this.getPreviousValue();
            const current = this.getCurrentValue();

            return current - previous;
        },
        async setAssetValue(value: number) {
            const asset = { timestamp: new Date(), previous: -1, value };
            if (assets.length > 0) {
                const previous = assets[assets.length - 1];
                asset.previous = previous.value;
            }

            assets.push(asset);

            const record = toRecord(asset);
            const row = record.map((col) => '"' + col + '"').join(",");
            await fs.appendFile(ledger, row + "\n");
        },
    };
}

async function loadAssets() {
    const dir = await dataDir();
    const ledger = path.join(dir, "assets.csv");
    const assets: z.infer<typeof AssetSchema>[] = [];

    if (await fs.exists(ledger)) {
        const contents = await fs.readFile(ledger, "utf-8");
        const rows = contents.split("\n");
        for (let row of rows) {
            const record = row
                .trim()
                .split(",")
                .filter(Boolean)
                .map((row) => {
                    if (row.startsWith('"')) {
                        row = row.substring(1);
                    }
                    if (row.endsWith('"')) {
                        row = row.substring(0, row.length - 1);
                    }

                    return row;
                });

            if (record.length > 0) {
                const asset = fromRecord(record);
                assets.push(asset);
            }
        }
    }

    return [assets, ledger] as const;
}

const NUM_RECORD_COLS = 3;
const RecordSchema = z.array(z.string()).transform((record, ctx) => {
    if (record.length !== NUM_RECORD_COLS) {
        ctx.addIssue({
            code: "custom",
            message: "Invalid number of columns in Record",
        });
        return z.NEVER;
    }

    const [timestamp, previous, value] = record;
    return AssetSchema.parse({ timestamp, previous, value });
});

function fromRecord(record: string[]) {
    return RecordSchema.parse(record);
}

function toRecord(asset: z.infer<typeof AssetSchema>) {
    return [
        asset.timestamp.toISOString(),
        String(asset.previous),
        String(asset.value),
    ] as const;
}

import Bun from "bun";
import path from "node:path";

import trendingUp from "../assets/trending-up.png" with { type: "file" };
import trendingDown from "../assets/trending-down.png" with { type: "file" };

import { dataDir } from "@src/constants";

export async function iconsDir() {
    const data = await dataDir();
    return path.join(data, "icons");
}

export async function icons() {
    const icons = new Map([
        ["trending-up", Bun.file(trendingUp)],
        ["trending-down", Bun.file(trendingDown)],
    ]);

    const result = new Map<string, string>();
    for (const [name, file] of icons) {
        const filepath = await exportIcon(name, file);
        result.set(name, filepath);
    }
    return result;
}

async function exportIcon(name: string, input: Bun.BunFile) {
    const icons = await iconsDir();
    const filepath = path.join(icons, `${name}.png`);
    const output = Bun.file(filepath);
    await Bun.write(output, input);
    return filepath;
}

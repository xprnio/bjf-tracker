import { stdin } from "bun";
import { env } from "@src/env";

main().catch(console.error);
async function main() {
    let content = await stdin.text();
    for (const v of variables(content)) {
        console.log("replacing", v, "with", resolve(v));
        content = content.replaceAll(v, resolve(v));
    }

    process.stdout.write(content);
}

function resolve(v: string) {
    if (v.startsWith("$")) v = v.substring(1);

    return v in env ? env[v as keyof typeof env] : v;
}

function variables(input: string) {
    const rx = /\$[a-z_]*/gi;
    const results = input.match(rx);
    if (results === null) return [];

    const resultSet = new Set(results);
    return [...resultSet];
}

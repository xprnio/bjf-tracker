import { $ } from "bun";

export interface NotifyOptions {
    icon?: string;
    title: string;
    message: string;
}

export async function notify(opts: NotifyOptions) {
    const args = [`--app-name=bjf-tracker`, `--expire-time=${10_000}`];
    if (opts.icon) args.push(`--icon=${opts.icon}`);
    await $`notify-send ${args} ${opts.title} ${opts.message}`;
}

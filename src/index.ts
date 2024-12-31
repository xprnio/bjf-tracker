import { type Memory, memory } from "@src/memory";
import { notify } from "@src/notify";
import { icons } from "@src/icons";
import { api } from "@src/api";

main().catch(console.error);
async function main() {
    const mem = await memory();
    const ico = await icons();

    await update(mem);

    const change = +mem.getLastChange().toFixed(2);
    const value = +mem.getCurrentValue().toFixed(2);

    const options = {
        icon: ico.get("trending-up"),
        title: "No price movement",
        message: `Your assets are currently worth ${value} EUR`,
    };

    if (change < 0) {
        options.icon = ico.get("trending-down");
        options.title = `Your assets are down by ${change} EUR`;
    }

    if (change > 0) {
        options.title = `Your assets are up by ${change} EUR`;
    }

    await notify(options);
}

async function update(mem: Memory) {
    const result = await api.priceConversion({
        id: "34643", // BJF Token ID
        amount: 5_000_000, // 5,000,000 BJF tokens
        convert: "EUR", // convert them to EUR
    });

    for (const key in result.data.quote) {
        if (key !== "EUR") continue;

        const { price } = result.data.quote[key];
        await mem.setAssetValue(price);
        return;
    }

    throw new Error("EUR conversion quote was not found");
}

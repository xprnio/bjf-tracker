import { z } from "zod";

import { constants } from "@src/constants";
import { ApiError, apiHeaders } from "./common";

export interface PriceConversionOptions {
    id: string;
    amount: number;
    convert: string;
}

const PriceConversionResponse = z.object({
    data: z.object({
        symbol: z.string(),
        id: z.union([z.number(), z.string()]),
        name: z.string(),
        amount: z.number(),
        last_updated: z.string(),
        quote: z.record(
            z.string(),
            z.object({
                price: z.number(),
                last_updated: z.string(),
            }),
        ),
    }),
    status: z.object({
        timestamp: z.string(),
        error_code: z.number(),
        error_message: z.string().nullable(),
        elapsed: z.number(),
        credit_count: z.number(),
        notice: z.string().nullable(),
    }),
});

export async function priceConversion(opts: PriceConversionOptions) {
    const url = priceConversionUrl(opts);
    const res = await fetch(url, { headers: apiHeaders() });

    if (res.ok) {
        const json = await res.json();
        return PriceConversionResponse.parse(json);
    }

    throw new ApiError(res, await res.json());
}

function priceConversionUrl(opts: PriceConversionOptions) {
    const query = new URLSearchParams();
    query.set("id", opts.id);
    query.set("amount", String(opts.amount));
    query.set("convert", opts.convert);

    const url = new URL(constants.CMC_API_URL);
    url.pathname = "v2/tools/price-conversion";
    url.search = query.toString();

    return url;
}

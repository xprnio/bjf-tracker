import { env } from "@src/env";

export class ApiError extends Error {
    constructor(
        public readonly response: Response,
        public readonly data: any,
    ) {
        super(
            `ApiError[${response.status}]: ${ApiError.stringify(response.status, data)}`,
        );
    }

    static stringify(status: number, data: any) {
        return JSON.stringify({ status, data }, null, 2);
    }
}

export function apiHeaders(init?: HeadersInit) {
    const headers = new Headers(init);
    headers.set("X-CMC_PRO_API_KEY", env.CMC_API_KEY);
    return headers;
}

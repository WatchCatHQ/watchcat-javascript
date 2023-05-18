import {Level, StackTrace, WatchCatAppHeader, WatchCatClient, WatchCatOptions} from "./types";
import {RateLimitedClient} from "./rate_limited_client";
import {createPayload} from "./payload";
import {parseStackTrace} from "./stack_trace";

class WatchCatCoreClient implements WatchCatClient {
    protected options: WatchCatOptions
    protected client: RateLimitedClient

    protected meta: object = {}

    constructor(options: Partial<WatchCatOptions>) {
        const defaultOptions: WatchCatOptions = {
            url: "https://api.watchcat.io/api/event.in",
            env: "development",
            token: "",
            debug: false
        }
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.client = new RateLimitedClient()

        if (options.debug) {
            console.log(`WatchCat initialized, env=${this.options.env}, url=${this.options.url}`)
        }
    }

    exception(e: Error) {
        if (this.options.debug) console.error(e)
        this.sendEvent('error', e.message, parseStackTrace(e?.stack))
    }

    error(message: string) {
        if (this.options.debug) console.error(message)
        this.sendEvent('error', message, this.createStackTrace())
    }

    warn(message: string) {
        if (this.options.debug) console.warn(message)
        this.sendEvent('warn', message, this.createStackTrace())
    }

    withMeta(params: object) {
        this.meta = {...this.meta, ...params}
        return this
    }

    private clear() {
        this.meta = {}
    }

    private sendEvent(level: Level, message: string, stacktrace: StackTrace) {
        const payload = createPayload(
            this.options.env,
            level,
            message,
            "",
            this.meta,
            stacktrace
        )
        if (this.options.debug) console.log({watchcat_payload: payload})

        const options: RequestInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                [WatchCatAppHeader]: this.options.token
            },
            body: JSON.stringify(payload)
        }
        this.client.fetch(this.options.url, options).then((response: Response) => {
            if (!response.ok) {
                response.json().then(err => console.error({err}))
            }
        })
        this.clear()
    }

    private createStackTrace() {
        const stack = new Error().stack || "";
        return parseStackTrace(stack);
    }
}

export {
    WatchCatCoreClient,
    WatchCatOptions,
    WatchCatClient,
    Level
}

import {
    WatchCatServerClient,
    WatchCatOptions,
    WatchCatServerOptions,
    WatchCatClient,
    WatchCatPackageNames,
    WatchCatAppHeader,
    Monitors,
    MonitorInterval,
    Level,
    StackTrace,
    StackFrame
} from "./types";
import {createPayload} from "./payload";
import {parseStackTrace} from "./stack_trace";
import {Client} from "./client";

class WatchCatCoreClient implements WatchCatClient {
    protected options: WatchCatOptions
    protected client: Client

    protected meta: object = {}

    constructor(options: Partial<WatchCatOptions>) {
        const defaultOptions: WatchCatOptions = {
            url: "https://api.watchcat.io/api/event.in",
            env: "development",
            token: "",
            debug: false,
            meta: {}
        }
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.client = new Client(this.options.token, this.options.url)

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
        this.meta = {...this.options.meta, ...this.meta, ...params}
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
            this.meta,
            stacktrace
        )
        if (this.options.debug) console.log({watchcat_payload: payload})

        this.client.sendEvent(payload)
        this.clear()
    }

    private createStackTrace() {
        const stack = new Error().stack || "";
        return parseStackTrace(stack);
    }
}

export {
    WatchCatCoreClient,
    WatchCatServerClient,
    WatchCatOptions,
    WatchCatServerOptions,
    WatchCatClient,
    WatchCatPackageNames,
    WatchCatAppHeader,
    Monitors,
    MonitorInterval,
    Level,
    StackTrace,
    StackFrame,
    createPayload,
    Client
}

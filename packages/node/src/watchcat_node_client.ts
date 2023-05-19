import {Level, StackTrace, WatchCatAppHeader, WatchCatServerClient} from "@watchcathq/core";
import {parseStackTrace} from "./stack_trace";
import SourceMaps from "./source_maps";
import axios, {AxiosRequestConfig} from "axios";
import axiosRetry from "axios-retry";
import {createPayload, WatchCatServerOptions} from "@watchcathq/core";

export class WatchCatNodeClient implements WatchCatServerClient {
    private options: WatchCatServerOptions
    private readonly sourceMaps: SourceMaps

    private meta: object = {}
    private stackLevelsToOmit = 0

    // prevent sending error message twice
    private lastGlobalErrorMessage: string = ''

    constructor(options: Partial<WatchCatServerOptions>) {
        const defaultOptions: WatchCatServerOptions = {
            url: "https://api.watchcat.io",
            env: process.env.NODE_ENV || "development",
            token: "",
            debug: false,
            monitors: null,
            fullMonitorSync: false,
            meta: {}
        }
        this.options = {
            ...defaultOptions,
            ...options
        };
        this.sourceMaps = new SourceMaps()
        this.meta = this.options.meta

        axiosRetry(axios, {
            retries: 3
        })

        if (options.debug) {
            console.log(`WatchCat 🐈 Initialized (env=${this.options.env}, url=${this.options.url})`)
        }

        if (this.options.monitors !== null) {
            this.syncMonitors().then(_ => {
                if (options.debug) {
                    console.log(`WatchCat 🐈 Monitors synchronization finished`)
                }
            })
        }
    }

    exception(e: Error) {
        if (this.options.debug) console.error(e)
        parseStackTrace(this.sourceMaps, e?.stack, this.stackLevelsToOmit)
            .then(stacktrace => this.sendEvent('error', e.message, stacktrace))
    }

    error(message: string) {
        if (this.options.debug) console.error(message)
        this.createStackTrace().then(stacktrace => this.sendEvent('error', message, stacktrace))
    }

    warn(message: string) {
        if (this.options.debug) console.warn(message)
        this.createStackTrace().then(stacktrace => this.sendEvent('warn', message, stacktrace))
    }

    withMeta(params: object) {
        this.meta = {...this.options.meta, ...this.meta, ...params}
        return this
    }

    omitStackLevels(levels: number = 0) {
        this.stackLevelsToOmit = levels
        return this
    }

    setGlobalErrorHandlerMessage(message: string) {
        this.lastGlobalErrorMessage = message
    }

    isGlobalErrorHandlerMessage(message: string): boolean {
        return this.lastGlobalErrorMessage === message
    }

    createOnUncaughtExceptionHandler() {
        return (e: Error) => {
            if (this.options.debug) console.error(e)
            this
                .withMeta({
                    errorSource: 'Process.UncaughtExceptionHandler'
                })
                .exception(e)
        }
    }

    createOnUnhandledRejectionHandler() {
        return (reason: {} | null | undefined, promise: Promise<any>) => {
            if (this.options.debug) console.error(reason)
            if (reason instanceof Error) {
                this
                    .withMeta({
                        errorSource: 'Process.UncaughtExceptionHandler',
                        reason,
                        promise
                    })
                    .withMeta(reason)
            } else {
                this
                    .withMeta({
                        errorSource: 'Process.UncaughtExceptionHandler',
                        reason,
                        promise
                    })
                    .error('UnhandledRejection')
            }
        }
    }

    private clear() {
        this.meta = this.options.meta
        this.lastGlobalErrorMessage = ''
        this.stackLevelsToOmit = 0
    }

    private async sendEvent(level: Level, message: string, stacktrace: StackTrace) {
        const payload = createPayload(
            this.options.env,
            level,
            message,
            this.meta,
            stacktrace
        )
        this.clear()

        await this.callApi('/api/event.in', payload)
    }

    private createStackTrace() {
        const stack = new Error().stack || "";
        return parseStackTrace(this.sourceMaps, stack, this.stackLevelsToOmit);
    }

    private async syncMonitors() {
        const payload = {
            monitors: this.options.monitors,
            fullMonitorSync: this.options.fullMonitorSync
        }
        await this.callApi('/api/monitors.sync', payload)
    }

    private async callApi(uri: string, payload: any) {
        const options: AxiosRequestConfig = {
            method: 'POST',
            headers: {
                'Accept': 'meta/json',
                'Content-Type': 'application/json',
                [WatchCatAppHeader]: this.options.token
            },
        }
        try {
            await axios.post(this.options.url + uri, payload, options)
        } catch (error: any) {
            if (error?.response) {
                const status = error.response?.status;
                const statusText = error.response?.statusText;
                const message = error.response?.data?.message;
                console.error(`WatchCat request failed with status ${status} ${statusText}: ${message}`);
            } else if (error?.request) {
                console.error('WatchCat request failed: no response received');
            } else {
                console.error(`WatchCat request failed: ${error?.message}`);
            }
        }
    }
}

export const WatchCatPackageNames: string[] = [
    "@watchcathq",
    "watchcat.mjs",
    "watchcat.js",
    "watchcat.umd.js"
]

export const API_BASE_URL = "https://api.watchcat.io"

export interface WatchCatClient {
    exception: (e: Error) => void
    error: (message: string) => void
    warn: (message: string) => void
    withMeta: (params: object) => WatchCatClient
}

export interface WatchCatServerClient extends WatchCatClient{
    omitStackLevels: (levels: number) => WatchCatClient
    createOnUncaughtExceptionHandler: () => ((e: Error) => any)
    createOnUnhandledRejectionHandler: () => ((reason: {} | null | undefined, promise: Promise<any>) => any)
}

export interface WatchCatOptions {
    env: string,
    token: string,
    url: string,
    debug: boolean,
    meta: {}
}

export interface WatchCatServerOptions extends WatchCatOptions {
    monitors: Monitors[] | null
    fullMonitorSync: boolean
}

export interface Monitors {
    url: string
    httpCodes?: string
    phrase?: string
    interval?: MonitorInterval
}

export const WatchCatAppHeader = 'x-watchcat-app-token'

export type MonitorInterval = "30s" | "1m" | "5m" | "30m" | "1h" | undefined
export type Level = 'error' | 'warn' | 'critical' | 'fatal'
export type StackTrace = Array<StackFrame>

export interface Payload {
    env: string
    level: Level
    message: string
    meta: object
    stacktrace: StackTrace,
    timestamp: number
}

export interface StackFrame {
    functionName: string
    fileName: string
    lineNumber: number
    columnNumber: number
    sourceLines: Array<string>
}

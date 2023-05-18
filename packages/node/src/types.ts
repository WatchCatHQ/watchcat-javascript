export const WatchCatPackageNames: string[] = [
    "@watchcat"
]

export interface WatchCatClient {
    exception: (e: Error) => void
    error: (message: string) => void
    warn: (message: string) => void
    withMeta: (params: object) => WatchCatClient
    omitStackLevels: (levels: number) => WatchCatClient
    setGlobalErrorHandlerMessage: (message: string) => void
    isGlobalErrorHandlerMessage: (message: string) => boolean
    createOnUncaughtExceptionHandler: () => ((e: Error) => any)
    createOnUnhandledRejectionHandler: () => ((reason: {} | null | undefined, promise: Promise<any>) => any)
}

export interface WatchCatOptions {
    env: string,
    token: string,
    url: string,
    logToConsole: boolean,
    monitors: Monitors[] | null
    fullMonitorSync: boolean
    meta: object
}

export interface Monitors {
    url: string
    httpCodes?: string
    phrase?: string
    interval?: MonitorInterval
}

type MonitorInterval = "30s" | "1m" | "5m" | "30m" | "1h" | undefined

export const WatchCatAppHeader = 'x-watchcat-app-token'

export type Level = 'error' | 'warn' | 'critical' | 'fatal'
export type StackTrace = Array<StackFrame>

export interface Payload {
    env: string
    level: Level
    message: string
    language: string,
    framework: string,
    meta: object,
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

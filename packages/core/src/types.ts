export const WatchCatPackageNames: string[] = [
    "@watchcathq",
    "watchcat.mjs",
    "watchcat.js",
    "watchcat.umd.js"
]

export interface WatchCatClient {
    exception: (e: Error) => void
    error: (message: string) => void
    warn: (message: string) => void
    withMeta: (params: object) => WatchCatClient
}

export interface WatchCatOptions {
    env: string,
    token: string,
    url: string,
    debug: boolean,
}

export const WatchCatAppHeader = 'x-watchcat-app-token'

export type Level = 'error' | 'warn' | 'critical' | 'fatal'
export type StackTrace = Array<StackFrame>

export interface Payload {
    env: string
    level: Level
    message: string
    language: string,
    framework: string,
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

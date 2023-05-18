import {WatchCatReactClient} from "../watchcat_react_client";
import {WatchCatOptions} from "@watchcathq/core";

export default class WatchCatTestClient extends WatchCatReactClient {
    callCount: number = 0
    lastMessage: string = ""
    lastError: Error | undefined
    protected lastGlobalErrorMessage: string = ''

    constructor(options: Partial<WatchCatOptions>) {
        super(options)
    }

    error(message: string): void {
        this.lastMessage = message
        this.callCount++
    }

    exception(e: Error): void {
        this.lastError = e
        this.callCount++
    }

    warn(message: string): void {
        this.lastMessage = message
        this.callCount++
    }

    setGlobalErrorHandlerMessage(message: string) {
        this.lastGlobalErrorMessage = message
    }

    isGlobalErrorHandlerMessage(message: string): boolean {
        return this.lastGlobalErrorMessage === message
    }
}

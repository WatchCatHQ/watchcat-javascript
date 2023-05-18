import {WatchCatCoreClient, WatchCatOptions} from '@watchcathq/core'

export class WatchCatVueClient extends WatchCatCoreClient {
    // prevent sending error message twice (onerror & error boundary)
    protected lastGlobalErrorMessage: string = ''

    constructor(options: Partial<WatchCatOptions>) {
        super(options)
    }

    setGlobalErrorHandlerMessage(message: string) {
        this.lastGlobalErrorMessage = message
    }

    isGlobalErrorHandlerMessage(message: string): boolean {
        return this.lastGlobalErrorMessage === message
    }
}

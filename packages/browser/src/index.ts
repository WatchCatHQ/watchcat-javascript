import {WatchCatBrowserClient} from "./watchcat_browser_client";
import {WatchCatOptions} from "@watchcathq/core";

const createOnErrorHandler = (instance: WatchCatBrowserClient) => {
    return (event: ErrorEvent) => {
        if (!instance.isGlobalErrorHandlerMessage(event.message)) {
            instance.setGlobalErrorHandlerMessage(event.message)
            instance
                .withMeta({
                    react: {
                        errorSource: 'Window.OnError'
                    }
                })
                .exception(event.error)
        }
    }
}

class WatchCat {
    static init(options: Partial<WatchCatOptions>): void {
        const instance = new WatchCatBrowserClient(options);
        (globalThis as any).WatchCat = instance
        window.addEventListener("error", createOnErrorHandler(instance));
    }

    static initFromInstance(instance: WatchCatBrowserClient): void {
        (globalThis as any).WatchCat = instance
        window.addEventListener("error", createOnErrorHandler(instance));
    }

    static exception(e: Error): void {
        WatchCat.getWatchCatClient()?.exception(e);
    }

    static error(message: string): void {
        WatchCat.getWatchCatClient()?.error(message);
    }

    static warn(message: string): void {
        WatchCat.getWatchCatClient()?.warn(message);
    }

    static withMeta(params: object): typeof WatchCat {
        WatchCat.getWatchCatClient()?.withMeta(params);
        return WatchCat;
    }

    static getWatchCatClient(): WatchCatBrowserClient | undefined {
        const client = (globalThis as any).WatchCat
        if (client === undefined) {
            console.error('WatchCat is not initialized. Did you forget to call WatchCat.init(...)?')
            return undefined;
        }
        return client
    }
}

export {WatchCat as default, WatchCatOptions}

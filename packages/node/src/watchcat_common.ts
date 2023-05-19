import {WatchCatOptions} from "@watchcathq/core";
import {WatchCatNodeClient} from "./watchcat_node_client";

export const InitWatchCatClient = (options: Partial<WatchCatOptions>) => {
    const instance = new WatchCatNodeClient(options);
    (globalThis as any).WatchCat = instance
    process.on("uncaughtException", instance.createOnUncaughtExceptionHandler());
    process.on("unhandledRejection", instance.createOnUnhandledRejectionHandler());
}

export const InitWatchCatClientFromInstance = (instance: WatchCatNodeClient) => {
    (globalThis as any).WatchCat = instance
    process.on("uncaughtException", instance.createOnUncaughtExceptionHandler());
    process.on("unhandledRejection", instance.createOnUnhandledRejectionHandler());
}

export const GetWatchCatClient = (): WatchCatNodeClient | undefined => {
    const client = (globalThis as any).WatchCat
    if (client === undefined) {
        console.error('WatchCat is not initialized. Did you forget to call WatchCat.init(...)?')
        return undefined;
    }
    return client
}

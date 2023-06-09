import {GetWatchCatClient, InitWatchCatClient} from "./watchcat_common";
import {WatchCatServerOptions} from "@watchcathq/core";

class WatchCat {
    static init(options: Partial<WatchCatServerOptions>): void {
        InitWatchCatClient(options);
    }

    static exception(e: Error): void {
        GetWatchCatClient()?.exception(e);
    }

    static error(message: string): void {
        GetWatchCatClient()?.error(message);
    }

    static warn(message: string): void {
        GetWatchCatClient()?.warn(message);
    }

    static withMeta(params: object): typeof WatchCat {
        GetWatchCatClient()?.withMeta(params);
        return WatchCat;
    }

    static omitStackLevels(levels: number = 0): typeof WatchCat {
        GetWatchCatClient()?.omitStackLevels(levels);
        return WatchCat;
    }
}

export {WatchCat as default, WatchCatServerOptions}

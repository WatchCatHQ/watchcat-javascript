import {WatchCatReactClient} from "./watchcat_react_client";
import {WatchCatOptions} from "@watchcathq/core";
import React, {FC, PropsWithChildren} from "react";
import {ErrorBoundary} from "react-error-boundary";

const WatchCatErrorBoundary: FC<PropsWithChildren<WatchCatErrorBoundaryProps>> = ({children, fallback}) => {
    return (
        <ErrorBoundary fallback={fallback} onError={onReactError}>
            {children}
        </ErrorBoundary>
    )
}

const createOnErrorHandler = (instance: WatchCatReactClient) => {
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
    public static ErrorBoundary = WatchCatErrorBoundary

    static init(options: Partial<WatchCatOptions>): void {
        const instance = new WatchCatReactClient(options);
        (globalThis as any).WatchCat = instance
        window.addEventListener("error", createOnErrorHandler(instance));
    }

    static initFromInstance(instance: WatchCatReactClient): void {
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

    static getWatchCatClient(): WatchCatReactClient | undefined {
        const client = (globalThis as any).WatchCat
        if (client === undefined) {
            console.error('WatchCat is not initialized. Did you forget to call WatchCat.init(...)?')
            return undefined;
        }
        return client
    }
}

interface WatchCatErrorBoundaryProps {
    fallback: React.ReactElement<unknown, string | React.FunctionComponent | typeof React.Component> | null;
}

const onReactError = (error: Error, info: { componentStack: string; }) => {
    const client = WatchCat.getWatchCatClient()
    if (client && !client.isGlobalErrorHandlerMessage(error.message)) {
        client
            .withMeta({
                react: {
                    reactComponentStack: info.componentStack?.split("\n"),
                    errorSource: 'ErrorBoundary'
                }
            })
            .exception(error)
    }
}

export {WatchCat as default, WatchCatOptions}

import React, { FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import WatchCat from "./index";

export interface WatchCatErrorBoundaryProps {
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

export const WatchCatErrorBoundary: FC<PropsWithChildren<WatchCatErrorBoundaryProps>> = ({ children, fallback }) => {
    return (
        <ErrorBoundary fallback={fallback} onError={onReactError}>
            {children}
        </ErrorBoundary>
    )
}

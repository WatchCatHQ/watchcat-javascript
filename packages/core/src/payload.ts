import { Level, Payload, StackTrace } from "./types";

export function createPayload(
    env: string,
    level: Level,
    message: string,
    meta: object,
    stacktrace: StackTrace): Payload {

    return {
        env,
        level,
        message,
        meta,
        stacktrace,
        timestamp: Date.now()
    }
}

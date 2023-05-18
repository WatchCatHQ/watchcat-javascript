import {Level, Payload, StackTrace} from "./types";

export function createPayload(
    env: string,
    level: Level,
    message: string,
    framework: string | undefined,
    meta: object,
    stacktrace: StackTrace): Payload {

    return {
        env,
        level,
        message,
        language: 'javascript',
        framework: framework ?? "",
        meta,
        stacktrace,
        timestamp: Date.now()
    }
}

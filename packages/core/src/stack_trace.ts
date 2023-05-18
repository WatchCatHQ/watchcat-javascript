import {StackFrame, WatchCatPackageNames} from "./types";

export const parseStackTrace = (trace: string | undefined): StackFrame[] => {
    if (!trace) {
        return []
    }
    const traceItems = trace.split('\n').slice(1);
    const traceObjects: Array<StackFrame> = [];
    for (const item of traceItems) {
        const match = item.match(/^\s*at (?:(.+)\s+)?\(?(.+):(\d+):(\d+)\)?$/);
        if (!match) {
            continue;
        }

        const functionName = match[1] || '';
        const fileName = match[2];
        const lineNumber = parseInt(match[3], 10);
        const columnNumber = parseInt(match[4], 10);
        let sourceLines: string[] = [];

        if (WatchCatPackageNames.some(pkg => fileName.includes(pkg)))
            continue;

        traceObjects.push({
            functionName,
            fileName,
            lineNumber,
            columnNumber,
            sourceLines,
        });
    }
    return traceObjects;
}

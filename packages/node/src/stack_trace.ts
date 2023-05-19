import SourceMaps from "./source_maps";
import path from "path";
import {promises as fs} from 'fs';
import {StackFrame, WatchCatPackageNames} from "@watchcathq/core";

export const parseStackTrace = async (sourceMaps: SourceMaps, trace: string | undefined, omitStackLevels = 0, debug: boolean = false): Promise<StackFrame[]> => {
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

        let functionName = match[1] || '';
        let fileName = match[2];
        let lineNumber = parseInt(match[3], 10);
        let columnNumber = parseInt(match[4], 10);
        let sourceLines: string[] = [];

        if (WatchCatPackageNames.some(pkg => fileName.includes(pkg)))
            continue;

        if (fileName.includes('node:'))
            continue;

        try {
            const filePath = path.resolve(fileName);
            const fileContent = await fs.readFile(filePath, 'utf8');

            const map = await sourceMaps.getMapFor(filePath)
            if (map) {
                // There is source map for this file so translate position to original
                const pos = await map.translatePosition(lineNumber, columnNumber)
                if (pos?.line && pos?.column) {
                    lineNumber = pos.line
                    columnNumber = pos.column
                }
                if (pos?.name) {
                    functionName = pos.name
                }
                if (pos?.source) {
                    fileName = path.resolve(pos.source)
                }
            } else {
                // No source maps so we can load source code
                const lines = fileContent.split('\n');
                const startLine = Math.max(0, lineNumber - 5);
                const endLine = Math.min(lines.length - 1, lineNumber + 5);
                sourceLines = lines.slice(startLine, endLine + 1);
            }
        } catch (error) {
            if (debug) {
                console.error(error);
            }
            sourceLines = [];
        }

        traceObjects.push({
            functionName,
            fileName,
            lineNumber,
            columnNumber,
            sourceLines,
        });
    }
    return traceObjects.slice(omitStackLevels);
}

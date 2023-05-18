import {BasicSourceMapConsumer, IndexedSourceMapConsumer, NullableMappedPosition} from "source-map";
import { promises as fs } from 'fs';
import path from "path";

const SourceMapConsumer = require('source-map').SourceMapConsumer;

class SourceMaps {
    private cache: SourceMapCache = {}

    async getMapFor(fileName: string): Promise<SourceMap | null> {
        if (!fileName.endsWith('.js')) {
            return null
        }
        if (this.cache.hasOwnProperty(fileName)) {
            return this.cache[fileName]
        }

        const sourceMapPath = await this.parseSourceMapLocation(fileName)
        if (sourceMapPath === null) {
            return null
        }
        const isAbsoluteUrl = /^https?:\/\//i.test(sourceMapPath);
        const isDataUri = /^data:/i.test(sourceMapPath);

        if (isAbsoluteUrl || isDataUri) {
            return null
        }

        const fullSourceMapPath = path.resolve(path.dirname(fileName), sourceMapPath);

        try {
            const content = await fs.readFile(fullSourceMapPath, 'utf8')
            const sm = new SourceMap(content)
            this.cache[fileName] = sm
            return sm
        } catch (e) {
            return null
        }
    }

    private async parseSourceMapLocation(filePath: string) {
        const fileContents = await fs.readFile(filePath, 'utf-8')

        const match = /\/\/# sourceMappingURL=(.*)/.exec(fileContents)
        if (match) {
            const sourceMapUrl = match[1]
            return path.resolve(path.dirname(filePath), sourceMapUrl)
        } else {
            return null
        }
    }
}

type SourceMapCache = {
    [key: string]: SourceMap
}

class SourceMap {
    private readonly content: string = ""

    constructor(rawContent: string) {
        this.content = rawContent
    }

    async translatePosition(line: number, column: number): Promise<NullableMappedPosition> {
        return SourceMapConsumer.with(
            this.content,
            null,
            async function (consumer: BasicSourceMapConsumer | IndexedSourceMapConsumer) {
                return consumer.originalPositionFor({
                    line, column
                })
            }
        );
    }
}

export default SourceMaps

import {NextFunction, Request, Response} from 'express';
import WatchCat from "@watchcathq/node";

class WatchCatExpress extends WatchCat {
    static withRequest(req: Request): typeof WatchCatExpress {
        this.withMeta({
            request: {
                method: req?.method,
                url: req?.originalUrl,
                path: req?.path,
                headers: req?.headers,
                query: req?.query,
                body: req?.body
            }
        })
        return this
    }

    static errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
        WatchCatExpress
            .withRequest(req)
            .exception(err);
        next(err)
    }
}


export default WatchCatExpress

import WatchCat from "@watchcathq/node";
import { FastifyReply, FastifyRequest } from "fastify";

class WatchCatFastify extends WatchCat {
    static withRequest(req: FastifyRequest): typeof WatchCatFastify {
        this.withMeta({
            request: {
                method: req?.method,
                url: req?.url,
                headers: req?.headers,
                query: req?.query,
                body: req?.body
            }
        })
        return this
    }

    static async onError(req: FastifyRequest, reply: FastifyReply, err: Error) {
        WatchCatFastify
            .withRequest(req)
            .exception(err);
        reply.send(err);
    }
}


export default WatchCatFastify

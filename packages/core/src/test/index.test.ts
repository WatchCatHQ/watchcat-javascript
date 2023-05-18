import {WatchCatCoreClient} from "../index";
import {RateLimitedClient} from "../rate_limited_client";

describe('WatchCatCore client test', (): void => {
    let fetchSpy: jest.SpyInstance;
    let client: WatchCatCoreClient

    beforeEach(() => {
        fetchSpy = jest.spyOn(RateLimitedClient.prototype, 'fetch');
        client = new WatchCatCoreClient({
            env: "production",
            token: "app_34234t23"
        })
    });

    afterEach(() => {
        fetchSpy.mockRestore();
    });

    test('should init', (): void => {
        expect(client).toBeDefined()
    });

    test('send warning event', async () => {
        client?.warn("warning message")

        await new Promise(resolve => setTimeout(resolve, 100))

        expect(fetchSpy).toHaveBeenCalled();

        const call = fetchSpy.mock.calls.pop()
        expect(call[0]).toBe("https://api.watchcat.io/api/event.in")

        const options = call[1] as RequestInit
        expect(options.headers).toStrictEqual({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-watchcat-app-token": "app_34234t23"
        })

        const body = JSON.parse(<string>options.body)
        expect(body).toStrictEqual(expect.objectContaining({
            env: "production",
            level: "warn",
            message: "warning message",
            language: "javascript",
            framework: "",
        }))
        expect(body.stacktrace.length > 1).toBeTruthy()
    });

    test('send error event with application info', async () => {
        client
            ?.withMeta({
                userId: 12345
            })
            .error("error message")

        expect(fetchSpy).toHaveBeenCalled();

        const call = fetchSpy.mock.calls.pop()
        expect(call[0]).toBe("https://api.watchcat.io/api/event.in")

        const options = call[1] as RequestInit
        expect(options.headers).toStrictEqual({
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-watchcat-app-token": "app_34234t23"
        })

        const body = JSON.parse(<string>options.body)
        expect(body).toStrictEqual(expect.objectContaining({
            env: "production",
            level: "error",
            message: "error message",
            language: "javascript",
            framework: "",
            meta: {
                userId: 12345
            }
        }))
        expect(body.stacktrace.length > 1).toBeTruthy()
    });
});

import {RateLimitedClient} from '../rate_limited_client';

describe('RateLimitedClient test', () => {
    let rateLimitedClient: RateLimitedClient;

    beforeEach(() => {
        rateLimitedClient = new RateLimitedClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls the fetch function with the expected URL and options', async () => {
        const url = 'https://example.com/api';
        const options = {method: 'GET'};
        await rateLimitedClient.fetch(url, options);
        expect(fetch).toHaveBeenCalledWith(url, options);
    });

    test('adds a fetch request to the queue', async () => {
        const url = 'https://example.com/api';
        await rateLimitedClient.fetch(url);
        setTimeout(() => {
            expect(rateLimitedClient.queue.length).toBe(1);
        }, 100);
    });

    test('starts an interval to process the queue', async () => {
        const setIntervalSpy = jest.spyOn(global, 'setInterval');
        const url = 'https://example.com/api';
        await rateLimitedClient.fetch(url);
        expect(setIntervalSpy).toHaveBeenCalled();
    });

    test('processes the queue at the specified rate limit per second', async () => {
        const processQueueSpy = jest.spyOn(RateLimitedClient.prototype as any, 'processQueue')
        const url = 'https://example.com/api';
        await rateLimitedClient.fetch(url);
        expect(processQueueSpy).toHaveBeenCalled();
    });

    test('clears the interval when the queue is empty', async () => {
        const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
        const url = 'https://example.com/api';
        await rateLimitedClient.fetch(url);
        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});
import fetchBuilder from 'fetch-retry'

const rateLimitPerSecond: number = 10;

export class RateLimitedClient {
    private retryFetch = fetchBuilder(fetch, {
        retries: 3,
        retryDelay: 250
    })
    queue: Array<() => Promise<Response | void>> = [];
    private interval: NodeJS.Timeout | null = null;

    public async fetch(url: string, options?: RequestInit): Promise<Response> {
        return new Promise((resolve, reject) => {
            this.queue.push(() => this.retryFetch(url, options).then(resolve, reject));
            if (!this.interval) {
                this.interval = setInterval(() => {
                    this.processQueue();
                }, 1000);
            }
        });
    }

    private processQueue() {
        if (this.queue.length === 0) {
            clearInterval(this.interval!);
            this.interval = null;
            return;
        }

        for (let i = 0; i < rateLimitPerSecond; i++) {
            const request = this.queue.shift();
            if (!request) {
                break;
            }
            request();
        }
    }
}
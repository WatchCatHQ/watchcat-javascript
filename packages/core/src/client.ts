import {Monitors, Payload, WatchCatAppHeader} from "./types";
import axios, {AxiosRequestConfig} from "axios";
import axiosRetry from "axios-retry";

export class Client {
    private token: string
    private baseUrl: string

    constructor(token: string, baseUrl: string) {
        this.token = token
        this.baseUrl = baseUrl

        axiosRetry(axios, {
            retries: 3
        })
    }

    async syncMonitors(monitors: Monitors[], fullMonitorSync: boolean) {
        const payload = {
            monitors: monitors,
            fullMonitorSync: fullMonitorSync
        }
        await this.callApi('/api/monitors.sync', payload)
    }

    async sendEvent(payload: Payload) {
        await this.callApi('/api/event.in', payload)
    }

    private async callApi(uri: string, payload: any) {
        const options: AxiosRequestConfig = {
            method: 'POST',
            headers: {
                'Accept': 'meta/json',
                'Content-Type': 'application/json',
                [WatchCatAppHeader]: this.token
            },
        }
        try {
            await axios.post(this.baseUrl + uri, payload, options)
        } catch (error: any) {
            if (error?.response) {
                const status = error.response?.status;
                const statusText = error.response?.statusText;
                const message = error.response?.data?.message;
                console.error(`WatchCat request failed with status ${status} ${statusText}: ${message}`);
            } else if (error?.request) {
                console.error('WatchCat request failed: no response received');
            } else {
                console.error(`WatchCat request failed: ${error?.message}`);
            }
        }
    }
}

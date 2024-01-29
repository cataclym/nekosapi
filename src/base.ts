import { URL } from "url";
import axios from "axios";
import { SocksProxyAgent } from "socks-proxy-agent";
import { CustomProxy } from "./Proxy";

export default class Base {
    protected socks5Proxy: CustomProxy

    constructor() {
        this.socks5Proxy = {
            protocol: "socks5",
            host: process.env.PROXY_HOST!,
            port: parseFloat(process.env.PROXY_PORT!),
            auth: {
                username: process.env.PROXY_USER != undefined ? process.env.PROXY_USER : "",
                password: process.env.PROXY_PASS != undefined ? process.env.PROXY_PASS : "",
            },
        }

    }

    protected async fetchResponse<T>(url: URL, config?: axios.AxiosRequestConfig): Promise<T> {

        const promise = async (): Promise<axios.AxiosResponse<T>> => {
            if (process.env.PROXY_HOST != undefined) {

                const proxyURL = `${this.socks5Proxy.protocol}://${this.socks5Proxy.auth.username}:${this.socks5Proxy.auth.password}@${this.socks5Proxy.host}:${this.socks5Proxy.port}`;

                return axios.get(
                    url.toString(),
                    Object.assign({
                        httpsAgent: new SocksProxyAgent(proxyURL),
                        responseType: "json",
                    }, config),
                )
            }
            else {
                return axios.get(
                    url.toString(),
                    {
                        responseType: "json",
                    },
                )
            }
        }

        const response = await promise();
        await Base.checkResponseCode(response);
        return response.data;
    }

    protected static async checkResponseCode<T>(response: axios.AxiosResponse<T>) {
        if (response.status > 200 && response.status <= 300) {
            throw new Error(`An error occurred while fetching data from the server. ${response.statusText}. Status: ${response.status}. ${response.request?.url || ""}`)
        }
    }

}
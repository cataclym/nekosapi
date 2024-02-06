import { URL } from "url";
import Base from "../base";
import { CustomProxy } from "../Proxy";
import { Artist, Category, Character, NekosCategoryResponse, NekosData, NekosResponse } from "./Interfaces";
import NekosImage from "./NekosImage";
import { preventRateLimit } from "./preventRateLimit";

export class NekosAPI extends Base {

    private readonly token: string | undefined;
    private readonly baseUrl: string;
    /*
    * Last time a request was sent to the API
    */
    public static lastRequest = new Date();

    public constructor(token?: string, proxy?: CustomProxy) {
        super(proxy);
        if (token && NekosAPI.validateToken(token)) {
            this.token = token;
        }
        this.baseUrl = "https://v1.nekosapi.com/api/";
        NekosAPI.lastRequest = new Date();
    }

    @preventRateLimit()
    public async getImages(limit = 10, offset = 0): Promise<NekosImage[]> {

        if (!this.token) throw new Error("You need a valid access token to use this method.")

        const options = {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`,
            },
        };

        const url = new URL(`${this.baseUrl}image?`);

        url.searchParams.append("offset", String(offset));
        url.searchParams.append("limit", String(limit));

        const response = await this.fetchResponse<NekosResponse>(url, options);

        return response["data"]
            .map(image => new NekosImage(image));
    }

    @preventRateLimit()
    public async getRandomImages(categories?: string | string[], limit?: number): Promise<NekosImage[]> {
        return this._getRandomImages(categories, limit);
    }

    @preventRateLimit()
    public async getRandomImage(categories?: string | string[]): Promise<NekosImage> {
        return (await this._getRandomImages(categories, 1))[0];
    }

    private async _getRandomImages(categories?: string | string[], limit?: number) {

        const query = categories
            ? Array.isArray(categories)
                ? categories.join(",")
                : categories || ""
            : "";

        const limitQuery = limit || 1;

        const url = new URL(`${this.baseUrl}image/random?`);

        url.searchParams.append("categories", query);
        url.searchParams.append("limit", String(limitQuery));

        const response = await this.fetchResponse<NekosResponse>(url);

        return response["data"]
            .map(image => new NekosImage(image));
    }

    @preventRateLimit()
    public async getImageByID(id: string): Promise<NekosImage> {

        const url = new URL(`${this.baseUrl}image/${id}`);

        const response = await this.fetchResponse<NekosData>(url);

        return new NekosImage(response);
    }

    @preventRateLimit()
    public async getArtistByID(id: string): Promise<Artist> {

        const url = new URL(`${this.baseUrl}artist/${id}`);

        const response = await this.fetchResponse<{data: Artist}>(url);

        return response["data"];
    }

    @preventRateLimit()
    public async getImagesByArtistID(id: string, limit = 10, offset = 0): Promise<NekosImage[]> {

        const url = new URL(`${this.baseUrl}artist/${id}/images?`);

        url.searchParams.append("limit", String(limit));
        url.searchParams.append("offset", String(offset));

        const response = await this.fetchResponse<NekosResponse>(url);

        return response["data"]
            .map(image => new NekosImage(image));
    }

    @preventRateLimit()
    public async getCharacterByID(id: string): Promise<Character> {

        const url = new URL(`${this.baseUrl}character/${id}`);

        const response = await this.fetchResponse<{data: Character}>(url);

        return response["data"];
    }

    @preventRateLimit()
    public async getCategories(limit = 10, offset = 0): Promise<Category[]> {

        const url = new URL(`${this.baseUrl}category?`);

        url.searchParams.append("limit", String(limit));
        url.searchParams.append("offset", String(offset));

        const response = await this.fetchResponse<NekosCategoryResponse<true>>(url);

        return response["data"];
    }

    @preventRateLimit()
    public async getCategoryByID(categoryID: string): Promise<Category> {

        const url = new URL(`${this.baseUrl}category/${categoryID}`);
        const response = await this.fetchResponse<NekosCategoryResponse<false>>(url);

        return response["data"];
    }

    private static validateToken(token?: string) {
        if ((token && !token.match(NekosAPI.tokenRegex)?.length) || !token) {
            throw new Error("The token is invalid. It should be 100 characters long and contain numbers and lowercase/uppercase characters.");
        }
        else {
            return true;
        }
    }

    private static tokenRegex = /^[0-9a-zA-Z]{100}$/g;
}

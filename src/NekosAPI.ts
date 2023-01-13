import fetch, { Response } from "node-fetch";
import { URL } from "url";
import { Artist, Category, Character, NekosCategoryResponse, NekosResponse } from "./Interfaces";
import NekosImage from "./NekosImage";
import { setTimeout } from "timers/promises";
import { preventRateLimit } from "./preventRateLimit";

export class NekosAPI {

    private readonly token: string | undefined;
    private readonly baseUrl: string;
    /*
    * Last time a request was sent to the API
    */
    public static lastRequest = new Date();
    public constructor(token?: string) {
        if (token && NekosAPI.validateToken(token)) {
            this.token = token;
        }
        this.baseUrl = "https://nekos.nekidev.com/api/";
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

        const response = await fetch(url, options);

        await NekosAPI.checkResponseCode(response);

        return (<NekosResponse> await response.json())["data"]
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

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response);

        return (<NekosResponse> await response.json())["data"]
            .map(image => new NekosImage(image));
    }

    @preventRateLimit()
    public async getImageByID(id: string): Promise<NekosImage> {

        const url = new URL(`${this.baseUrl}image/${id}`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return new NekosImage((await response.json())["data"]);
    }

    @preventRateLimit()
    public async getArtistByID(id: string): Promise<Artist> {

        const url = new URL(`${this.baseUrl}artist/${id}`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (await response.json())["data"] as Artist;
    }

    @preventRateLimit()
    public async getImagesByArtistID(id: string, limit = 10, offset = 0): Promise<NekosImage[]> {

        const url = new URL(`${this.baseUrl}artist/${id}/images?`);

        url.searchParams.append("limit", String(limit));
        url.searchParams.append("offset", String(offset));

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (<NekosResponse> await response.json())["data"]
            .map(image => new NekosImage(image));
    }

    @preventRateLimit()
    public async getCharacterByID(id: string): Promise<Character> {

        const url = new URL(`${this.baseUrl}character/${id}`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (await response.json())["data"] as Character;
    }

    @preventRateLimit()
    public async getCategories(limit = 10, offset = 0): Promise<Category[]> {

        const url = new URL(`${this.baseUrl}category?`);

        url.searchParams.append("limit", String(limit));
        url.searchParams.append("offset", String(offset));

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (<NekosCategoryResponse<true>> await response.json())["data"];
    }

    @preventRateLimit()
    public async getCategoryByID(categoryID: string): Promise<Category> {

        const url = new URL(`${this.baseUrl}category/${categoryID}`);
        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (<NekosCategoryResponse<false>> await response.json())["data"];
    }

    private static validateToken(token?: string) {
        if ((token && token.match(NekosAPI.tokenRegex).length) || !token) {
            throw new Error("The token is invalid. It should be 100 characters long and contain numbers and lowercase/uppercase characters.");
        }
        else {
            return true;
        }
    }

    private static async checkResponseCode(response: Response) {
        if ((response.status > 200 && response.status <= 300) || !response.ok) {
            throw new Error(`An error occurred while fetching the data from the server. ${response.statusText}. Status: ${response.status}`)
        }
    }

    private static tokenRegex = /^[0-9a-zA-Z]{100}$/g;
}

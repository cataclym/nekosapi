import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import { URL, URLSearchParams } from "url";
import { Artist, Category, Character, NekosCategoryResponse, NekosResponse } from "./Interfaces";
import NekosImage from "./NekosImage";
import isRedirect = fetch.isRedirect;

export class NekosAPI {

    private readonly token: string | undefined;
    private readonly baseUrl: string;

    public constructor(token?: string) {
        if (token && NekosAPI.validateToken(token)) {
            this.token = token;
        }
        this.baseUrl = "https://nekos.nekidev.com/api/";
    }

    public async getImages(limit = 10, offset = 0): Promise<NekosImage[]> {

        if (!this.token) throw new Error("You need a valid access token to use this method.")

        const options = {
            method: "POST",
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

    public async getRandomImage(categories?: string | string[], limit?: number): Promise<NekosImage[]> {

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

    public async getImageByID(id: string): Promise<NekosImage> {

        const url = new URL(`${this.baseUrl}image/${id}`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return new NekosImage((await response.json())["data"]);
    }

    public async getArtistByID(id: string): Promise<Artist> {

        const url = new URL(`${this.baseUrl}artist/${id}`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (await response.json())["data"] as Artist;
    }

    public async getImagesByArtistID(id: string, limit = 10, offset = 0): Promise<NekosImage[]> {

        const url = new URL(`${this.baseUrl}artist/${id}/images?`);

        url.searchParams.append("limit", String(limit));
        url.searchParams.append("offset", String(offset));

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (<NekosResponse> await response.json())["data"]
            .map(image => new NekosImage(image));
    }

    public async getCharacterByID(id: string): Promise<Character> {

        const url = new URL(`${this.baseUrl}character/${id}`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (await response.json())["data"] as Character;
    }

    public async getCategory(limit = 10, offset = 0): Promise<Category[]> {

        const url = new URL(`${this.baseUrl}category?`);

        url.searchParams.append("limit", String(limit));
        url.searchParams.append("offset", String(offset));

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return (<NekosCategoryResponse> await response.json())["data"];
    }

    private static validateToken(token?: string) {
        if ((token && Array.from(token.matchAll(NekosAPI.tokenRegex)).length) || !token) {
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

    private static tokenRegex = /^[0-9a-zA-Z]{100}$/;
}

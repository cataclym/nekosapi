import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';

export class NekosAPI {

    private readonly token: string | undefined;
    private readonly baseUrl: string;

    public constructor(token?: string) {
        if (token && NekosAPI.validateToken(token)) {
            this.token = token;
        }
        this.baseUrl = 'https://nekos.nekidev.com/api/';
    }

    public async getImages(limit = 10, offset = 0): Promise<NekosImage[]> {

        if (!this.token) throw new Error("You need a valid access token to use this method.")

        if (limit > 25) limit = 25;

        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.token}`
            },
        };

        const response = await fetch(`${this.baseUrl}image?limit=${limit}&offset=${offset}`, options);

        await NekosAPI.checkResponseCode(response);

        return (<NekosResponse> await response.json())["data"]
            .map(image => new NekosImage(image));
    }

    public async getRandomImage(): Promise<NekosImage> {
        const response = await fetch(`${this.baseUrl}image/random`);

        await NekosAPI.checkResponseCode(response);

        return new NekosImage((<NekosResponse> await response.json())["data"][0]);
    }

    private static validateToken(token?: string) {
        if ((token && Array.from(token.matchAll(NekosAPI.tokenRegex)).length) || !token) {
            throw new Error('The token is invalid. It should be 100 characters long and contain numbers and lowercase/uppercase characters.');
        } else {
            return true;
        }
    }

    private static async checkResponseCode(response: Response) {
        if ((response.status > 200 && response.status <= 300) || !response.ok) {
            throw new Error(`An error occurred while fetching the data from the server. ${response.statusText} ${response.status}`)
        }
    }

    private static tokenRegex = /^[0-9a-zA-Z]{100}$/;
}

class NekosImage {
    readonly id: string;
    readonly url: string;
    readonly artist: Artist | null;
    readonly source: _Source;
    readonly original: boolean | null;
    readonly nsfw: NsfwLevel;
    readonly categories: Category[];
    readonly characters: Characters[];
    readonly createdAt: Date;
    readonly etag: string;
    readonly size: number;
    readonly mimetype: string;
    readonly color: HexString;
    readonly expires: any;
    readonly dimensions: Dimensions;
    constructor(data: NekosData) {
        this.id=data["id"];
        this.url=data["url"];
        this.artist=data["artist"];
        this.source=data["source"];
        this.original=data["original"];
        this.nsfw=data["nsfw"] as NsfwLevel;
        this.categories=data["categories"];
        this.characters=data["characters"];
        this.createdAt=new Date(data["createdAt"]);
        this.etag=data["meta"]["eTag"];
        this.size=data["meta"]["size"];
        this.mimetype=data["meta"]["mimetype"];
        this.color=data["meta"]["color"] as HexString;
        this.expires=data["meta"]["expires"];
        this.dimensions=data["meta"]["dimens"]
    }
}

type NsfwLevel = null | "sfw" | "questionable" | "nsfw";

interface Artist {
    id: string
    name: string
    url?: string
    images?: number
}

interface _Source {
    name?: string
    url?: string
}

interface Category {
    id:          string;
    name:        string;
    description: string;
    nsfw:        boolean;
    type:        string;
    createdAt:   Date;
}

interface Characters {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
}

interface Dimensions {
    width: number,
    height: number,
    orientation: ImageOrientation,
}

export interface NekosResponse {
    data:    NekosData[];
    success: boolean;
}

export interface NekosData {
    id:         string;
    url:        string;
    artist:     null;
    source:     _Source;
    original:   null;
    nsfw:       string;
    categories: Category[];
    characters: any[];
    createdAt:  Date;
    meta:       Meta;
}

export interface Meta {
    eTag:     string;
    size:     number;
    mimetype: string;
    color:    string;
    expires:  Date;
    dimens:   Dimensions;
}

type ImageOrientation = "landscape" | "portrait" | "square";
type HexString = `#${string}`;

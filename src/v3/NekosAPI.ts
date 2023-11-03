import { URL } from "url";
import { preventRateLimit } from "./preventRateLimit";
import { TagNames, Tags } from "./types/Tags";
import {
    ArrayResponse,
    Artist,
    Character,
    NekosImage,
} from "./types/nekosImage";
import { BaseImageOptions, FullImageOptions } from "./types/baseImageOptions";
import { Tag } from "./types/Tag";
import { IntRange } from "./types/IntRange";
import { ArtistOptions } from "./types/artistOptions";
import { CharacterOptions } from "./types/characterOptions";
import { TagOptions } from "./types/tagOptions";

export class NekosAPI {
    private readonly baseUrl: string;
    /*
    * Last time a request was sent to the API
    */
    public static lastRequest = new Date();

    public constructor() {
        this.baseUrl = "https://api.nekosapi.com/v3/";
        NekosAPI.lastRequest = new Date();
    }

    @preventRateLimit()
    public async getImage(tags?: TagNames | TagNames[], options?: BaseImageOptions): Promise<NekosImage> {
        const optionsWithLimit = Object.assign({ limit: 1 as IntRange<1, 1> }, options)
        return (await this._getImages(tags, optionsWithLimit))[0];
    }

    @preventRateLimit()
    public async getImages(tags?: TagNames | TagNames[], options?: FullImageOptions): Promise<NekosImage[]> {
        return (await this._getImages(tags, options))
    }

    private async _getImages(tags: TagNames | TagNames[], options: FullImageOptions): Promise<NekosImage[]> {
        const baseUrl = new URL(`${this.baseUrl}images?`);
        const url = this.processSearchParams(baseUrl, tags, options);
        return (await this.fetchResponse<ArrayResponse<NekosImage>>(url)).items
    }

    @preventRateLimit()
    public async getRandomImage(tags?: TagNames | TagNames[], options?: BaseImageOptions): Promise<NekosImage> {
        const optionsWithLimit = Object.assign({ limit: 1 as IntRange<0, 1> }, options)
        return (await this._getRandomImages(tags, optionsWithLimit))[0];
    }

    private async _getRandomImages(tags?: TagNames | TagNames[], options?: BaseImageOptions): Promise<NekosImage[]> {
        const baseUrl = new URL(`${this.baseUrl}images/random?`);
        const url = this.processSearchParams(baseUrl, tags, options);
        return (await this.fetchResponse<ArrayResponse<NekosImage>>(url)).items
    }

    @preventRateLimit()
    public async getImageByID(id: string | number): Promise<NekosImage> {
        const url = new URL(`${this.baseUrl}images/${id}`);
        return this.fetchResponse<NekosImage>(url);
    }

    @preventRateLimit()
    public async getAllTags(options?: Partial<TagOptions>): Promise<Tag[]> {
        const baseUrl = new URL(`${this.baseUrl}images/tags`);
        const url = this.processSearchParams(baseUrl, [], options);
        const response = await fetch(url);
        await NekosAPI.checkResponseCode(response)
        return (await this.fetchResponse<ArrayResponse<Tag>>(url)).items
    }

    @preventRateLimit()
    public async getTagByID(tagID: number): Promise<Tag> {
        return this._getTagByID(tagID);
    }

    @preventRateLimit()
    public async getTagByName(tagID: TagNames): Promise<Tag> {
        return this._getTagByID(Tags[tagID])
    }

    private _getTagByID(tagID: Tags): Promise<Tag> {
        const url = new URL(`${this.baseUrl}images/tags/${tagID}`);
        return this.fetchResponse<Tag>(url)
    }

    @preventRateLimit()
    public async getAllArtists(options?: Partial<ArtistOptions>): Promise<Artist[]> {
        const baseUrl = new URL(`${this.baseUrl}artists`);
        const url = this.processSearchParams(baseUrl, [], options);
        return (await this.fetchResponse<ArrayResponse<Artist>>(url)).items
    }

    @preventRateLimit()
    public getArtistByID(artistID: number): Promise<Artist> {
        const url = new URL(`${this.baseUrl}artists/${artistID}`);
        return this.fetchResponse<Artist>(url)
    }

    @preventRateLimit()
    public async getAllCharacters(options?: Partial<CharacterOptions>): Promise<Character[]> {
        const baseUrl = new URL(`${this.baseUrl}artists`);
        const url = this.processSearchParams(baseUrl, [], options);
        return (await this.fetchResponse<ArrayResponse<Character>>(url)).items
    }

    @preventRateLimit()
    public getCharacterByID(characterID: number): Promise<Character> {
        const url = new URL(`${this.baseUrl}characters/${characterID}`);
        return this.fetchResponse<Character>(url)
    }

    private static async checkResponseCode(response: Response) {
        if ((response.status > 200 && response.status <= 300) || !response.ok) {
            throw new Error(`An error occurred while fetching data from the server. ${response.statusText}. Status: ${response.status}. ${response.url}`)
        }
    }

    private processSearchParams(url: URL, tags: TagNames | TagNames[], options: FullImageOptions) {
        const query = tags
            ? Array.isArray(tags)
                ? tags || []
                : [tags]
            : [];

        for (const tag of query) {
            url.searchParams.append("tag", String(Tags[tag]));
        }

        if (options) {
            if (options.character) {
                for (const character of options.character) {
                    url.searchParams.append("character", String(character));
                }
                delete options.character;
            }

            if (options.rating) {
                for (const rating of options.rating) {
                    url.searchParams.append("rating", String(rating));
                }
                delete options.rating;
            }

            for (const [key, value] of Object.entries(options)) {
                url.searchParams.append(key, String(value));
            }
        }

        return url;
    }

    private async fetchResponse<T>(url: URL): Promise<T> {
        const response = await fetch(url);
        await NekosAPI.checkResponseCode(response);
        return <T> await response.json()
    }
}

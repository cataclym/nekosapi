import { URL } from "url";
import { preventRateLimit } from "./preventRateLimit";
import { TagNames, Tags } from "./types/Tags";
import { ImageRandomInterface } from "./types/imageRandomInterface";
import { BaseImageOptions, FullImageOptions } from "./types/baseImageOptions";
import { Tag } from "./types/Tag";

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
    public async getImage(tags?: TagNames | TagNames[], options?: BaseImageOptions): Promise<ImageRandomInterface> {
        options["limit"] = 1;
        return (await this._getRandomImages(tags, options))[0];
    }

    public async getImages(tags?: TagNames | TagNames[], options?: FullImageOptions): Promise<ImageRandomInterface[]> {
        return this._getRandomImages(tags, options);
    }

    private async _getRandomImages(tags: TagNames | TagNames[], options: FullImageOptions) {
        const baseUrl = new URL(`${this.baseUrl}images?`);

        const url = this.processSearchParams(baseUrl, tags, options);

        return this.fetchResponse<ImageRandomInterface[]>(url)
    }

    @preventRateLimit()
    public async getRandomImage(tags?: TagNames | TagNames[], options?: BaseImageOptions): Promise<ImageRandomInterface> {
        return this._getRandomImage(tags, options);
    }

    private async _getRandomImage(tags?: TagNames | TagNames[], options?: BaseImageOptions) {
        const baseUrl = new URL(`${this.baseUrl}images/random?`);

        const url = this.processSearchParams(baseUrl, tags, options);

        return this.fetchResponse<ImageRandomInterface>(url)
    }

    @preventRateLimit()
    public async getImageByID(id: string | number): Promise<ImageRandomInterface> {

        const url = new URL(`${this.baseUrl}images/${id}`);

        return this.fetchResponse<ImageRandomInterface>(url);
    }

    @preventRateLimit()
    public async getAllTags(): Promise<Tag[]> {

        const url = new URL(`${this.baseUrl}images/tags`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return <Tag[]> (await response.json())["items"];
    }

    @preventRateLimit()
    public async getTagByID(tagID: string): Promise<Tag> {

        const url = new URL(`${this.baseUrl}images/tags/${tagID}`);

        return this.fetchResponse<Tag>(url);
    }

    private static async checkResponseCode(response: Response) {
        if ((response.status > 200 && response.status <= 300) || !response.ok) {
            throw new Error(`An error occurred while fetching data from the server. ${response.statusText}. Status: ${response.status}`)
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
            if (options.artist) {
                for (const artist of options.artist) {
                    url.searchParams.append("artist", String(artist));
                }
                delete options.artist;
            }

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

    private async fetchResponse<T>(url: URL) {
        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response);

        return <T> await response.json()
    }

}

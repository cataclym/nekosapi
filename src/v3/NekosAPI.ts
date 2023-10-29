import { URL } from "url";
import { preventRateLimit } from "./preventRateLimit";
import { Tags } from "./types/Tags";
import { ImageRandomInterface } from "./types/imageRandomInterface";
import { ImageOptions } from "./types/imageOptions";
import { Tag } from "./types/Tag";

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
        this.baseUrl = "https://api.nekosapi.com/v3/";
        NekosAPI.lastRequest = new Date();
    }

    // @preventRateLimit()
    // public async getImages(limit = 10, offset = 0): Promise<NekosImage[]> {
    //
    //     if (!this.token) throw new Error("You need a valid access token to use this method.")
    //
    //     const options = {
    //         method: "GET",
    //         headers: {
    //             "Authorization": `Bearer ${this.token}`,
    //         },
    //     };
    //
    //     const url = new URL(`${this.baseUrl}image?`);
    //
    //     url.searchParams.append("offset", String(offset));
    //     url.searchParams.append("limit", String(limit));
    //
    //     const response = await fetch(url, options);
    //
    //     await NekosAPI.checkResponseCode(response);
    //
    //     return (<NekosResponse> await response.json())["data"]
    //         .map(image => new NekosImage(image));
    // }

    @preventRateLimit()
    public async getRandomImage(tags?: Tags | Tags[], options?: ImageOptions): Promise<ImageRandomInterface> {
        return this._getRandomImage(tags, options);
    }

    private async _getRandomImage(tags?: Tags | Tags[], options?: ImageOptions) {

        const query = tags
            ? Array.isArray(tags)
                ? tags || []
                : [tags]
            : [];

        const url = new URL(`${this.baseUrl}images/random?`);

        for (const tag of query) {
            url.searchParams.append("tag", String(tag));
        }

        if (options) {
            for (const [key, value] of Object.entries(options)) {
                url.searchParams.append(key, String(value));
            }
        }

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response);

        return <Promise<ImageRandomInterface>> void response.json()
    }

    @preventRateLimit()
    public async getImageByID(id: string | number): Promise<ImageRandomInterface> {

        const url = new URL(`${this.baseUrl}image/${id}`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return <Promise<ImageRandomInterface>> void response.json();
    }

    // @preventRateLimit()
    // public async getArtistByID(id: string): Promise<Artist> {
    //
    //     const url = new URL(`${this.baseUrl}artist/${id}`);
    //
    //     const response = await fetch(url);
    //
    //     await NekosAPI.checkResponseCode(response)
    //
    //     return (await response.json())["data"] as Artist;
    // }

    // @preventRateLimit()
    // public async getImagesByArtistID(id: string, limit = 10, offset = 0): Promise<NekosImage[]> {
    //
    //     const url = new URL(`${this.baseUrl}artist/${id}/images?`);
    //
    //     url.searchParams.append("limit", String(limit));
    //     url.searchParams.append("offset", String(offset));
    //
    //     const response = await fetch(url);
    //
    //     await NekosAPI.checkResponseCode(response)
    //
    //     return (<NekosResponse> await response.json())["data"]
    //         .map(image => new NekosImage(image));
    // }

    // @preventRateLimit()
    // public async getCharacterByID(id: string): Promise<Character> {
    //
    //     const url = new URL(`${this.baseUrl}character/${id}`);
    //
    //     const response = await fetch(url);
    //
    //     await NekosAPI.checkResponseCode(response)
    //
    //     return (await response.json())["data"] as Character;
    // }

    @preventRateLimit()
    public async getAllTags(): Promise<Tag[]> {

        const url = new URL(`${this.baseUrl}/images/tags`);

        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return <Tag[]> (await response.json())["items"];
    }

    @preventRateLimit()
    public async getTagByID(tagID: string): Promise<Tag> {

        const url = new URL(`${this.baseUrl}images/tags/${tagID}`);
        const response = await fetch(url);

        await NekosAPI.checkResponseCode(response)

        return <Promise<Tag>> void response.json();
    }

    private static validateToken(token?: string) {
        if ((token && !token.match(NekosAPI.tokenRegex)?.length) || !token) {
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

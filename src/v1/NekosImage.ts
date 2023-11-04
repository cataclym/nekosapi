import { Character, Category, HexString, NekosData, NsfwLevel, _Source, Artist, Dimensions } from "./Interfaces";

export default class NekosImage {
    readonly id: string;
    readonly url: string;
    readonly artist: Artist | null;
    readonly source: _Source;
    readonly original: boolean | null;
    readonly nsfw: NsfwLevel;
    readonly categories: Category[];
    readonly characters: Character[];
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

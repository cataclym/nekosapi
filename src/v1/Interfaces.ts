export interface Artist {
    id: string
    name: string
    url?: string
    images?: number
}

export interface _Source {
    name?: string
    url?: string
}

export interface Category {
    id: string;
    name: string;
    description: string;
    nsfw: boolean;
    type: string;
    createdAt: Date;
}

export interface Character {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
}

export interface Dimensions {
    width: number,
    height: number,
    orientation: ImageOrientation,
}

export interface NekosResponse {
    data: NekosData[];
    success: boolean;
}

export interface NekosData {
    id: string;
    url: string;
    artist: null;
    source: _Source;
    original: null;
    nsfw: string;
    categories: Category[];
    characters: any[];
    createdAt: Date;
    meta: Meta;
}

export interface Meta {
    eTag: string;
    size: number;
    mimetype: string;
    color: string;
    expires: Date;
    dimens: Dimensions;
}

type ArrayOrNot<T extends boolean> = T extends true
    ? Category[]
    : Category;

export interface NekosCategoryResponse<T extends boolean> {
    data: ArrayOrNot<T>;
    success: boolean;
}

export type ImageOrientation = "landscape" | "portrait" | "square";
export type HexString = `#${string}`;
export type NsfwLevel = null | "sfw" | "questionable" | "nsfw";

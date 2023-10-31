import { IntRange } from "./IntRange";

export interface BaseImageOptions {
    rating?: Rating[],
    is_original?: boolean,
    is_screenshot?: boolean,
    is_flagged?: boolean,
    is_animated?: boolean,
    artist?: number[],
    character?: number[]
}

export interface FullImageOptions extends BaseImageOptions {
    limit?: IntRange<0, 100>,
    offset?: number,
}

export type Rating = "suggestive"
    | "safe"
    | "borderline"
    | "explicit"

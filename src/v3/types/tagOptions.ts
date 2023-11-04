import { IntRange } from "./IntRange";

export interface TagOptions {
    search: string,
    is_nsfw: boolean,
    limit: IntRange<1, 100>
    offset: number
}

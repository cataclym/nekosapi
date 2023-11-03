import { IntRange } from "./IntRange";

export interface ArtistOptions {
    search: string,
    policy_repost: boolean,
    policy_credit: boolean,
    policy_ai: boolean,
    limit: IntRange<1, 100>
    offset: number
}

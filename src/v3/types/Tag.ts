import { TagNames, Tags } from "./Tags";

export type Tag = {
    "id": `${Tags}`,
    "name": TagNames,
    "description": string,
    "sub": string,
    "is_nsfw": boolean
}

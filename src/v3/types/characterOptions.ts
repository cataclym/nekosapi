import { IntRange } from "./IntRange";

// ToDo look into gender, species, nationality strings
export interface CharacterOptions {
    search: string,
    age: number[],
    gender: string,
    species: boolean,
    nationality: string
    occupation: string
    limit: IntRange<1, 100>
    offset: number
}

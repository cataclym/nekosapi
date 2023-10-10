import { type NekosFilterDate, type NekosFilterString } from "./common"

export type NekosCategoriesString = "search"
| "name"
| `name.${NekosFilterString}`

// TODO Change to number ranges and dates.
export type NekosCategoriesNumber =
| "createdAt"
| `createdAt.${NekosFilterDate}`
| "updatedAt"
| `updatedAt.${NekosFilterDate}`

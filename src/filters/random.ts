import { type NekosFilterString, type NekosFilterNumber } from "./common"
import { type NekosCategoriesNumber, type NekosCategoriesString } from "./categories"

export type RandomFilter = [stringTypes, string]
| [numberTypes, number]
| [booleanTypes, boolean]
| [`categories.${NekosCategoriesString}`, string]
| [`categories.${NekosCategoriesNumber}`, string]

type stringTypes = "search"
| "id"
| "id.in"
| "title"
| `title.${NekosFilterString}`
| "ageRating"
| "ageRating.iexact"
| "ageRating.in"
| "aspectRatio"
| "aspectRatio.startswith"
| "aspectRatio.endswith"
| "aspectRatio.regex"
| "verificationStatus"
| `verificationStatus.${NekosFilterString}`
| "sourceName"
| `sourceName.${NekosFilterString}`
| "sourceName.isnull"
| "sourceUrl"
| `sourceUrl.${NekosFilterString}`
| "sourceUrl.isnull"

type numberTypes = "height"
| `height.${NekosFilterNumber}`
| "width"
| `width.${NekosFilterNumber}`

type booleanTypes = "ageRating.isnull"
| "isOriginal"
| "isOriginal.isnull"

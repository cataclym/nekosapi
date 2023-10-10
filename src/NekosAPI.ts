import { URL } from "url"
import { type Artist, type Category, type Character, type NekosCategoryResponse, type NekosResponse } from "./Interfaces"
import NekosImage from "./NekosImage"
import { preventRateLimit } from "./preventRateLimit"
import { type RandomFilter } from "./filters/random"
import { promises } from "dns"

export class NekosAPI {
  private readonly token: string | undefined
  private readonly baseUrl: string
  /*
    * Last time a request was sent to the API
    */
  public static lastRequest = new Date()

  private readonly getHeaders = {
    Accept: "application/vnd.api+json"
  }

  private readonly requestHeaders = {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json"
  }

  public constructor (token?: string) {
    if ((token != null) && NekosAPI.validateToken(token)) {
      this.token = token
    }
    this.baseUrl = "https://api.nekosapi.com/v2/"
    NekosAPI.lastRequest = new Date()
  }

  @preventRateLimit()
  public async getImages (limit = 10, offset = 0): Promise<NekosImage[]> {
    if (this.token == null) throw new Error("You need a valid access token to use this method.")

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }

    const url = new URL(`${this.baseUrl}image?`)

    url.searchParams.append("offset", String(offset))
    url.searchParams.append("limit", String(limit))

    const response = await fetch(url, options)

    await NekosAPI.checkResponseCode(response)

    return (await response.json() as NekosResponse).data
      .map(image => new NekosImage(image))
  }

  @preventRateLimit()
  public async getRandomImages (categories?: RandomFilter | RandomFilter[], limit?: number): Promise<NekosImage[]> {
    return await this._getRandomImages(categories, limit)
  }

  @preventRateLimit()
  public async getRandomImage (filters?: RandomFilter | RandomFilter[]): Promise<NekosImage> {
    return (await this._getRandomImages(filters, 1))[0]
  }

  private async _getRandomImages (filters?: RandomFilter | RandomFilter[], limit?: number): Promise<NekosImage[]> {
    const url = new URL(`${this.baseUrl}images/random?`)

    if (filters != null) {
      if (typeof filters[0] !== "string") {
        for (const filter of filters) {
          url.searchParams.append(`filter[${filter[0]}]`, String(filter[1]))
        }
      } else {
        url.searchParams.append(`filter[${filters[0]}]`, String(filters[1]))
      }
    }

    const limitQuery = limit ?? 1

    url.searchParams.append("page[limit]", String(limitQuery))

    const response = await fetch(url)

    await NekosAPI.checkResponseCode(response)

    return (await response.json() as NekosResponse).data
      .map(image => new NekosImage(image))
  }

  @preventRateLimit()
  public async getImageByID (id: string): Promise<NekosImage> {
    const url = new URL(`${this.baseUrl}image/${id}`)

    const response = await fetch(url)

    await NekosAPI.checkResponseCode(response)

    return new NekosImage((await response.json()).data)
  }

  @preventRateLimit()
  public async getArtistByID (id: string): Promise<Artist> {
    const url = new URL(`${this.baseUrl}artist/${id}`)

    const response = await fetch(url)

    await NekosAPI.checkResponseCode(response)

    return (await response.json()).data as Artist
  }

  @preventRateLimit()
  public async getImagesByArtistID (id: string, limit = 10, offset = 0): Promise<NekosImage[]> {
    const url = new URL(`${this.baseUrl}artist/${id}/images?`)

    url.searchParams.append("limit", String(limit))
    url.searchParams.append("offset", String(offset))

    const response = await fetch(url)

    await NekosAPI.checkResponseCode(response)

    return (await response.json() as NekosResponse).data
      .map(image => new NekosImage(image))
  }

  @preventRateLimit()
  public async getCharacterByID (id: string): Promise<Character> {
    const url = new URL(`${this.baseUrl}character/${id}`)

    const response = await fetch(url)

    await NekosAPI.checkResponseCode(response)

    return (await response.json()).data as Character
  }

  @preventRateLimit()
  public async getCategories (limit = 10, offset = 0): Promise<Category[]> {
    const url = new URL(`${this.baseUrl}category?`)

    url.searchParams.append("limit", String(limit))
    url.searchParams.append("offset", String(offset))

    const response = await fetch(url)

    await NekosAPI.checkResponseCode(response)

    return (await response.json() as NekosCategoryResponse<true>).data
  }

  @preventRateLimit()
  public async getCategoryByID (categoryID: string): Promise<Category> {
    const url = new URL(`${this.baseUrl}category/${categoryID}`)
    const response = await fetch(url)

    await NekosAPI.checkResponseCode(response)

    return (await response.json() as NekosCategoryResponse<false>).data
  }

  private static validateToken (token?: string): boolean {
    if (((token?.match(NekosAPI.tokenRegex)?.length) == null) || (token === "")) {
      throw new Error("The token is invalid. It should be 100 characters long and contain numbers and lowercase/uppercase characters.")
    } else {
      return true
    }
  }

  private static async checkResponseCode (response: Response): Promise<void> {
    if ((response.status > 200 && response.status <= 300) || !response.ok) {
      throw new Error(`An error occurred while fetching the data from the server. ${response.statusText}. Status: ${response.status}`)
    }
  }

  private static readonly tokenRegex = /^[0-9a-zA-Z]{100}$/g
}

import { FilmScreening } from '#core/film_screening/entities/film_screening/film_screening'
import { FilmScreeningGateway } from '#core/film_screening/gateways/film_screening_gateway'

export class InMemoryFilmScreeningGateway implements FilmScreeningGateway {
  private readonly _filmScreenings: FilmScreening[] = []

  async count(): Promise<number> {
    return this._filmScreenings.length
  }

  async save(filmScreening: FilmScreening): Promise<void> {
    this._filmScreenings.push(filmScreening)
  }

  get filmScreenings(): FilmScreening[] {
    return this._filmScreenings
  }
}

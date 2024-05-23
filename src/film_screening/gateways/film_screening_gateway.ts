import { FilmScreening } from '#core/film_screening/entities/film_screening/film_screening'

export interface FilmScreeningGateway {
  count: () => Promise<number>
  save(filmScreening: FilmScreening): Promise<void>
}

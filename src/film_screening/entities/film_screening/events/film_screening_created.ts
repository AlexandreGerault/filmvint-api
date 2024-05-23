import { DomainEvent } from '#core/domain_event'
import { FilmScreeningId } from '#core/film_screening/entities/film_screening/film_screening'

export class FilmScreeningCreated implements DomainEvent {
  readonly type = 'FILM_SCREENING_CREATED'
  readonly occurredAt = new Date()
  readonly filmScreeningId: FilmScreeningId

  constructor(filmScreeningId: FilmScreeningId) {
    this.filmScreeningId = filmScreeningId
  }
}

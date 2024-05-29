import { AggregateRoot } from '#core/aggregate_root'
import { FilmScreeningCreated } from '#core/film_screening/entities/film_screening/events/film_screening_created'
import { FilmTitle } from '#core/film_screening/entities/film_screening/film_title'
import { Price } from '#core/film_screening/entities/film_screening/price'
import { randomUUID } from 'node:crypto'

interface FilmScreeningSnapshot {}

export class FilmScreeningId {
  readonly value: string

  constructor(value: string) {
    this.value = value
  }

  static create(value: string): FilmScreeningId {
    return new FilmScreeningId(value)
  }

  static generate(): FilmScreeningId {
    return new FilmScreeningId(randomUUID())
  }

  static of(uuid: string): FilmScreeningId {
    return new FilmScreeningId(uuid)
  }
}

export class FilmScreening extends AggregateRoot<FilmScreeningId> {
  constructor(
    filmScreeningId: FilmScreeningId,
    private title: FilmTitle,
    private cinemaBookingPrice: Price,
    private seatBookingPrice: Price,
    private startsAt: Date
  ) {
    super(filmScreeningId)
  }

  static create(input: {
    filmScreeningId: string
    seatBookingPrice: number
    cinemaBookingPrice: number
    title: string
    startsAt: string
  }): FilmScreening {
    const filmScreening = new FilmScreening(
      FilmScreeningId.of(input.filmScreeningId),
      FilmTitle.of(input.title),
      Price.of(input.cinemaBookingPrice),
      Price.of(input.seatBookingPrice),
      new Date(input.startsAt)
    )

    filmScreening.emit(new FilmScreeningCreated(filmScreening._id))

    return filmScreening
  }

  snapshot(): FilmScreeningSnapshot {
    return {
      filmScreeningId: this._id.value,
      title: this.title.value,
      cinemaBookingPrice: this.cinemaBookingPrice.value,
      seatBookingPrice: this.seatBookingPrice.value,
      startsAt: this.startsAt.toISOString(),
    }
  }
}

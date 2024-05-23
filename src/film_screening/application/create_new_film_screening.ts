import { EventPublisher } from '#core/event_publisher'
import { FilmScreening } from '#core/film_screening/entities/film_screening/film_screening'
import { FilmScreeningGateway } from '#core/film_screening/gateways/film_screening_gateway'

export interface CreateNewFilmScreeningPresenter {
  filmScreeningCreatedSuccessfully(): void
}

export interface CreateNewFilmScreeningProps {
  filmScreeningId: string
  title: string
  startsAt: string
  seatBookingPrice: number
  cinemaBookingPrice: number
}

export class CreateNewFilmScreening {
  constructor(
    private readonly repository: FilmScreeningGateway,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(input: CreateNewFilmScreeningProps, presenter: CreateNewFilmScreeningPresenter) {
    const filmScreening = FilmScreening.create(input)

    this.repository.save(filmScreening)

    presenter.filmScreeningCreatedSuccessfully()

    this.eventPublisher.publish([...filmScreening.domainEvents()])
  }
}

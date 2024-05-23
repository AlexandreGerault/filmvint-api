import { InMemoryFilmScreeningGateway } from '#core/film_screening/__test__/in_memory_screening_gateway'
import { CreateNewFilmScreening } from '#core/film_screening/application/create_new_film_screening'
import { InMemoryEventPublisher } from '#core/shared/__tests__/in_memory_event_publisher'
import { CreateNewSessionTestPresenter } from '#core/film_screening/__test__/create_new_screening/create_new_film_screening.presenter'

export function createNewFilmScreeningSut() {
  return {
    build() {
      const repository = new InMemoryFilmScreeningGateway()
      const presenter = new CreateNewSessionTestPresenter()
      const eventPublisher = new InMemoryEventPublisher()
      const useCase = new CreateNewFilmScreening(repository, eventPublisher)

      return {
        createNewFilmScreening(input: {
          filmScreeningId: string
          title: string
          startsAt: string
          seatBookingPrice: number
          cinemaBookingPrice: number
        }) {
          useCase.execute(input, presenter)
        },
        repository,
        getEvents() {
          return eventPublisher.events
        },
        getResponse() {
          return presenter.response
        },
      }
    },
  }
}

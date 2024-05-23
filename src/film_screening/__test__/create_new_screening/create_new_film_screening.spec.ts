import { createNewFilmScreeningSut } from '#core/film_screening/__test__/create_new_screening/create_new_film_screening.sut'
import { FilmScreeningCreated } from '#core/film_screening/entities/film_screening/events/film_screening_created'
import { test } from '@japa/runner'

test.group('Film screening / Create a new film screening session', () => {
  test('an admin can create a new film screening session', async ({ assert }) => {
    const { createNewFilmScreening, repository, getResponse, getEvents } =
      createNewFilmScreeningSut().build()

    await createNewFilmScreening({
      filmScreeningId: '1',
      title: 'The Matrix',
      startsAt: '2021-01-01T12:00:00.000Z',
      seatBookingPrice: 10_00, // 10.00€
      cinemaBookingPrice: 2_000_00, // 2000.00€
    })

    const createdFilmScreening = structuredClone(repository.filmScreenings[0].snapshot())

    assert.equal(await repository.count(), 1)
    assert.deepEqual(createdFilmScreening, {
      filmScreeningId: '1',
      title: 'The Matrix',
      startsAt: '2021-01-01T12:00:00.000Z',
      seatBookingPrice: 10_00, // 10.00€
      cinemaBookingPrice: 2_000_00, // 2000.00€
    })
    assert.equal(getResponse(), 'Film screening created successfully')
    assert.lengthOf(getEvents(), 1)
    assert.instanceOf(getEvents()[0], FilmScreeningCreated)
  })
})

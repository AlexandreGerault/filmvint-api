import { CreateNewFilmScreeningPresenter } from '#core/film_screening/application/create_new_film_screening'

export class CreateNewSessionTestPresenter implements CreateNewFilmScreeningPresenter {
  response: string | null = null

  filmScreeningCreatedSuccessfully(): void {
    this.response = 'Film screening created successfully'
  }
}

export class FilmTitle {
  readonly value: string

  constructor(value: string) {
    this.value = value
  }

  static of(value: string): FilmTitle {
    return new FilmTitle(value)
  }
}
